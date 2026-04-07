import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 微信登录
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { code: string }) {
    console.log('=== 微信登录请求 ===');
    console.log('URL: /api/auth/login');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.authService.login(body.code);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 手机号登录
   */
  @Post('phone-login')
  @HttpCode(HttpStatus.OK)
  async phoneLogin(@Body() body: { phone: string; code: string }) {
    console.log('=== 手机号登录请求 ===');
    console.log('URL: /api/auth/phone-login');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.authService.phoneLogin(body.phone, body.code);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 发送验证码
   */
  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() body: { phone: string }) {
    console.log('=== 发送验证码请求 ===');
    console.log('URL: /api/auth/send-code');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.authService.sendCode(body.phone);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取用户信息
   */
  @Get('user-info')
  async getUserInfo(@Query('userId') userId: string) {
    console.log('=== 获取用户信息请求 ===');
    console.log('URL: /api/auth/user-info');
    console.log('Method: GET');
    console.log('Query:', { userId });
    
    const result = await this.authService.getUserInfo(userId);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 更新用户信息
   */
  @Post('update-profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() body: { userId: string; nickname?: string; avatar?: string }
  ) {
    console.log('=== 更新用户信息请求 ===');
    console.log('URL: /api/auth/update-profile');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.authService.updateProfile(body.userId, body);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }
}
