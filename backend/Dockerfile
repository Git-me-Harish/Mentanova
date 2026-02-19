# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Copy only package files first for caching
COPY frontend/package.json frontend/package-lock.json* ./

RUN npm install

# Copy all frontend files
COPY frontend/ .

# Build React app (outputs /frontend/build)
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.11-slim
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ backend/

# Copy frontend build into backend static folder
COPY --from=frontend-builder /frontend/build backend/static

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
