# Coze Mini Program

一个基于 Taro 4 + NestJS 的多端小程序应用，支持微信小程序、抖音小程序和 H5。

## 功能特性

- ✅ 多端支持（微信、抖音、H5）
- ✅ 用户认证（手机号、微信登录）
- ✅ 课程管理（创建、编辑、发布）
- ✅ 直播功能（直播管理、观看）
- ✅ 订单系统（下单、支付、退款）
- ✅ 学习进度（记录学习进度）
- ✅ 收藏功能（课程收藏）
- ✅ 个人中心（资料编辑、头像更换）
- ✅ 支付集成（微信支付、支付宝支付）

## 技术栈

### 前端
- **框架**: Taro 4.1.9
- **语言**: TypeScript 5.4
- **UI**: Tailwind CSS 4 + shadcn/ui
- **状态管理**: Zustand 5.0
- **图标**: Lucide React Taro

### 后端
- **框架**: NestJS
- **语言**: TypeScript 5.4
- **验证**: class-validator
- **文档**: Swagger

## 快速开始

### 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问地址
# 前端: http://localhost:5173
# 后端: http://localhost:3000
```

### Docker 部署

```bash
# 使用部署脚本
./deploy.sh build    # 构建镜像
./deploy.sh up       # 启动服务
./deploy.sh logs     # 查看日志

# 或使用 docker-compose
docker-compose up -d

# 访问地址
# 前端: http://localhost
# 后端: http://localhost:3000/api
```

详细部署文档请查看 [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## 项目结构

```
coze-mini-program/
├── src/                      # 前端源代码
│   ├── components/           # 组件
│   │   └── ui/              # UI 组件库
│   ├── pages/               # 页面
│   │   ├── index/          # 首页
│   │   ├── login/          # 登录页
│   │   ├── profile/        # 个人中心
│   │   └── ...
│   ├── stores/             # 状态管理
│   ├── network/            # 网络请求
│   ├── utils/              # 工具函数
│   └── app.config.ts       # 应用配置
├── server/                   # 后端源代码
│   ├── src/
│   │   ├── modules/        # 功能模块
│   │   │   ├── users/      # 用户模块
│   │   │   ├── courses/    # 课程模块
│   │   │   ├── orders/     # 订单模块
│   │   │   ├── live/       # 直播模块
│   │   │   └── ...
│   │   ├── common/         # 公共模块
│   │   ├── main.ts         # 入口文件
│   │   └── app.module.ts   # 应用模块
│   └── package.json
├── Dockerfile               # Docker 配置
├── docker-compose.yml       # Docker Compose 配置
├── nginx.conf              # Nginx 配置
└── deploy.sh               # 部署脚本
```

## 开发指南

### 添加新页面

```bash
# 使用 Taro CLI 创建页面
pnpm new page <页面名称>

# 或手动创建
mkdir -p src/pages/<页面名称>
touch src/pages/<页面名称>/index.tsx
touch src/pages/<页面名称>/index.config.ts
```

### 添加新模块

```bash
# 使用 NestJS CLI 创建模块
cd server
pnpm exec nest g module <模块名>
pnpm exec nest g controller <模块名>
pnpm exec nest g service <模块名>
```

### 代码规范

```bash
# 检查代码
pnpm validate

# 修复代码
pnpm lint:fix

# 类型检查
pnpm tsc
```

## 测试

### 功能测试

```bash
# 运行功能测试
./test_functional_perfect.sh

# 查看测试报告
cat TEST_REPORT_PERFECT.md
```

### API 测试

```bash
# 运行 API 测试
./test_functional_v2.sh
```

## 部署

### 生产环境

```bash
# 构建生产版本
pnpm build

# Docker 部署
./deploy.sh rebuild

# 访问
http://localhost
```

### 小程序发布

```bash
# 微信小程序
pnpm build:weapp

# 抖音小程序
pnpm build:tt
```

## 环境变量

创建 `.env` 文件：

```env
# 后端配置
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# 前端配置
PROJECT_DOMAIN=http://localhost

# 数据库配置（可选）
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coze
DB_USER=postgres
DB_PASSWORD=your_password

# Redis 配置（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 文档

- [Docker 部署指南](./DOCKER_DEPLOYMENT.md)
- [功能测试用例](./TEST_CASES_FUNCTIONAL.md)
- [测试报告](./TEST_REPORT_PERFECT.md)
- [API 文档](./API_STUDENT.md)

## 常见问题

### Q: 如何修改端口？

A: 在 `docker-compose.yml` 中修改端口映射：

```yaml
ports:
  - "8080:80"      # 修改前端端口
  - "3001:3000"   # 修改后端端口
```

### Q: 如何查看日志？

A: 使用以下命令：

```bash
# 查看所有日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f app
docker-compose logs -f redis
```

### Q: 如何重启服务？

A: 使用部署脚本：

```bash
./deploy.sh restart
```

或使用 docker-compose：

```bash
docker-compose restart
```

### Q: 如何清理数据？

A: 删除所有容器和数据：

```bash
docker-compose down -v
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

- 邮箱: support@example.com
- 官网: https://example.com
