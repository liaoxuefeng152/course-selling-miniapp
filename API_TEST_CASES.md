# 接口测试用例

## 测试环境
- **Base URL**: `http://localhost:3000/api`
- **测试时间**: 2024-01-10

## 测试工具
- `curl` 命令行工具

---

## 一、用户认证模块

### 1.1 发送验证码
**接口**: `POST /api/users/send-code`

**测试用例**:
```bash
# 测试用例1：正常发送验证码
curl -X POST http://localhost:3000/api/users/send-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "验证码已发送",
#   "data": { "code": "123456", "expiresIn": 300 }
# }
```

---

### 1.2 手机号登录/注册
**接口**: `POST /api/users/login`

**测试用例**:
```bash
# 测试用例1：学员登录
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","code":"123456","role":"student"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "登录成功",
#   "data": {
#     "user": { "id": "...", "phone": "13800138000", "role": "student" },
#     "token": "..."
#   }
# }

# 测试用例2：讲师登录
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13900139000","code":"123456","role":"instructor"}'
```

---

### 1.3 微信一键登录
**接口**: `POST /api/users/wechat-login`

**测试用例**:
```bash
# 测试用例1：微信登录
curl -X POST http://localhost:3000/api/users/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"wx_code_from_login","role":"student"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "登录成功",
#   "data": { "user": {...}, "token": "..." }
# }
```

---

### 1.4 获取用户信息
**接口**: `GET /api/users/info`

**测试用例**:
```bash
# 测试用例1：获取用户信息
curl -X GET "http://localhost:3000/api/users/info?userId=user_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "id": "user_123456", "phone": "13800138000", "role": "student" }
# }
```

---

### 1.5 更新用户信息
**接口**: `POST /api/users/update`

**测试用例**:
```bash
# 测试用例1：更新用户信息
curl -X POST http://localhost:3000/api/users/update \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123456","nickname":"新昵称"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "更新成功",
#   "data": { "id": "user_123456", "nickname": "新昵称" }
# }
```

---

### 1.6 退出登录
**接口**: `POST /api/users/logout`

**测试用例**:
```bash
# 测试用例1：退出登录
curl -X POST http://localhost:3000/api/users/logout \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123456"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "退出成功",
#   "data": null
# }
```

---

## 二、讲师管理模块

### 2.1 提交讲师认证申请
**接口**: `POST /api/instructor/certify`

**测试用例**:
```bash
# 测试用例1：个人认证
curl -X POST http://localhost:3000/api/instructor/certify \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user_instructor_001",
    "certifyType":"personal",
    "realName":"张三",
    "idCard":"110101199001011234",
    "idCardFront":"https://example.com/id-front.jpg",
    "idCardBack":"https://example.com/id-back.jpg",
    "contactPhone":"13800138000"
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "提交成功，等待审核",
#   "data": { "id": "certify_...", "status": "pending" }
# }

# 测试用例2：机构认证
curl -X POST http://localhost:3000/api/instructor/certify \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user_instructor_002",
    "certifyType":"organization",
    "organizationName":"某某科技有限公司",
    "businessLicense":"https://example.com/license.jpg",
    "legalPersonIdCard":"https://example.com/legal-id.jpg",
    "contactPhone":"13900139000"
  }'
```

---

### 2.2 查询讲师认证状态
**接口**: `GET /api/instructor/certify`

**测试用例**:
```bash
# 测试用例1：查询认证状态
curl -X GET "http://localhost:3000/api/instructor/certify?userId=user_instructor_001"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "id": "certify_...", "status": "pending" }
# }
```

---

### 2.3 获取所有认证申请列表（管理端）
**接口**: `GET /api/instructor/certify/list`

**测试用例**:
```bash
# 测试用例1：获取所有认证申请
curl -X GET "http://localhost:3000/api/instructor/certify/list?page=1&pageSize=20"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "items": [...], "total": 100 }
# }

# 测试用例2：按状态筛选
curl -X GET "http://localhost:3000/api/instructor/certify/list?status=pending&page=1&pageSize=20"
```

---

### 2.4 审核认证申请（管理端）
**接口**: `POST /api/instructor/certify/review`

