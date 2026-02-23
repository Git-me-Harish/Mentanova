# ============================================
# STAGE 1: BUILD FRONTEND
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Install dependencies (cached layer)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY frontend/ .
RUN npm run build

# Verify build output
RUN echo "=== Frontend build output ===" && \
    ls -la dist/ && \
    echo "=== index.html exists ===" && \
    test -f dist/index.html && echo "YES" || echo "NO"


# ============================================
# STAGE 2: PYTHON BACKEND + FRONTEND BUILD
# ============================================
FROM python:3.11-slim

# Install system dependencies
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

# Install Python dependencies (cached layer)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ .

# Copy frontend build from Stage 1
COPY --from=frontend-builder /frontend/dist /app/frontend/dist

# Create runtime directories
RUN mkdir -p data/uploads/branding data/processed logs

# Verify everything is in place
RUN echo "=== App structure ===" && \
    ls -la /app/ && \
    echo "=== Frontend dist ===" && \
    ls -la /app/frontend/dist/ && \
    echo "=== Frontend assets ===" && \
    ls -la /app/frontend/dist/assets/ 2>/dev/null || echo "No assets dir yet" && \
    echo "=== index.html check ===" && \
    test -f /app/frontend/dist/index.html && echo "FOUND" || echo "MISSING"

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/api/v1/health || exit 1

# Start with Render's $PORT or default 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
