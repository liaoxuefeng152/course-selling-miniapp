#!/bin/bash

# 开发服务器修复脚本

echo "========================================="
echo "  开发服务器修复工具"
echo "========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 步骤 1: 停止所有进程
echo -e "${YELLOW}[1/5] 停止所有开发进程...${NC}"
pkill -f 'concurrently' 2>/dev/null || true
pkill -f 'nest start' 2>/dev/null || true
pkill -f 'taro build' 2>/dev/null || true
sleep 2
echo -e "${GREEN}✓ 进程已停止${NC}"
echo ""

# 步骤 2: 清理端口
echo -e "${YELLOW}[2/5] 清理端口占用...${NC}"
if lsof -i:3000 > /dev/null 2>&1; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ 端口 3000 已清理${NC}"
fi

if lsof -i:5000 > /dev/null 2>&1; then
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ 端口 5000 已清理${NC}"
fi

if lsof -i:5173 > /dev/null 2>&1; then
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ 端口 5173 已清理${NC}"
fi
echo ""

# 步骤 3: 清理缓存
echo -e "${YELLOW}[3/5] 清理缓存...${NC}"
rm -rf .turbo 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf server/dist 2>/dev/null || true
echo -e "${GREEN}✓ 缓存已清理${NC}"
echo ""

# 步骤 4: 重新安装依赖（可选）
echo -e "${YELLOW}[4/5] 检查依赖...${NC}"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.pnpm/lock.yaml" ]; then
    echo "依赖不完整，正在重新安装..."
    pnpm install
    echo -e "${GREEN}✓ 依赖已安装${NC}"
else
    echo -e "${GREEN}✓ 依赖完整${NC}"
fi
echo ""

# 步骤 5: 启动开发服务器
echo -e "${YELLOW}[5/5] 启动开发服务器...${NC}"
echo ""
echo -e "${GREEN}开发服务器已修复！${NC}"
echo ""
echo "现在可以运行以下命令启动："
echo "  pnpm dev"
echo ""
echo "或者运行诊断检查："
echo "  pnpm diagnose"
echo ""
echo "查看日志："
echo "  tail -f /tmp/coze-logs/dev.log"
echo ""