**测试用例**:
```bash
# 测试用例1：审核通过
curl -X POST http://localhost:3000/api/instructor/certify/review \
  -H "Content-Type: application/json" \
  -d '{"certifyId":"certify_123456","status":"verified"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "审核通过",
#   "data": { "id": "certify_123456", "status": "verified" }
# }

# 测试用例2：审核拒绝
curl -X POST http://localhost:3000/api/instructor/certify/review \
  -H "Content-Type: application/json" \
  -d '{"certifyId":"certify_123456","status":"rejected","rejectReason":"资料不完整"}'
```

---

### 2.5 获取讲师统计数据
**接口**: `GET /api/instructor/stats`

**测试用例**:
```bash
# 测试用例1：获取讲师统计
curl -X GET "http://localhost:3000/api/instructor/stats?userId=user_instructor_001"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": {
#     "todaySales": 5450.00,
#     "totalSales": 336470.00,
#     "courseCount": 6,
#     "studentCount": 490
#   }
# }
```

---

### 2.6 申请提现（讲师端）
**接口**: `POST /api/instructor/withdraw/apply`

**测试用例**:
```bash
# 测试用例1：申请提现
curl -X POST http://localhost:3000/api/instructor/withdraw/apply \
  -H "Content-Type: application/json" \
  -d '{
    "amount":500.00,
    "bankName":"中国工商银行",
    "bankAccount":"6222000000000000",
    "accountName":"张三"
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "提现申请已提交",
#   "data": { "id": "WD_...", "amount": 500.00, "status": "pending" }
# }

# 测试用例2：金额不足（低于100元）
curl -X POST http://localhost:3000/api/instructor/withdraw/apply \
  -H "Content-Type: application/json" \
  -d '{
    "amount":50.00,
    "bankName":"中国工商银行",
    "bankAccount":"6222000000000000",
    "accountName":"张三"
  }'

# 预期结果：错误，最低提现100元
```

---

### 2.7 获取提现记录列表（讲师端）
**接口**: `GET /api/instructor/withdraw/list`

**测试用例**:
```bash
# 测试用例1：获取提现记录
curl -X GET "http://localhost:3000/api/instructor/withdraw/list?userId=user_instructor_001&page=1&pageSize=20"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "list": [...], "total": 10 }
# }

# 测试用例2：按状态筛选
curl -X GET "http://localhost:3000/api/instructor/withdraw/list?userId=user_instructor_001&status=pending"
```

---

## 三、课程管理模块

### 3.1 获取课程列表
**接口**: `GET /api/courses`

**测试用例**:
```bash
# 测试用例1：获取课程列表
curl -X GET "http://localhost:3000/api/courses?page=1&pageSize=20"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "list": [...], "total": 100 }
# }

# 测试用例2：按状态筛选
curl -X GET "http://localhost:3000/api/courses?status=published&page=1&pageSize=20"

# 测试用例3：搜索课程
curl -X GET "http://localhost:3000/api/courses?keyword=短视频&page=1&pageSize=20"
```

---

### 3.2 获取课程详情
**接口**: `GET /api/courses/:id`

**测试用例**:
```bash
# 测试用例1：获取课程详情
curl -X GET "http://localhost:3000/api/courses?id=course_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": {
#     "id": "course_123456",
#     "title": "短视频剪辑实战课",
#     "chapters": [...]
#   }
# }
```

---

### 3.3 创建课程（讲师端）
**接口**: `POST /api/courses`

**测试用例**:
```bash
# 测试用例1：创建课程
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title":"测试课程",
    "cover":"https://example.com/cover.jpg",
    "instructorId":"user_instructor_001",
    "originalPrice":599.00,
    "discountPrice":299.00,
    "category":"测试分类",
    "description":"测试课程描述",
    "status":"draft"
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "创建成功",
#   "data": { "id": "course_...", "title": "测试课程" }
# }
```

---

### 3.4 更新课程（讲师端）
**接口**: `PUT /api/courses/:id`

**测试用例**:
```bash
# 测试用例1：更新课程
curl -X PUT "http://localhost:3000/api/courses?id=course_123456" \
  -H "Content-Type: application/json" \
  -d '{"title":"更新后的标题"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "更新成功",
#   "data": { "id": "course_123456", "updatedAt": "..." }
# }
```

