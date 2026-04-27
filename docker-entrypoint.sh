#!/bin/sh
set -e

echo "Starting Coze Mini Program..."

# 启动后端服务
echo "Starting backend server on port 3000..."
cd /app && node server/dist/main.js &
BACKEND_PID=$!

# 等待后端服务启动
echo "Waiting for backend to start..."
sleep 5

# 启动 nginx
echo "Starting nginx..."
nginx

echo "Coze Mini Program started successfully!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3000/api"

# 保持容器运行
wait $BACKEND_PID
