#!/bin/sh
set -e

echo "Starting MediaTracker services..."

# Start each service in the background
echo "Starting API Gateway on port 3000..."
cd /app/services/api-gateway && node dist/server.js &
API_GATEWAY_PID=$!

echo "Starting Media Service on port 4000..."
cd /app/services/media-service && node dist/server.js &
MEDIA_PID=$!

echo "Starting Recommendation Service on port 4100..."
cd /app/services/recommendation-service && node dist/server.js &
REC_PID=$!

echo "Starting Preferences Service on port 4200..."
cd /app/services/preferences-service && node dist/server.js &
PREFS_PID=$!

echo "Starting Nginx (Frontend on port 80)..."
nginx -g 'daemon off;' &
NGINX_PID=$!

echo "All services started. Press Ctrl+C to stop."

# Wait for all processes
wait $API_GATEWAY_PID $MEDIA_PID $REC_PID $PREFS_PID $NGINX_PID
