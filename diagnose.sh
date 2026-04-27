#!/bin/bash

# 开发服务器诊断脚本

echo "========================================="
echo "  开发服务器诊断"
echo "========================================="
echo ""

# 检查端口占用
echo "1. 检查端口占用..."
echo ""

if command -v netstat &> /dev/null; then
    echo "端口 3000 (后端):"
    netstat -tuln 2>/dev/null | grep :3000 || echo "  未监听"

    echo ""
    echo "端口 5000 (前端):"
    netstat -tuln 2>/dev/null | grep :5000 || echo "  未监听"

    echo ""
    echo "端口 5173 (Vite 默认):"
    netstat -tuln 2>/dev/null | grep :5173 || echo "  未监听"
elif command -v ss &> /dev/null; then
    echo "端口 3000 (后端):"
    ss -tuln 2>/dev/null | grep :3000 || echo "  未监听"

    echo ""
    echo "端口 5000 (前端):"
    ss -tuln 2>/dev/null | grep :5000 || echo "  未监听"

    echo ""
    echo "端口 5173 (Vite 默认):"
    ss -tuln 2>/dev/null | grep :5173 || echo "  未监听"
else
    echo "无法检查端口占用（缺少 netstat 或 ss 命令）"
fi

echo ""

# 检查运行中的进程
echo "2. 检查运行中的进程..."
echo ""

PROCESSES=$(ps aux | grep -E "concurrently|nest start|taro build|node.*dev" | grep -v grep | grep -v诊断)

if [ -n "$PROCESSES" ]; then
    echo "$PROCESSES" | while read line; do
        echo "  $line"
    done
else
    echo "  未找到相关进程"
fi

echo ""

# 检查 Node.js 版本
echo "3. 检查 Node.js 版本..."
echo ""

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  Node.js 版本: $NODE_VERSION"

    # 检查是否满足最低要求
    REQUIRED_VERSION="18.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo "  ✓ 版本满足要求 (>= 18.0.0)"
    else
        echo "  ✗ 版本过低 (需要 >= 18.0.0)"
    fi
else
    echo "  ✗ 未找到 Node.js"
fi

echo ""

# 检查 pnpm 版本
echo "4. 检查 pnpm 版本..."
echo ""

if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "  pnpm 版本: $PNPM_VERSION"
else
    echo "  ✗ 未找到 pnpm"
fi

echo ""

# 检查依赖
echo "5. 检查依赖..."
echo ""

if [ -f "node_modules" ] || [ -d "node_modules" ]; then
    DEPENDENCY_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
    echo "  ✓ node_modules 存在 ($DEPENDENCY_COUNT 个包)"
else
    echo "  ✗ node_modules 不存在，请运行 pnpm install"
fi

echo ""

# 检查日志
echo "6. 检查最近的错误日志..."
echo ""

if [ -f "/tmp/coze-logs/dev.log" ]; then
    echo "  最近的错误:"
    tail -20 /tmp/coze-logs/dev.log 2>/dev/null | grep -iE "error|exception|fatal|fail" | head -10 || echo "  无错误日志"
else
    echo "  未找到日志文件"
fi

echo ""

# 健康检查
echo "7. 健康检查..."
echo ""

# 检查后端
if curl -s -f http://localhost:3000/api > /dev/null 2>&1; then
    echo "  ✓ 后端服务正常 (http://localhost:3000/api)"
else
    echo "  ✗ 后端服务无响应"
fi

# 检查前端
if curl -s -f http://localhost:5000 > /dev/null 2>&1; then
    echo "  ✓ 前端服务正常 (http://localhost:5000)"
else
    echo "  ✗ 前端服务无响应"
fi

echo ""

# 建议
echo "========================================="
echo "  建议操作"
echo "========================================="
echo ""

# 根据检查结果给出建议
if curl -s -f http://localhost:3000/api > /dev/null 2>&1 && curl -s -f http://localhost:5000 > /dev/null 2>&1; then
    echo "✓ 服务运行正常，无需操作"
else
    echo "如果服务无法启动，请尝试以下步骤："
    echo ""
    echo "1. 清理端口占用："
    echo "   pnpm kill-port 3000 5000"
    echo ""
    echo "2. 重新安装依赖："
    echo "   rm -rf node_modules"
    echo "   pnpm install"
    echo ""
    echo "3. 清理缓存并重新启动："
    echo "   rm -rf .turbo"
    echo "   pnpm dev"
    echo ""
    echo "4. 如果仍然失败，查看详细日志："
    echo "   tail -f /tmp/coze-logs/dev.log"
fi

echo ""
echo "诊断完成！"
