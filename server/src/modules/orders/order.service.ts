import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class OrderService {
  // 内存存储（生产环境应该使用数据库）
  private orders: Map<string, any> = new Map();

  /**
   * 创建订单
   */
  async createOrder(data: {
    userId: string;
    courseId: string;
    paymentMethod: 'wechat' | 'alipay';
  }) {
    // 生成订单号
    const orderId = `ORD_${Date.now()}`;
    const orderNo = `ORDNO${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const order = {
      orderId,
      orderNo,
      userId: data.userId,
      courseId: data.courseId,
      paymentMethod: data.paymentMethod,
      status: 'unpaid', // unpaid, paid, refunded, cancelled
      transactionId: '',
      createdAt: new Date().toISOString(),
      paidAt: null,
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(orderId, order);
    console.log(`[创建订单] 订单ID: ${orderId}, 用户ID: ${data.userId}, 课程ID: ${data.courseId}`);

    // 返回订单信息和模拟支付参数
    return {
      orderId: order.orderId,
      orderNo: order.orderNo,
      amount: 0, // TODO: 从课程服务获取实际价格
      paymentParams: {
        timeStamp: Math.floor(Date.now() / 1000).toString(),
        nonceStr: `nonce_${Date.now()}`,
        package: `prepay_id=wx${orderId}`,
        signType: 'MD5',
        paySign: `sign_${orderId}`,
      },
    };
  }

  /**
   * 获取订单列表
   */
  async getOrderList(params: {
    userId: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    // 筛选用户的订单
    let userOrders = Array.from(this.orders.values()).filter(
      (order) => order.userId === params.userId
    );

    // 按状态筛选
    if (params.status) {
      userOrders = userOrders.filter((order) => order.status === params.status);
    }

    // 按创建时间倒序
    userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = userOrders.slice(start, end);

    return {
      list,
      total: userOrders.length,
      page,
      pageSize,
    };
  }

  /**
   * 获取订单详情
   */
  async getOrderDetail(orderId: string) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`订单不存在: ${orderId}`);
    }

    // TODO: 联合查询课程信息
    const courseInfo = {
      courseId: order.courseId,
      title: '课程标题', // TODO: 从课程服务获取
      cover: 'https://example.com/cover.jpg',
      originalPrice: 599.00,
      discountPrice: 299.00,
    };

    return {
      ...order,
      ...courseInfo,
      amount: courseInfo.discountPrice || courseInfo.originalPrice,
    };
  }

  /**
   * 支付订单（模拟）
   */
  async payOrder(orderId: string, transactionId: string) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`订单不存在: ${orderId}`);
    }

    if (order.status !== 'unpaid') {
      throw new BadRequestException('订单状态不允许支付');
    }

    order.status = 'paid';
    order.transactionId = transactionId;
    order.paidAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    this.orders.set(orderId, order);
    console.log(`[订单支付] 订单ID: ${orderId}, 交易号: ${transactionId}`);

    return order;
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId: string) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`订单不存在: ${orderId}`);
    }

    if (order.status !== 'unpaid') {
      throw new BadRequestException('订单状态不允许取消');
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    this.orders.set(orderId, order);
    console.log(`[取消订单] 订单ID: ${orderId}`);

    return order;
  }
}
