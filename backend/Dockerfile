# ----------------------------
# Stage 1: Build React frontend
# ----------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy only frontend package files first for caching
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ .

# Build React app
RUN npm run build

# ----------------------------
# Stage 2: Build FastAPI backend
# ----------------------------
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app/backend

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy React build from previous stage
COPY --from=frontend-builder /app/frontend/build ./static

# Expose port for Render
EXPOSE 8000

# Start FastAPI using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
