import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 发送验证码
   * POST /api/users/send-code
   */
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    const result = await this.usersService.sendCode(body.phone);
    return {
      code: 200,
      msg: '验证码已发送',
      data: result,
    };
  }

  /**
   * 手机号登录/注册
   * POST /api/users/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { phone: string; code: string; role: 'student' | 'instructor' }) {
    const result = await this.usersService.login(body.phone, body.code, body.role);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  /**
   * 微信一键登录
   * POST /api/users/wechat-login
   */
  @Post('wechat-login')
  @HttpCode(HttpStatus.OK)
  async wechatLogin(@Body() body: { code: string; role: 'student' | 'instructor' }) {
    const result = await this.usersService.wechatLogin(body.code, body.role);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  /**
   * 获取用户信息
   * GET /api/users/info
   */
  @Get('info')
  async getUserInfo(@Query('userId') userId: string) {
    const result = await this.usersService.getUserInfo(userId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 更新用户信息
   * POST /api/users/update
   */
  @Post('update')
  @HttpCode(HttpStatus.OK)
  async updateUserInfo(@Body() body: {
    userId: string;
    nickname?: string;
    avatar?: string;
    email?: string;
  }) {
    const result = await this.usersService.updateUserInfo(body.userId, body);
    return {
      code: 200,
      msg: '更新成功',
      data: result,
    };
  }

  /**
   * 退出登录
   * POST /api/users/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { userId: string }) {
    await this.usersService.logout(body.userId);
    return {
      code: 200,
      msg: '退出成功',
      data: null,
    };
  }
}