---

### 3.5 删除课程（讲师端）
**接口**: `DELETE /api/courses/:id`

**测试用例**:
```bash
# 测试用例1：删除课程
curl -X DELETE "http://localhost:3000/api/courses?id=course_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "删除成功",
#   "data": null
# }
```

---

### 3.6 发布/下架课程（讲师端）
**接口**: `POST /api/courses/:id/publish`

**测试用例**:
```bash
# 测试用例1：发布课程
curl -X POST "http://localhost:3000/api/courses/course_123456/publish" \
  -H "Content-Type: application/json" \
  -d '{"status":"published"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "发布成功",
#   "data": { "id": "course_123456", "status": "published" }
# }

# 测试用例2：下架课程
curl -X POST "http://localhost:3000/api/courses/course_123456/publish" \
  -H "Content-Type: application/json" \
  -d '{"status":"draft"}'
```

---

## 四、直播管理模块

### 4.1 获取直播列表
**接口**: `GET /api/live`

**测试用例**:
```bash
# 测试用例1：获取直播列表
curl -X GET "http://localhost:3000/api/live?page=1&pageSize=20"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "list": [...], "total": 50 }
# }

# 测试用例2：按状态筛选
curl -X GET "http://localhost:3000/api/live?status=live&page=1&pageSize=20"
```

---

### 4.2 获取直播详情
**接口**: `GET /api/live/:id`

**测试用例**:
```bash
# 测试用例1：获取直播详情
curl -X GET "http://localhost:3000/api/live?id=live_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": {
#     "id": "live_123456",
#     "title": "短视频创作分享会",
#     "status": "upcoming"
#   }
# }
```

---

### 4.3 创建直播（讲师端）
**接口**: `POST /api/live`

**测试用例**:
```bash
# 测试用例1：创建直播
curl -X POST http://localhost:3000/api/live \
  -H "Content-Type: application/json" \
  -d '{
    "title":"测试直播",
    "cover":"https://example.com/cover.jpg",
    "instructorId":"user_instructor_001",
    "description":"测试直播描述",
    "startTime":"2024-12-31T20:00:00.000Z",
    "endTime":"2024-12-31T21:00:00.000Z",
    "price":0.00
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "创建成功",
#   "data": { "id": "live_...", "pushUrl": "...", "playUrl": "..." }
# }
```

---

### 4.4 更新直播（讲师端）
**接口**: `PUT /api/live/:id`

**测试用例**:
```bash
# 测试用例1：更新直播
curl -X PUT "http://localhost:3000/api/live?id=live_123456" \
  -H "Content-Type: application/json" \
  -d '{"title":"更新后的直播标题"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "更新成功",
#   "data": { "id": "live_123456", "updatedAt": "..." }
# }
```

---

### 4.5 删除直播（讲师端）
**接口**: `DELETE /api/live/:id`

**测试用例**:
```bash
# 测试用例1：删除直播
curl -X DELETE "http://localhost:3000/api/live?id=live_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "删除成功",
#   "data": null
# }
```

---

### 4.6 开始直播（讲师端）
**接口**: `POST /api/live/:id/start`

**测试用例**:
```bash
# 测试用例1：开始直播
curl -X POST "http://localhost:3000/api/live/live_123456/start"

# 预期结果：
# {
#   "code": 200,
#   "msg": "直播已开始",
#   "data": { "id": "live_123456", "status": "live", "playUrl": "..." }
# }
```

---

### 4.7 结束直播（讲师端）
**接口**: `POST /api/live/:id/end`

**测试用例**:
```bash
# 测试用例1：结束直播
curl -X POST "http://localhost:3000/api/live/live_123456/end"

# 预期结果：
# {
#   "code": 200,
#   "msg": "直播已结束",
#   "data": { "id": "live_123456", "status": "ended" }
# }
```

---

### 4.8 获取直播中控台数据（讲师端）
**接口**: `GET /api/live/:id/dashboard`

