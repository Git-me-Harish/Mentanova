# =========================
# 1️⃣ Frontend Build Stage
# =========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy only package files first (better caching)
COPY frontend/package*.json ./
RUN npm install

# Copy full frontend source
COPY frontend/ .

# Build frontend (Vite → dist)
RUN npm run build


# =========================
# 2️⃣ Backend Stage
# =========================
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend into backend/static
COPY --from=frontend-builder /app/frontend/dist ./backend/static

# Set Python path so imports work
ENV PYTHONPATH=/app/backend

# Expose port (Render sets PORT automatically)
EXPOSE 8000

# Run migrations, then start server
CMD ["sh", "-c", "alembic -c backend/alembic.ini upgrade head && uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
