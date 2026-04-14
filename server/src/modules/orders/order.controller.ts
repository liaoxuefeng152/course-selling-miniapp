import { Controller, Get, Post, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 创建订单
   * POST /api/orders/create
   */
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() body: {
    userId: string;
    courseId: string;
    paymentMethod: 'wechat' | 'alipay';
  }) {
    const result = await this.orderService.createOrder(body);
    return {
      code: 200,
      msg: '订单创建成功',
      data: result,
    };
  }

  /**
   * 获取订单列表
   * GET /api/orders/list
   */
  @Get('list')
  async getOrderList(@Query() query: {
    userId: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const result = await this.orderService.getOrderList(query);

    // TODO: 联合查询课程信息
    const listWithCourseInfo = result.list.map((order: any) => ({
      orderId: order.orderId,
      courseId: order.courseId,
      courseTitle: '课程标题', // TODO: 从课程服务获取
      courseCover: 'https://example.com/cover.jpg',
      amount: 299.00, // TODO: 从课程服务获取
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
    }));

    return {
      code: 200,
      msg: '获取成功',
      data: {
        ...result,
        list: listWithCourseInfo,
      },
    };
  }

  /**
   * 获取订单详情
   * GET /api/orders/:id
   */
  @Get(':id')
  async getOrderDetail(@Param('id') id: string) {
    const result = await this.orderService.getOrderDetail(id);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 支付订单（模拟支付成功）
   * POST /api/orders/:id/pay
   */
  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  async payOrder(@Param('id') id: string, @Body() body: { transactionId: string }) {
    const result = await this.orderService.payOrder(id, body.transactionId);
    return {
      code: 200,
      msg: '支付成功',
      data: result,
    };
  }

  /**
   * 取消订单
   * POST /api/orders/:id/cancel
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Param('id') id: string) {
    const result = await this.orderService.cancelOrder(id);
    return {
      code: 200,
      msg: '订单已取消',
      data: result,
    };
  }
}
