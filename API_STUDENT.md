# 卖课小程序 API 文档 - 学员端

> 学员端专用API，包含登录、浏览课程、购买、观看等功能

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

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

**响应示例**:
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "user": {
      "id": "user_123456",
      "phone": "13800138000",
      "nickname": "学员用户",
      "avatar": "https://example.com/avatar.jpg",
      "role": "student"
    },
    "token": "token-xxx"
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
    "nickname": "学员用户",
    "avatar": "https://example.com/avatar.jpg",
    "role": "student",
    "email": ""
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
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "更新成功",
  "data": {
    "id": "user_123456",
    "nickname": "新昵称"
  }
}
```

---

## 二、课程浏览模块

### 2.1 获取课程列表（首页）

**接口地址**: `GET /api/courses`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态：published（已发布） |
| keyword | string | 否 | 搜索关键词 |
| category | string | 否 | 分类筛选 |

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
        "coverImage": "https://example.com/cover.jpg",
        "instructorId": "user_instructor_001",
        "instructorName": "张老师",
        "price": 299.00,
        "originalPrice": 599.00,
        "status": "published",
        "category": "影视后期",
        "studentCount": 1000,
        "rating": 4.8,
        "viewCount": 5000,
        "isFree": false
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 2.2 获取课程详情

**接口地址**: `GET /api/courses/:id`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 课程ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "course_123456",
    "title": "短视频剪辑实战课",
    "coverImage": "https://example.com/cover.jpg",
    "instructorId": "user_instructor_001",
    "instructorName": "张老师",
    "instructorAvatar": "https://example.com/avatar.jpg",
    "price": 299.00,
    "originalPrice": 599.00,
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
    "isPurchased": false,
    "viewCount": 5000
  }
}
```

---

### 2.3 获取课程分类

**接口地址**: `GET /api/courses/categories`

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": [
    { "id": "cat_1", "name": "影视后期", "count": 50 },
    { "id": "cat_2", "name": "摄影技巧", "count": 30 },
    { "id": "cat_3", "name": "短视频创作", "count": 40 }
  ]
}
```

---

## 三、直播浏览模块

### 3.1 获取直播列表

**接口地址**: `GET /api/live`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认20 |
| status | string | 否 | 状态：live（直播中）、upcoming（未开始） |
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
        "coverImage": "https://example.com/cover.jpg",
        "instructorId": "user_instructor_001",
        "instructorName": "张老师",
        "instructorAvatar": "https://example.com/avatar.jpg",
        "description": "直播简介",
        "startTime": "2024-01-01T20:00:00.000Z",
        "endTime": "2024-01-01T21:00:00.000Z",
        "status": "upcoming",
        "price": 0.00,
        "viewerCount": 0,
        "likeCount": 0,
        "platform": "douyin"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

**直播状态说明**:
- `upcoming`: 未开始
- `live`: 直播中
- `ended`: 已结束

---

### 3.2 获取直播详情

**接口地址**: `GET /api/live/:id`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 直播ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "live_123456",
    "title": "短视频创作分享会",
    "coverImage": "https://example.com/cover.jpg",
    "instructorId": "user_instructor_001",
    "instructorName": "张老师",
    "instructorAvatar": "https://example.com/avatar.jpg",
    "description": "直播简介",
    "startTime": "2024-01-01T20:00:00.000Z",
    "endTime": "2024-01-01T21:00:00.000Z",
    "status": "upcoming",
    "price": 0.00,
    "playUrl": "https://play.example.com/live/stream_id.m3u8",
    "viewerCount": 0,
    "likeCount": 0,
    "platform": "douyin",
    "isPurchased": false
  }
}
```

---

## 四、订单模块（学员端核心）

### 4.1 创建订单

**接口地址**: `POST /api/orders/create`

**请求参数**:
```json
{
  "userId": "user_123456",
  "courseId": "course_123456",
  "paymentMethod": "wechat"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| courseId | string | 是 | 课程ID |
| paymentMethod | string | 是 | 支付方式：wechat（微信支付）、alipay（支付宝） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "订单创建成功",
  "data": {
    "orderId": "ORD_202401010001",
    "amount": 299.00,
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

---

### 4.2 获取订单列表

**接口地址**: `GET /api/orders/list`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| status | string | 否 | 订单状态：paid（已支付）、unpaid（未支付）、refunded（已退款） |
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
        "orderId": "ORD_202401010001",
        "courseId": "course_123456",
        "courseTitle": "短视频剪辑实战课",
        "courseCover": "https://example.com/cover.jpg",
        "amount": 299.00,
        "status": "paid",
        "paymentMethod": "wechat",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "paidAt": "2024-01-01T00:05:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 4.3 获取订单详情

**接口地址**: `GET /api/orders/:id`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 订单ID（路径参数） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "orderId": "ORD_202401010001",
    "userId": "user_123456",
    "courseId": "course_123456",
    "courseTitle": "短视频剪辑实战课",
    "courseCover": "https://example.com/cover.jpg",
    "amount": 299.00,
    "originalPrice": 599.00,
    "status": "paid",
    "paymentMethod": "wechat",
    "transactionId": "wx_transaction_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "paidAt": "2024-01-01T00:05:00.000Z"
  }
}
```

