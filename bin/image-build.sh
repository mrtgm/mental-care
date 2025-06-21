#!/bin/bash

set -e

# Build and push all containers
echo "🚀 Building and pushing multi-architecture images..."

# Setup buildx
docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder

# Build frontend
echo "📦 Building frontend..."
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/mrtgm/mental-frontend:prod \
  -t ghcr.io/mrtgm/mental-frontend:staging \
  --push ./frontend

# Build backend
echo "📦 Building backend..."
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/mrtgm/mental-backend:prod \
  -t ghcr.io/mrtgm/mental-backend:staging \
  --push ./backend

echo "✅ All images built and pushed successfully!"
echo ""
echo "Images pushed:"
echo "  - ghcr.io/mrtgm/mental-frontend:prod"
echo "  - ghcr.io/mrtgm/mental-frontend:staging"
echo "  - ghcr.io/mrtgm/mental-backend:prod"
echo "  - ghcr.io/mrtgm/mental-backend:staging"
