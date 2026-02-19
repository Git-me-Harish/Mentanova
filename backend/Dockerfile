# =========================
# 1️⃣ Frontend build stage
# =========================
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy frontend source and build
COPY frontend/ .
RUN npm run build

# =========================
# 2️⃣ Backend + API stage
# =========================
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ backend/

# Copy built frontend into backend static folder
COPY --from=frontend-builder /frontend/dist backend/static

# Set PYTHONPATH
ENV PYTHONPATH=/app/backend

# Expose port for Render
EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "alembic -c backend/alembic.ini upgrade head && uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
