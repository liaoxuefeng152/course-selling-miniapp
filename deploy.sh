#!/bin/bash

# Coze Mini Program Docker 部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 项目名称
PROJECT_NAME="coze-mini-program"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Coze Mini Program Docker 部署${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    echo "请先安装 Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# 解析命令
COMMAND=${1:-"help"}

case $COMMAND in
    "build")
        echo -e "${YELLOW}构建 Docker 镜像...${NC}"
        docker-compose build
        echo -e "${GREEN}✓ 构建完成${NC}"
        ;;

    "up"|"start")
        echo -e "${YELLOW}启动服务...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✓ 服务已启动${NC}"
        echo ""
        echo "访问地址："
        echo "  前端: http://localhost"
        echo "  后端: http://localhost:3000/api"
        echo ""
        echo "查看日志: docker-compose logs -f"
        ;;

    "down"|"stop")
        echo -e "${YELLOW}停止服务...${NC}"
        docker-compose down
        echo -e "${GREEN}✓ 服务已停止${NC}"
        ;;

    "restart")
        echo -e "${YELLOW}重启服务...${NC}"
        docker-compose restart
        echo -e "${GREEN}✓ 服务已重启${NC}"
        ;;

    "logs")
        echo -e "${YELLOW}查看日志...${NC}"
        docker-compose logs -f
        ;;

    "ps")
        echo -e "${YELLOW}查看服务状态...${NC}"
        docker-compose ps
        ;;

    "clean")
        echo -e "${YELLOW}清理容器和网络...${NC}"
        docker-compose down
        docker system prune -f
        echo -e "${GREEN}✓ 清理完成${NC}"
        ;;

    "rebuild")
        echo -e "${YELLOW}重新构建并启动...${NC}"
        docker-compose down
        docker-compose up -d --build
        echo -e "${GREEN}✓ 重新构建完成${NC}"
        ;;

    "test")
        echo -e "${YELLOW}测试服务...${NC}"
        echo "测试后端 API..."
        if curl -f http://localhost:3000/api > /dev/null 2>&1; then
            echo -e "${GREEN}✓ 后端 API 正常${NC}"
        else
            echo -e "${RED}✗ 后端 API 失败${NC}"
        fi

        echo "测试前端..."
        if curl -f http://localhost > /dev/null 2>&1; then
            echo -e "${GREEN}✓ 前端正常${NC}"
        else
            echo -e "${RED}✗ 前端失败${NC}"
        fi
        ;;

    "help"|"--help"|"-h")
        echo "用法: ./deploy.sh [命令]"
        echo ""
        echo "可用命令:"
        echo "  build       构建 Docker 镜像"
        echo "  up, start   启动服务"
        echo "  down, stop  停止服务"
        echo "  restart     重启服务"
        echo "  logs        查看日志"
        echo "  ps          查看服务状态"
        echo "  clean       清理容器和网络"
        echo "  rebuild     重新构建并启动"
        echo "  test        测试服务"
        echo "  help        显示帮助信息"
        echo ""
        echo "示例:"
        echo "  ./deploy.sh build      # 构建镜像"
        echo "  ./deploy.sh up         # 启动服务"
        echo "  ./deploy.sh logs       # 查看日志"
        echo "  ./deploy.sh rebuild    # 重新构建"
        ;;

    *)
        echo -e "${RED}错误: 未知命令 '$COMMAND'${NC}"
        echo "使用 './deploy.sh help' 查看帮助信息"
        exit 1
        ;;
esac

echo ""
