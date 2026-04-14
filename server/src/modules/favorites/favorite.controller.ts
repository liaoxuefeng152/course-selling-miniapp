import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  /**
   * 添加/取消收藏
   * POST /api/favorites/toggle
   */
  @Post('toggle')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(@Body() body: {
    userId: string;
    courseId: string;
  }) {
    const result = await this.favoriteService.toggleFavorite(body.userId, body.courseId);
    return {
      code: 200,
      msg: '操作成功',
      data: result,
    };
  }

  /**
   * 获取收藏列表
   * GET /api/favorites/list
   */
  @Get('list')
  async getFavoriteList(@Query() query: {
    userId: string;
    page?: number;
    pageSize?: number;
  }) {
    const result = await this.favoriteService.getFavoriteList(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 检查是否已收藏
   * GET /api/favorites/check
   */
  @Get('check')
  async checkFavorited(@Query() query: {
    userId: string;
    courseId: string;
  }) {
    const result = await this.favoriteService.checkFavorited(query.userId, query.courseId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }
}
