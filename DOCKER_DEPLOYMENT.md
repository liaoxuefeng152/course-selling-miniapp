# Docker 部署指南

本文档介绍如何使用 Docker 部署 Coze 小程序应用。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少 2GB 可用内存
- 至少 10GB 可用磁盘空间

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd coze-mini-program
```

### 2. 构建并启动

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

### 3. 访问应用

- **前端 (H5)**: http://localhost
- **后端 API**: http://localhost:3000/api
- **Redis**: localhost:6379

## 服务说明

### 主要服务

| 服务 | 端口 | 说明 |
|------|------|------|
| app (Nginx) | 80 | 前端静态文件托管 |
| app (NestJS) | 3000 | 后端 API 服务 |
| redis | 6379 | 缓存服务 |

### 健康检查

```bash
# 检查后端健康状态
curl http://localhost:3000/api

# 检查容器健康状态
docker-compose ps
```

## 常用命令

### 服务管理

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 删除服务（保留数据）
docker-compose down

# 删除服务（删除数据）
docker-compose down -v

# 重新构建并启动
docker-compose up -d --build
```

### 日志查看

```bash
# 查看所有日志
docker-compose logs

# 查看实时日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f app
docker-compose logs -f redis

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 进入容器

```bash
# 进入应用容器
docker-compose exec app sh

# 进入 Redis 容器
docker-compose exec redis sh
```

## 配置说明

### 环境变量

在 `docker-compose.yml` 中可以配置以下环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| NODE_ENV | production | 运行环境 |
| PORT | 3000 | 后端服务端口 |
| HOST | 0.0.0.0 | 监听地址 |
| PROJECT_DOMAIN | http://localhost | 项目域名 |

### 修改配置

1. 编辑 `docker-compose.yml`：

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - PORT=3000
      - PROJECT_DOMAIN=https://your-domain.com
```

2. 重新部署：

```bash
docker-compose down
docker-compose up -d
```

## 数据持久化

### Redis 数据

Redis 数据默认存储在 Docker volume 中：

```bash
# 查看 volume
docker volume ls

# 删除 volume（会删除所有数据）
docker-compose down -v

# 备份 volume
docker run --rm -v coze-mini-program_redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz -C /data .

# 恢复 volume
docker run --rm -v coze-mini-program_redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-backup.tar.gz -C /data
```

## 性能优化

### 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 启用缓存

```bash
# Redis 已配置，可以在后端中使用
# 示例：缓存用户信息
import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class CacheService {
  private client = createClient({ url: 'redis://localhost:6379' });

  async onModuleInit() {
    await this.client.connect();
  }
}
```

## 监控与日志

### 查看日志

```bash
# 实时日志
docker-compose logs -f app

# 最近错误
docker-compose logs --tail=50 app | grep ERROR
```

### 监控指标

```bash
# 查看容器资源使用
docker stats

# 查看磁盘使用
docker system df
```

## 故障排查

### 常见问题

#### 1. 容器无法启动

```bash
# 查看日志
docker-compose logs app

# 检查端口占用
netstat -tuln | grep -E '80|3000|6379'

# 重建容器
docker-compose down
docker-compose up -d --build
```

#### 2. 后端无法访问

```bash
# 检查容器状态
docker-compose ps

# 进入容器检查
docker-compose exec app sh
curl http://localhost:3000/api

# 查看后端日志
docker-compose logs app | grep -A 10 "ERROR"
```

#### 3. 前端加载失败

```bash
# 检查 nginx 配置
docker-compose exec app nginx -t

# 重启 nginx
docker-compose exec app nginx -s reload

# 检查静态文件
docker-compose exec app ls -la /usr/share/nginx/html
```

#### 4. Redis 连接失败

```bash
# 检查 Redis 状态
docker-compose exec redis redis-cli ping

# 查看 Redis 日志
docker-compose logs redis

# 重启 Redis
docker-compose restart redis
```

## 安全建议

### 1. 使用 HTTPS

```nginx
# 在 nginx.conf 中添加 SSL 配置
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
}
```

### 2. 限制访问

```yaml
# 在 docker-compose.yml 中添加网络限制
services:
  app:
    networks:
      - coze-network
    # 只允许内部网络访问
    ports:
      - "127.0.0.1:3000:3000"  # 后端只监听本地
```

### 3. 定期更新

```bash
# 更新镜像
docker-compose pull

# 重新构建
docker-compose up -d --build
```

## 生产部署

### 1. 准备服务器

- 安装 Docker 和 Docker Compose
- 配置域名和 SSL 证书
- 配置防火墙规则

### 2. 修改配置

```yaml
# docker-compose.yml
services:
  app:
    ports:
      - "80:80"
      - "443:443"
    environment:
      - PROJECT_DOMAIN=https://your-domain.com
```

### 3. 部署

```bash
# 克隆代码
git clone <your-repo-url>
cd coze-mini-program

# 启动服务
docker-compose up -d

# 检查状态
docker-compose ps
```

### 4. 配置反向代理（可选）

如果使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 备份与恢复

### 备份

```bash
# 备份 Redis 数据
docker run --rm -v coze-mini-program_redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-$(date +%Y%m%d).tar.gz -C /data .

# 备份配置文件
tar czf config-$(date +%Y%m%d).tar.gz docker-compose.yml nginx.conf
```

### 恢复

```bash
# 恢复 Redis 数据
docker run --rm -v coze-mini-program_redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-20240101.tar.gz -C /data

# 恢复配置
tar xzf config-20240101.tar.gz

# 重启服务
docker-compose down
docker-compose up -d
```

## 升级指南

### 1. 备份数据

```bash
# 备份 Redis
docker-compose exec redis redis-cli SAVE
```

### 2. 拉取最新代码

```bash
git pull origin main
```

### 3. 重新构建

```bash
docker-compose down
docker-compose up -d --build
```

### 4. 验证

```bash
# 检查服务状态
docker-compose ps

# 测试 API
curl http://localhost:3000/api
```

## 技术支持

如遇到问题，请检查：

1. Docker 日志：`docker-compose logs`
2. 容器状态：`docker-compose ps`
3. 资源使用：`docker stats`

## 附录

### 目录结构

```
coze-mini-program/
├── Dockerfile              # Docker 构建配置
├── docker-compose.yml      # Docker Compose 配置
├── nginx.conf              # Nginx 配置
├── docker-entrypoint.sh    # 容器启动脚本
├── .dockerignore           # Docker 忽略文件
└── src/                    # 源代码
    ├── server/             # 后端代码
    └── pages/              # 前端页面
```

### 相关链接

- [Docker 文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Nginx 文档](https://nginx.org/en/docs/)
- [NestJS 文档](https://docs.nestjs.com/)
