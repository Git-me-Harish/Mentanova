"""
Main FastAPI application entry point.
Handles API routes, SPA frontend, middleware, and app lifecycle.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from loguru import logger
from pathlib import Path
import sys

from app.core.config import settings
from app.db.session import init_db, close_db

# Import routers
from app.api.endpoints import (
    health, auth, documents, search, chat, customization,
    organization, admin, document_editor
)

# -------------------- LOGGING --------------------
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level:<8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level=settings.log_level,
    colorize=True
)
logger.add(
    settings.log_file,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level:<8} | {name}:{function}:{line} - {message}",
    level=settings.log_level,
    rotation=settings.log_rotation,
    retention=settings.log_retention,
    compression="zip"
)

# -------------------- LIFESPAN --------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Novera AI Knowledge Assistant...")
    logger.info(f"Environment: {settings.environment}, Debug: {settings.debug}")
    
    # Startup tasks
    try:
        await init_db()
        logger.info("✅ Database initialized")

        # Upload directories
        Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
        Path(settings.upload_dir, "branding").mkdir(parents=True, exist_ok=True)
        logger.info("✅ Upload directories created")

        # Preload embedding model
        try:
            from app.services.embedding.embedding_service import embedding_service
            embedding_service.use_local_fallback = True
            embedding_service._init_local_model()
            logger.info("✅ Embedding model pre-loaded")
        except Exception as e:
            logger.warning(f"⚠️ Embedding pre-load failed: {e}")

    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise

    yield

    # Shutdown tasks
    try:
        await close_db()
        logger.info("✅ Database connections closed")
    except Exception as e:
        logger.error(f"❌ Shutdown error: {e}")


# -------------------- APP --------------------
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered knowledge assistant with RAG capabilities",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
    openapi_url="/api/openapi.json" if settings.debug else None,
    lifespan=lifespan
)

# -------------------- MIDDLEWARE --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
logger.info(f"✅ Middleware configured, CORS origins: {settings.cors_origins_list}")

# -------------------- STATIC FILES --------------------
# Uploads
upload_path = Path(settings.upload_dir)
app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")
logger.info(f"✅ Uploads mounted at /uploads -> {upload_path}")

# React frontend
frontend_path = Path(__file__).resolve().parents[1] / "static"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")
    logger.info(f"✅ Frontend static files mounted at /static -> {frontend_path}")

# -------------------- ROUTERS --------------------
routers = [
    (health.router, "Health"),
    (auth.router, "Authentication"),
    (documents.router, "Documents"),
    (search.router, "Search"),
    (chat.router, "Chat"),
    (customization.router, "Customization"),
    (organization.router, "Organizations"),
    (admin.router, "Admin"),
    (document_editor.router, "Document Editor")
]

for router, tag in routers:
    app.include_router(router, prefix=settings.api_v1_prefix, tags=[tag])

# -------------------- SPA ROUTING --------------------
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """
    Serve React SPA for all non-API routes
    """
    if full_path.startswith(settings.api_v1_prefix.strip("/")):
        return JSONResponse({"error": "Not Found"}, status_code=404)

    index_file = frontend_path / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"error": "Frontend not built"}, status_code=500)

@app.get("/")
async def root():
    index_file = frontend_path / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"error": "Frontend not built"}, status_code=500)

# -------------------- EXCEPTION HANDLERS --------------------
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(status_code=500, content={"error": "Internal server error"})

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.exception(f"Database error: {exc}")
    return JSONResponse(status_code=500, content={"error": "Database error"})

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(status_code=400, content={"error": "Database integrity error"})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"error": "Validation error", "details": exc.errors()})

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

# -------------------- RUN --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(settings.port),
        workers=1 if settings.debug else settings.workers,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
