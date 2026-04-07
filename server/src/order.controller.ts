import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 创建订单
   */
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createOrder(@Body() body: { userId: string; courseId: number; price: number }) {
    console.log('=== 创建订单请求 ===');
    console.log('URL: /api/orders/create');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.orderService.createOrder(body.userId, body.courseId, body.price);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 支付订单
   */
  @Post('pay')
  @HttpCode(HttpStatus.OK)
  async payOrder(@Body() body: { orderId: string; payMethod: 'wechat' | 'alipay' }) {
    console.log('=== 支付订单请求 ===');
    console.log('URL: /api/orders/pay');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.orderService.payOrder(body.orderId, body.payMethod);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取订单列表
   */
  @Get('list')
  async getOrderList(
    @Query('userId') userId: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    console.log('=== 获取订单列表请求 ===');
    console.log('URL: /api/orders/list');
    console.log('Method: GET');
    console.log('Query:', { userId, status, page, pageSize });
    
    const result = await this.orderService.getOrderList(userId, status, {
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10
    });
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取订单详情
   */
  @Get('detail')
  async getOrderDetail(@Query('orderId') orderId: string) {
    console.log('=== 获取订单详情请求 ===');
    console.log('URL: /api/orders/detail');
    console.log('Method: GET');
    console.log('Query:', { orderId });
    
    const result = await this.orderService.getOrderDetail(orderId);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 取消订单
   */
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Body() body: { orderId: string }) {
    console.log('=== 取消订单请求 ===');
    console.log('URL: /api/orders/cancel');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.orderService.cancelOrder(body.orderId);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 申请退款
   */
  @Post('refund')
  @HttpCode(HttpStatus.OK)
  async refundOrder(@Body() body: { orderId: string; reason: string }) {
    console.log('=== 申请退款请求 ===');
    console.log('URL: /api/orders/refund');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.orderService.refundOrder(body.orderId, body.reason);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取用户学习课程列表
   */
  @Get('my-courses')
  async getMyCourses(
    @Query('userId') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    console.log('=== 获取用户学习课程列表请求 ===');
    console.log('URL: /api/orders/my-courses');
    console.log('Method: GET');
    console.log('Query:', { userId, page, pageSize });
    
    const result = await this.orderService.getMyCourses(userId, {
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10
    });
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 检查课程购买状态
   */
  @Get('check-purchased')
  async checkPurchased(
    @Query('userId') userId: string,
    @Query('courseId') courseId: string
  ) {
    console.log('=== 检查课程购买状态请求 ===');
    console.log('URL: /api/orders/check-purchased');
    console.log('Method: GET');
    console.log('Query:', { userId, courseId });
    
    const result = await this.orderService.checkPurchased(userId, courseId);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }
}
