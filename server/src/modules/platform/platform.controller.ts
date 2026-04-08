import { Controller, Get, Post, Delete, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  /**
   * 获取已绑定的平台账号列表
   * GET /api/platform/accounts
   */
  @Get('accounts')
  async getAccounts(@Query('userId') userId: string) {
    const result = await this.platformService.getAccounts(userId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 绑定抖音账号
   * POST /api/platform/douyin/bind
   */
  @Post('douyin/bind')
  @HttpCode(HttpStatus.OK)
  async bindDouyin(@Body() body: {
    userId: string;
    openId: string;
    nickname: string;
    avatar: string;
    accessToken: string;
  }) {
    const result = await this.platformService.bindAccount({
      userId: body.userId,
      platform: 'douyin',
      openId: body.openId,
      nickname: body.nickname,
      avatar: body.avatar,
      accessToken: body.accessToken,
    });
    return {
      code: 200,
      msg: '绑定成功',
      data: result,
    };
  }

  /**
   * 绑定视频号账号
   * POST /api/platform/wechat/bind
   */
  @Post('wechat/bind')
  @HttpCode(HttpStatus.OK)
  async bindWechat(@Body() body: {
    userId: string;
    openId: string;
    nickname: string;
    avatar: string;
    accessToken: string;
  }) {
    const result = await this.platformService.bindAccount({
      userId: body.userId,
      platform: 'wechat',
      openId: body.openId,
      nickname: body.nickname,
      avatar: body.avatar,
      accessToken: body.accessToken,
    });
    return {
      code: 200,
      msg: '绑定成功',
      data: result,
    };
  }

  /**
   * 解绑平台账号
   * DELETE /api/platform/unbind
   */
  @Delete('unbind')
  @HttpCode(HttpStatus.OK)
  async unbindAccount(@Body() body: { userId: string; platform: string; openId: string }) {
    await this.platformService.unbindAccount(body.userId, body.platform, body.openId);
    return {
      code: 200,
      msg: '解绑成功',
      data: null,
    };
  }

  /**
   * 刷新平台账号 Token
   * POST /api/platform/refresh-token
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { userId: string; platform: string; openId: string }) {
    const result = await this.platformService.refreshToken(body.userId, body.platform, body.openId);
    return {
      code: 200,
      msg: '刷新成功',
      data: result,
    };
  }

  /**
   * 获取平台授权 URL
   * GET /api/platform/authorize-url
   */
  @Get('authorize-url')
  async getAuthorizeUrl(@Query() query: { platform: string; redirectUri: string }) {
    const result = await this.platformService.getAuthorizeUrl(query.platform, query.redirectUri);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }
}
