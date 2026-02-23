# ============================================
# STAGE 1: BUILD FRONTEND
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ .
RUN npm run build
RUN test -f dist/index.html && echo "✅ Frontend built" || exit 1


# ============================================
# STAGE 2: BACKEND + FRONTEND
# ============================================
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    postgresql-client \
    libpq-dev \
    poppler-utils \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps (includes psycopg2 for Alembic)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir psycopg2-binary

# Copy backend (includes alembic/ directory)
COPY backend/ .

# Copy frontend build
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

# Create dirs
RUN mkdir -p data/uploads/branding data/processed logs

# Make startup script executable
RUN chmod +x /app/scripts/start.sh

# Verify
RUN ls -la /app/frontend/dist/index.html && echo "✅ Frontend ready" && \
    ls -la /app/alembic/versions/ && echo "✅ Migrations ready" && \
    ls -la /app/scripts/start.sh && echo "✅ Start script ready"

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/v1/health || exit 1

CMD ["/app/scripts/start.sh"]
