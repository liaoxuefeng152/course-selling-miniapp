# 卖课小程序 API 文档

> 基于 Taro 4 + NestJS 的前后端分离项目

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时间格式**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

## 通用响应格式

所有接口统一返回以下格式：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

### 状态码说明

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 一、用户认证模块

### 1.1 发送验证码

**接口地址**: `POST /api/users/send-code`

**请求参数**:

```json
{
  "phone": "13800138000"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "验证码已发送",
  "data": {
    "code": "123456",
    "expiresIn": 300
  }
}
```

---

### 1.2 手机号登录/注册

**接口地址**: `POST /api/users/login`

**请求参数**:

```json
{
  "phone": "13800138000",
  "code": "123456",
  "role": "student"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| code | string | 是 | 验证码 |
| role | string | 是 | 用户角色：student（学员）或 instructor（讲师） |

**响应示例**:

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "user": {
      "id": "user_123456",
      "phone": "13800138000",
      "nickname": "用户昵称",
      "avatar": "https://example.com/avatar.jpg",
      "role": "student",
      "email": "",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 微信一键登录

**接口地址**: `POST /api/users/wechat-login`

**请求参数**:

```json
{
  "code": "wx_code_from_login",
  "role": "student"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信登录凭证 |
| role | string | 是 | 用户角色：student（学员）或 instructor（讲师） |

**响应示例**: 同手机号登录

---

### 1.4 获取用户信息

**接口地址**: `GET /api/users/info`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "user_123456",
    "phone": "13800138000",
    "nickname": "用户昵称",
    "avatar": "https://example.com/avatar.jpg",
    "role": "student",
    "email": "user@example.com"
  }
}
```

---

### 1.5 更新用户信息

**接口地址**: `POST /api/users/update`

**请求参数**:

```json
{
  "userId": "user_123456",
  "nickname": "新昵称",
  "avatar": "https://example.com/new-avatar.jpg",
  "email": "new@example.com"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像URL |
| email | string | 否 | 邮箱 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": "user_123456",
    "nickname": "新昵称",
    "avatar": "https://example.com/new-avatar.jpg",
    "email": "new@example.com"
  }
}
```

---

### 1.6 退出登录

**接口地址**: `POST /api/users/logout`

**请求参数**:

```json
{
  "userId": "user_123456"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "退出成功",
  "data": null
}
```

---

## 二、讲师管理模块

### 2.1 提交讲师认证申请

**接口地址**: `POST /api/instructor/certify`

**请求参数** (个人认证):

```json
{
  "userId": "user_123456",
  "certifyType": "personal",
  "realName": "张三",
  "idCard": "110101199001011234",
  "idCardFront": "https://example.com/id-front.jpg",
  "idCardBack": "https://example.com/id-back.jpg",
  "contactPhone": "13800138000"
}
```

**请求参数** (机构认证):

```json
{
  "userId": "user_123456",
  "certifyType": "organization",
  "organizationName": "某某科技有限公司",
  "businessLicense": "https://example.com/license.jpg",
  "legalPersonIdCard": "https://example.com/legal-id.jpg",
  "contactPhone": "13800138000"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| certifyType | string | 是 | 认证类型：personal（个人）或 organization（机构） |
| realName | string | 个人必填 | 真实姓名 |
| idCard | string | 个人必填 | 身份证号 |
| idCardFront | string | 个人必填 | 身份证正面照片URL |
| idCardBack | string | 个人必填 | 身份证背面照片URL |
| organizationName | string | 机构必填 | 机构名称 |
| businessLicense | string | 机构必填 | 营业执照URL |
| legalPersonIdCard | string | 机构必填 | 法人身份证URL |
| contactPhone | string | 是 | 联系电话 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提交成功，等待审核",
  "data": {
    "id": "certify_123456",
    "userId": "user_123456",
    "certifyType": "personal",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2.2 查询讲师认证状态

**接口地址**: `GET /api/instructor/certify`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "certify_123456",
    "userId": "user_123456",
    "certifyType": "personal",
    "status": "verified",
    "realName": "张三",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**认证状态说明**:

| status | 说明 |
|--------|------|
| pending | 待审核 |
| verified | 已通过 |
| rejected | 已拒绝 |

---

### 2.3 获取所有认证申请列表（管理端）

**接口地址**: `GET /api/instructor/certify/list`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态筛选：pending、verified、rejected |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "items": [
      {
        "id": "certify_123456",
        "userId": "user_123456",
        "certifyType": "personal",
        "status": "pending",
        "realName": "张三",
        "contactPhone": "13800138000",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

---

### 2.4 审核认证申请（管理端）

**接口地址**: `POST /api/instructor/certify/review`

**请求参数**:

```json
{
  "certifyId": "certify_123456",
  "status": "verified",
  "rejectReason": ""
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| certifyId | string | 是 | 认证ID |
| status | string | 是 | 审核结果：verified（通过）或 rejected（拒绝） |
| rejectReason | string | 否 | 拒绝原因，status为rejected时必填 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "审核通过",
  "data": {
    "id": "certify_123456",
    "status": "verified",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 2.5 获取讲师统计数据

**接口地址**: `GET /api/instructor/stats`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 讲师用户ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "userId": "user_123456",
    "todaySales": 5450.00,
    "totalSales": 336470.00,
    "courseCount": 6,
    "liveCount": 21,
    "studentCount": 490,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2.6 申请提现（讲师端）

**接口地址**: `POST /api/instructor/withdraw/apply`

**请求参数**:

```json
{
  "amount": 500.00,
  "bankName": "中国工商银行",
  "bankAccount": "6222000000000000",
  "accountName": "张三"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| amount | number | 是 | 提现金额，最低100元 |
| bankName | string | 是 | 银行名称 |
| bankAccount | string | 是 | 银行卡号 |
| accountName | string | 是 | 开户人姓名 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "提现申请已提交",
  "data": {
    "id": "WD_1704067200000",
    "amount": 500.00,
    "bankName": "中国工商银行",
    "bankAccount": "6222 ******** 0000",
    "accountName": "张三",
    "status": "pending",
    "applyTime": "2024-01-01T00:00:00.000Z",
    "completeTime": null,
    "remark": ""
  }
}
```

---

### 2.7 获取提现记录列表（讲师端）

**接口地址**: `GET /api/instructor/withdraw/list`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 讲师用户ID |
| status | string | 否 | 状态筛选：pending、processing、success、failed |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": "WD_1704067200000",
        "amount": 500.00,
        "bankName": "中国工商银行",
        "bankAccount": "6222 ******** 0000",
        "accountName": "张三",
        "status": "pending",
        "applyTime": "2024-01-01T00:00:00.000Z",
        "completeTime": null,
        "remark": ""
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

**提现状态说明**:

| status | 说明 |
|--------|------|
| pending | 待审核 |
| processing | 处理中 |
| success | 已到账 |
| failed | 提现失败 |

---

## 三、课程管理模块

### 3.1 获取课程列表

**接口地址**: `GET /api/courses`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态筛选：published（已发布）、draft（草稿） |
| keyword | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": "course_123456",
        "title": "短视频剪辑实战课",
        "cover": "https://example.com/cover.jpg",
        "instructorId": "user_123456",
        "instructorName": "张老师",
        "originalPrice": 599.00,
        "discountPrice": 299.00,
        "status": "published",
        "category": "影视后期",
        "description": "课程简介",
        "chapterCount": 20,
        "totalDuration": 1800,
        "studentCount": 1000,
        "rating": 4.8,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 3.2 获取课程详情

**接口地址**: `GET /api/courses/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 课程ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "course_123456",
    "title": "短视频剪辑实战课",
    "cover": "https://example.com/cover.jpg",
    "instructorId": "user_123456",
    "instructorName": "张老师",
    "instructorAvatar": "https://example.com/avatar.jpg",
    "originalPrice": 599.00,
    "discountPrice": 299.00,
    "status": "published",
    "category": "影视后期",
    "description": "课程详细简介",
    "chapters": [
      {
        "id": "chapter_1",
        "title": "第一章：基础入门",
        "sort": 1,
        "lessons": [
          {
            "id": "lesson_1",
            "title": "1.1 软件安装与界面介绍",
            "videoUrl": "https://example.com/video.mp4",
            "duration": 600,
            "isFree": true
          }
        ]
      }
    ],
    "studentCount": 1000,
    "rating": 4.8,
    "reviewCount": 200,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.3 创建课程（讲师端）

**接口地址**: `POST /api/courses`

**请求参数**:

```json
{
  "title": "短视频剪辑实战课",
  "cover": "https://example.com/cover.jpg",
  "instructorId": "user_123456",
  "originalPrice": 599.00,
  "discountPrice": 299.00,
  "category": "影视后期",
  "description": "课程简介",
  "status": "draft",
  "chapters": []
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "创建成功",
  "data": {
    "id": "course_123456",
    "title": "短视频剪辑实战课",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.4 更新课程（讲师端）

**接口地址**: `PUT /api/courses/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 课程ID |
| 其他字段 | object | 否 | 需要更新的字段 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": "course_123456",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3.5 删除课程（讲师端）

**接口地址**: `DELETE /api/courses/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 课程ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

### 3.6 发布/下架课程（讲师端）

**接口地址**: `POST /api/courses/:id/publish`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 课程ID |
| status | string | 是 | published（发布）或 draft（下架） |

**响应示例**:

```json
{
  "code": 200,
  "msg": "发布成功",
  "data": {
    "id": "course_123456",
    "status": "published",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 四、直播管理模块

### 4.1 获取直播列表

**接口地址**: `GET /api/live`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态筛选：upcoming（未开始）、live（直播中）、ended（已结束） |
| keyword | string | 否 | 搜索关键词 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "id": "live_123456",
        "title": "短视频创作分享会",
        "cover": "https://example.com/cover.jpg",
        "instructorId": "user_123456",
        "instructorName": "张老师",
        "startTime": "2024-01-01T20:00:00.000Z",
        "endTime": "2024-01-01T21:00:00.000Z",
        "status": "upcoming",
        "price": 0.00,
        "viewerCount": 0,
        "likeCount": 0,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

**直播状态说明**:

| status | 说明 |
|--------|------|
| upcoming | 未开始 |
| live | 直播中 |
| ended | 已结束 |

---

### 4.2 获取直播详情

**接口地址**: `GET /api/live/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "live_123456",
    "title": "短视频创作分享会",
    "cover": "https://example.com/cover.jpg",
    "instructorId": "user_123456",
    "instructorName": "张老师",
    "instructorAvatar": "https://example.com/avatar.jpg",
    "description": "直播简介",
    "startTime": "2024-01-01T20:00:00.000Z",
    "endTime": "2024-01-01T21:00:00.000Z",
    "status": "upcoming",
    "price": 0.00,
    "pushUrl": "rtmp://push.example.com/live/stream_id",
    "playUrl": "https://play.example.com/live/stream_id.m3u8",
    "viewerCount": 0,
    "likeCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.3 创建直播（讲师端）

**接口地址**: `POST /api/live`

**请求参数**:

```json
{
  "title": "短视频创作分享会",
  "cover": "https://example.com/cover.jpg",
  "instructorId": "user_123456",
  "description": "直播简介",
  "startTime": "2024-01-01T20:00:00.000Z",
  "endTime": "2024-01-01T21:00:00.000Z",
  "price": 0.00
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "创建成功",
  "data": {
    "id": "live_123456",
    "title": "短视频创作分享会",
    "pushUrl": "rtmp://push.example.com/live/stream_id",
    "playUrl": "https://play.example.com/live/stream_id.m3u8",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.4 更新直播（讲师端）

**接口地址**: `PUT /api/live/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |
| 其他字段 | object | 否 | 需要更新的字段 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": "live_123456",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.5 删除直播（讲师端）

**接口地址**: `DELETE /api/live/:id`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

### 4.6 开始直播（讲师端）

**接口地址**: `POST /api/live/:id/start`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "直播已开始",
  "data": {
    "id": "live_123456",
    "status": "live",
    "playUrl": "https://play.example.com/live/stream_id.m3u8",
    "startTime": "2024-01-01T20:00:00.000Z"
  }
}
```

---

### 4.7 结束直播（讲师端）

**接口地址**: `POST /api/live/:id/end`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "直播已结束",
  "data": {
    "id": "live_123456",
    "status": "ended",
    "endTime": "2024-01-01T21:00:00.000Z"
  }
}
```

---

### 4.8 获取直播中控台数据（讲师端）

**接口地址**: `GET /api/live/:id/dashboard`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "liveId": "live_123456",
    "status": "live",
    "viewerCount": 1500,
    "peakViewerCount": 2000,
    "likeCount": 5000,
    "commentCount": 200,
    "shareCount": 50,
    "startTime": "2024-01-01T20:00:00.000Z",
    "duration": 1800
  }
}
```

---

## 五、平台账号管理模块

### 5.1 获取已绑定的平台账号列表

**接口地址**: `GET /api/platform/accounts`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    {
      "id": "account_123456",
      "userId": "user_123456",
      "platform": "douyin",
      "openId": "douyin_open_id",
      "nickname": "抖音账号",
      "avatar": "https://example.com/avatar.jpg",
      "accessToken": "access_token_string",
      "expiresIn": 7200,
      "boundAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "account_789012",
      "userId": "user_123456",
      "platform": "wechat",
      "openId": "wechat_open_id",
      "nickname": "视频号账号",
      "avatar": "https://example.com/avatar.jpg",
      "accessToken": "access_token_string",
      "expiresIn": 7200,
      "boundAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**平台类型说明**:

| platform | 说明 |
|----------|------|
| douyin | 抖音 |
| wechat | 视频号 |

---

### 5.2 绑定抖音账号

**接口地址**: `POST /api/platform/douyin/bind`

**请求参数**:

```json
{
  "userId": "user_123456",
  "openId": "douyin_open_id",
  "nickname": "抖音账号",
  "avatar": "https://example.com/avatar.jpg",
  "accessToken": "access_token_string"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| openId | string | 是 | 抖音openId |
| nickname | string | 是 | 昵称 |
| avatar | string | 是 | 头像URL |
| accessToken | string | 是 | 访问令牌 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "绑定成功",
  "data": {
    "id": "account_123456",
    "platform": "douyin",
    "boundAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5.3 绑定视频号账号

**接口地址**: `POST /api/platform/wechat/bind`

**请求参数**:

```json
{
  "userId": "user_123456",
  "openId": "wechat_open_id",
  "nickname": "视频号账号",
  "avatar": "https://example.com/avatar.jpg",
  "accessToken": "access_token_string"
}
```

**响应示例**: 同绑定抖音账号

---

### 5.4 解绑平台账号

**接口地址**: `DELETE /api/platform/unbind`

**请求参数**:

```json
{
  "userId": "user_123456",
  "platform": "douyin",
  "openId": "douyin_open_id"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "解绑成功",
  "data": null
}
```

---

### 5.5 刷新平台账号 Token

**接口地址**: `POST /api/platform/refresh-token`

**请求参数**:

```json
{
  "userId": "user_123456",
  "platform": "douyin",
  "openId": "douyin_open_id"
}
```

**响应示例**:

```json
{
  "code": 200,
  "msg": "刷新成功",
  "data": {
    "accessToken": "new_access_token_string",
    "expiresIn": 7200,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5.6 获取平台授权 URL

**接口地址**: `GET /api/platform/authorize-url`

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| platform | string | 是 | 平台类型：douyin 或 wechat |
| redirectUri | string | 是 | 回调地址 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "authorizeUrl": "https://open.douyin.com/platform/oauth/connect?client_id=xxx&redirect_uri=xxx&response_type=code"
  }
}
```

---

## 六、订单模块（待实现）

### 6.1 创建订单并获取支付参数

**接口地址**: `POST /api/orders/create`

**请求参数**:

```json
{
  "courseId": "course_123456",
  "paymentMethod": "wechat",
  "amount": 299.00
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| courseId | string | 是 | 课程ID |
| paymentMethod | string | 是 | 支付方式：wechat（微信支付）或 alipay（支付宝） |
| amount | number | 是 | 支付金额 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "订单创建成功",
  "data": {
    "orderId": "ORD_202401010001",
    "paymentParams": {
      "timeStamp": "1704067200",
      "nonceStr": "random_string",
      "package": "prepay_id=wx1234567890",
      "signType": "MD5",
      "paySign": "signature_string"
    }
  }
}
```

> 注意：此接口待实现

---

## 附录

### 错误响应示例

```json
{
  "code": 400,
  "msg": "请求参数错误",
  "data": null
}
```

```json
{
  "code": 401,
  "msg": "未授权，请先登录",
  "data": null
}
```

```json
{
  "code": 404,
  "msg": "资源不存在",
  "data": null
}
```

```json
{
  "code": 500,
  "msg": "服务器内部错误",
  "data": null
}
```

### 开发说明

1. **环境变量**：
   - 开发环境：`http://localhost:3000/api`
   - 生产环境：根据 `PROJECT_DOMAIN` 环境变量配置

2. **测试工具**：
   ```bash
   # 示例：调用登录接口
   curl -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"phone":"13800138000","code":"123456","role":"student"}'
   ```

3. **前端调用示例**：
   ```typescript
   import { Network } from '@/network'

   const res = await Network.request({
     url: '/api/users/login',
     method: 'POST',
     data: {
       phone: '13800138000',
       code: '123456',
       role: 'student'
     }
   })
   ```

---

**文档版本**: v1.0.0
**最后更新**: 2024-01-01
