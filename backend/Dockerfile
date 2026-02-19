# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# Stage 2: Build Python backend
FROM python:3.11-slim

WORKDIR /app/backend

ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy React build into backend/static
COPY --from=frontend-builder /app/frontend/build ./static

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
