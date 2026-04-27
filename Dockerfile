# 构建阶段
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@9.0.0

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY server/package.json ./server/
COPY server/pnpm-lock.yaml ./server/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端（H5）
RUN pnpm build:web

# 构建后端
RUN pnpm build:server

# 生产阶段 - 后端服务
FROM node:18-alpine AS server

# 安装 pnpm
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# 从构建阶段复制必要的文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/pnpm-lock.yaml ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/node_modules ./node_modules

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["node", "server/dist/main.js"]

# 生产阶段 - 前端静态文件
FROM node:18-alpine AS frontend

WORKDIR /app

# 从构建阶段复制静态文件
COPY --from=builder /app/dist ./dist

# 使用 nginx 托管静态文件
FROM nginx:alpine AS production

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制前端静态文件
COPY --from=frontend /app/dist /usr/share/nginx/html

# 复制后端服务文件
COPY --from=server /app /app

# 暴露端口
EXPOSE 80 3000

# 启动脚本
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]
