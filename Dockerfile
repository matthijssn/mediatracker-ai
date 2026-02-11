# Multi-stage build for all services and frontend

# Stage 1: Build Node services
FROM node:18-bullseye-slim AS services-build
WORKDIR /build

# Install build tools needed by many npm packages
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential python3 make g++ curl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy all service package.json files
COPY services/media-service/package*.json ./services/media-service/
COPY services/recommendation-service/package*.json ./services/recommendation-service/
COPY services/preferences-service/package*.json ./services/preferences-service/
COPY services/api-gateway/package*.json ./services/api-gateway/

# Install dependencies for each service
RUN cd services/media-service && npm install --no-audit --no-fund
RUN cd services/recommendation-service && npm install --no-audit --no-fund
RUN cd services/preferences-service && npm install --no-audit --no-fund
RUN cd services/api-gateway && npm install --no-audit --no-fund

# Copy and build source
COPY services/media-service/tsconfig.json ./services/media-service/
COPY services/media-service/src ./services/media-service/src
COPY services/recommendation-service/tsconfig.json ./services/recommendation-service/
COPY services/recommendation-service/src ./services/recommendation-service/src
COPY services/preferences-service/tsconfig.json ./services/preferences-service/
COPY services/preferences-service/src ./services/preferences-service/src
COPY services/api-gateway/tsconfig.json ./services/api-gateway/
COPY services/api-gateway/src ./services/api-gateway/src

RUN cd services/media-service && npm run build
RUN cd services/recommendation-service && npm run build
RUN cd services/preferences-service && npm run build
RUN cd services/api-gateway && npm run build

# Stage 2: Build Angular frontend
FROM node:18-alpine AS frontend-build
WORKDIR /build

COPY frontend/package*.json ./
# Use npm ci when lockfile exists, fallback to npm install; disable audit/funding for CI environments
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund || npm install --no-audit --no-fund; else npm install --no-audit --no-fund; fi

COPY frontend/angular.json tsconfig*.json ./
COPY frontend/src ./src

RUN npm run build -- --configuration production

# Stage 3: Runtime image (Nginx + Node services)
FROM node:18-bullseye-slim
WORKDIR /app

# Install Nginx and utilities
RUN apt-get update \
	&& apt-get install -y --no-install-recommends nginx curl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Copy services from build stage
COPY --from=services-build /build/services ./services

# Copy frontend dist to Nginx
COPY --from=frontend-build /build/dist/frontend /usr/share/nginx/html

# Copy Nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports for services and Nginx
EXPOSE 80 3000 4000 4100 4200

# Set environment defaults
ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongo:27017/mediatracker

ENTRYPOINT ["/entrypoint.sh"]