**测试用例**:
```bash
# 测试用例1：获取直播中控台数据
curl -X GET "http://localhost:3000/api/live/live_123456/dashboard"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": {
#     "liveId": "live_123456",
#     "status": "live",
#     "viewerCount": 1500,
#     "likeCount": 5000
#   }
# }
```

---

## 五、平台账号管理模块

### 5.1 获取已绑定的平台账号列表
**接口**: `GET /api/platform/accounts`

**测试用例**:
```bash
# 测试用例1：获取已绑定的平台账号
curl -X GET "http://localhost:3000/api/platform/accounts?userId=user_123456"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": [
#     { "id": "account_...", "platform": "douyin", "nickname": "抖音账号" }
#   ]
# }
```

---

### 5.2 绑定抖音账号
**接口**: `POST /api/platform/douyin/bind`

**测试用例**:
```bash
# 测试用例1：绑定抖音账号
curl -X POST http://localhost:3000/api/platform/douyin/bind \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user_123456",
    "openId":"douyin_open_id",
    "nickname":"抖音账号",
    "avatar":"https://example.com/avatar.jpg",
    "accessToken":"access_token_string"
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "绑定成功",
#   "data": { "id": "account_...", "platform": "douyin" }
# }
```

---

### 5.3 绑定视频号账号
**接口**: `POST /api/platform/wechat/bind`

**测试用例**:
```bash
# 测试用例1：绑定视频号账号
curl -X POST http://localhost:3000/api/platform/wechat/bind \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user_123456",
    "openId":"wechat_open_id",
    "nickname":"视频号账号",
    "avatar":"https://example.com/avatar.jpg",
    "accessToken":"access_token_string"
  }'

# 预期结果：
# {
#   "code": 200,
#   "msg": "绑定成功",
#   "data": { "id": "account_...", "platform": "wechat" }
# }
```

---

### 5.4 解绑平台账号
**接口**: `DELETE /api/platform/unbind`

**测试用例**:
```bash
# 测试用例1：解绑平台账号
curl -X DELETE http://localhost:3000/api/platform/unbind \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123456","platform":"douyin","openId":"douyin_open_id"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "解绑成功",
#   "data": null
# }
```

---

### 5.5 刷新平台账号 Token
**接口**: `POST /api/platform/refresh-token`

**测试用例**:
```bash
# 测试用例1：刷新Token
curl -X POST http://localhost:3000/api/platform/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123456","platform":"douyin","openId":"douyin_open_id"}'

# 预期结果：
# {
#   "code": 200,
#   "msg": "刷新成功",
#   "data": { "accessToken": "new_token", "expiresIn": 7200 }
# }
```

---

### 5.6 获取平台授权 URL
**接口**: `GET /api/platform/authorize-url`

**测试用例**:
```bash
# 测试用例1：获取抖音授权URL
curl -X GET "http://localhost:3000/api/platform/authorize-url?platform=douyin&redirectUri=https://example.com/callback"

# 预期结果：
# {
#   "code": 200,
#   "msg": "获取成功",
#   "data": { "authorizeUrl": "https://open.douyin.com/..." }
# }

# 测试用例2：获取视频号授权URL
curl -X GET "http://localhost:3000/api/platform/authorize-url?platform=wechat&redirectUri=https://example.com/callback"
```

---

## 测试报告模板

| 序号 | 接口名称 | 测试用例数 | 通过数 | 失败数 | 通过率 |
|------|---------|-----------|--------|--------|--------|
| 1 | 用户认证模块 | 6 | ? | ? | ?% |
| 2 | 讲师管理模块 | 7 | ? | ? | ?% |
| 3 | 课程管理模块 | 6 | ? | ? | ?% |
| 4 | 直播管理模块 | 8 | ? | ? | ?% |
| 5 | 平台账号管理模块 | 6 | ? | ? | ?% |
| **总计** | **5个模块** | **33** | **?** | **?** | **?%** |

---

## 执行说明

```bash
# 1. 确保后端服务运行
pnpm dev:server

# 2. 执行所有测试
# 可以逐个执行或使用脚本批量执行

# 3. 记录测试结果
# 将每个接口的实际响应记录到测试报告中

# 4. 分析失败原因
# 对于失败的测试用例，分析原因并修复
```
