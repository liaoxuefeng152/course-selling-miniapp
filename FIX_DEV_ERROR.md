# 应用启动错误修复指南

## 问题描述

错误信息：`preview reload failed: 进程退出码: -9`

## 问题原因

退出码 `-9` 表示进程被 `SIGKILL` 信号强制终止，这通常是因为：

1. **使用了 SIGKILL 信号**：在 `package.json` 的脚本中使用了 `--kill-signal SIGKILL`，这会立即强制终止进程，不给进程清理资源的机会
2. **进程资源未正确释放**：强制终止可能导致端口占用、文件锁等问题
3. **缓存冲突**：Turbo 缓存或其他缓存可能损坏

## 解决方案

### 1. 修复脚本配置（已完成）

已将所有脚本中的 `SIGKILL` 改为 `SIGTERM`：

```json
// 修复前
"dev": "pnpm exec concurrently --kill-others --kill-signal SIGKILL ..."

// 修复后
"dev": "pnpm exec concurrently --kill-others --kill-signal SIGTERM ..."
```

**影响**：
- `dev` 脚本：开发服务器
- `build` 脚本：构建过程
- `validate` 脚本：代码验证

### 2. 使用诊断工具

运行诊断脚本检查开发服务器状态：

```bash
pnpm diagnose
```

**诊断内容**：
- 端口占用检查（3000, 5000, 5173）
- 运行中的进程检查
- Node.js 版本检查
- pnpm 版本检查
- 依赖检查
- 错误日志检查
- 健康检查

### 3. 使用修复工具

如果问题仍然存在，使用修复工具：

```bash
pnpm fix:dev
```

**修复步骤**：
1. 停止所有开发进程
2. 清理端口占用
3. 清理缓存（.turbo, node_modules/.cache）
4. 检查依赖完整性
5. 提供启动建议

### 4. 手动修复步骤

如果需要手动修复，按以下步骤操作：

```bash
# 1. 停止所有进程
pkill -f 'concurrently'
pkill -f 'nest start'
pkill -f 'taro build'

# 2. 清理端口占用
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# 3. 清理缓存
rm -rf .turbo
rm -rf node_modules/.cache
rm -rf dist
rm -rf server/dist

# 4. 重新安装依赖（可选）
rm -rf node_modules
pnpm install

# 5. 启动开发服务器
pnpm dev
```

## 预防措施

### 1. 使用优雅的终止信号

始终使用 `SIGTERM` 而不是 `SIGKILL`：

```json
// ✅ 正确
--kill-signal SIGTERM

// ❌ 错误
--kill-signal SIGKILL
```

### 2. 定期清理缓存

```bash
# 清理 Turbo 缓存
rm -rf .turbo

# 清理 pnpm 缓存
pnpm store prune

# 清理 node_modules 缓存
rm -rf node_modules/.cache
```

### 3. 检查端口占用

```bash
# 查看端口占用
netstat -tuln | grep -E ':(3000|5000|5173)'

# 或使用 ss
ss -tuln | grep -E ':(3000|5000|5173)'
```

### 4. 监控日志

```bash
# 查看实时日志
tail -f /tmp/coze-logs/dev.log

# 查看错误日志
tail -f /tmp/coze-logs/dev.log | grep -i error
```

## 常见问题

### Q: 为什么 SIGKILL 会导致问题？

A: `SIGKILL` 是一个立即强制终止的信号，不给进程任何清理资源的机会。这可能导致：
- 端口占用未被释放
- 文件锁未清除
- 缓存文件损坏
- 子进程变成僵尸进程

`SIGTERM` 则允许进程优雅地关闭，清理资源后再退出。

### Q: 修复后为什么还报错？

A: 可能的原因：
1. 端口被其他进程占用
2. 缓存文件损坏
3. 依赖不完整

解决方法：运行 `pnpm fix:dev`

### Q: 如何查看详细的错误信息？

A: 查看日志文件：

```bash
tail -100 /tmp/coze-logs/dev.log
```

或运行诊断：

```bash
pnpm diagnose
```

## 技术细节

### 信号说明

| 信号 | 编码 | 说明 | 行为 |
|------|------|------|------|
| SIGTERM | 15 | 终止信号 | 允许进程清理资源后退出 |
| SIGKILL | 9 | 强制终止 | 立即终止进程，不允许清理 |

### 端口说明

| 端口 | 服务 | 说明 |
|------|------|------|
| 3000 | 后端 API | NestJS 服务器 |
| 5000 | 前端 H5 | Taro H5 开发服务器 |
| 5173 | Vite 默认 | 默认 Vite 端口（未使用） |

## 相关文件

- `package.json` - 脚本配置
- `diagnose.sh` - 诊断工具
- `fix-dev.sh` - 修复工具
- `/tmp/coze-logs/dev.log` - 开发日志

## 参考链接

- [Linux 信号](https://man7.org/linux/man-pages/man7/signal.7.html)
- [Concurrently 文档](https://github.com/open-cli-tools/concurrently)
- [Taro 开发文档](https://docs.taro.zone/)

## 更新日志

- 2026-04-14: 修复 SIGKILL 导致的进程强制终止问题
- 2026-04-14: 添加诊断和修复工具