---

## 五、我的学习模块

### 5.1 获取我的课程列表

**接口地址**: `GET /api/study/my-courses`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
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
        "courseId": "course_123456",
        "title": "短视频剪辑实战课",
        "coverImage": "https://example.com/cover.jpg",
        "instructorName": "张老师",
        "progress": 50,
        "lastWatchTime": "2024-01-01T20:00:00.000Z",
        "purchasedAt": "2024-01-01T00:00:00.000Z",
        "totalLessons": 20,
        "completedLessons": 10
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20
  }
}
```

---

### 5.2 记录学习进度

**接口地址**: `POST /api/study/progress`

**请求参数**:
```json
{
  "userId": "user_123456",
  "courseId": "course_123456",
  "lessonId": "lesson_1",
  "progress": 50,
  "currentTime": 300
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| courseId | string | 是 | 课程ID |
| lessonId | string | 是 | 课时ID |
| progress | number | 是 | 学习进度百分比（0-100） |
| currentTime | number | 是 | 当前播放时间（秒） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "记录成功",
  "data": null
}
```

---

### 5.3 获取学习详情

**接口地址**: `GET /api/study/detail`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| courseId | string | 是 | 课程ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "courseId": "course_123456",
    "progress": 50,
    "totalLessons": 20,
    "completedLessons": 10,
    "totalDuration": 7200,
    "watchedDuration": 3600,
    "lastWatchTime": "2024-01-01T20:00:00.000Z",
    "lessons": [
      {
        "lessonId": "lesson_1",
        "title": "1.1 软件安装与界面介绍",
        "duration": 600,
        "watchedDuration": 600,
        "completed": true
      }
    ]
  }
}
```

---

## 六、收藏/点赞模块

### 6.1 添加/取消收藏课程

**接口地址**: `POST /api/favorites/toggle`

**请求参数**:
```json
{
  "userId": "user_123456",
  "courseId": "course_123456"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "isFavorited": true
  }
}
```

---

### 6.2 获取收藏列表

**接口地址**: `GET /api/favorites/list`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
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
        "courseId": "course_123456",
        "title": "短视频剪辑实战课",
        "coverImage": "https://example.com/cover.jpg",
        "instructorName": "张老师",
        "price": 299.00,
        "originalPrice": 599.00,
        "favoritedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

---

## 七、讲师信息模块（只读）

### 7.1 获取讲师信息

**接口地址**: `GET /api/instructor/info`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| instructorId | string | 是 | 讲师ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {
    "id": "user_instructor_001",
    "name": "张老师",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "资深影视后期讲师，10年从业经验",
    "courseCount": 20,
    "studentCount": 5000,
    "rating": 4.8,
    "certifyType": "personal",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7.2 获取讲师的课程列表

**接口地址**: `GET /api/instructor/courses`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| instructorId | string | 是 | 讲师ID |
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
        "id": "course_123456",
        "title": "短视频剪辑实战课",
        "coverImage": "https://example.com/cover.jpg",
        "price": 299.00,
        "originalPrice": 599.00,
        "studentCount": 1000,
        "rating": 4.8
      }
    ],
    "total": 20,
    "page": 1,
    "pageSize": 20
  }
}
```

---

## 错误码说明

| HTTP状态码 | code | 说明 |
|-----------|------|------|
| 200 | 200 | 成功 |
| 400 | 400 | 请求参数错误 |
| 401 | 401 | 未授权 |
| 403 | 403 | 无权限 |
| 404 | 404 | 资源不存在 |
| 500 | 500 | 服务器内部错误 |

---

## 开发说明

### 测试工具

```bash
# 示例：获取课程列表
curl -X GET "http://localhost:3000/api/courses?page=1&pageSize=20"

# 示例：获取课程详情
curl -X GET "http://localhost:3000/api/courses/course_123456"

# 示例：创建订单
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123456","courseId":"course_123456","paymentMethod":"wechat"}'
```

### 前端调用示例

```typescript
import { Network } from '@/network'

// 获取课程列表
const res = await Network.request({
  url: '/api/courses',
  method: 'GET',
  data: { page: 1, pageSize: 20 }
})

// 获取课程详情
const detail = await Network.request({
  url: `/api/courses/${courseId}`,
  method: 'GET'
})

// 创建订单
const order = await Network.request({
  url: '/api/orders/create',
  method: 'POST',
  data: {
    userId: 'user_123456',
    courseId: 'course_123456',
    paymentMethod: 'wechat'
  }
})
```

---

**文档版本**: v2.0.0
**最后更新**: 2026-04-14
**适用端**: 学员端小程序
