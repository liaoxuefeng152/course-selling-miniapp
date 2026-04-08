import { Controller, Get, Post, Put, Delete, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { LiveService } from './live.service';

@Controller('live')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  /**
   * 获取直播列表
   * GET /api/live
   */
  @Get()
  async getLives(@Query() query: {
    page?: number;
    pageSize?: number;
    status?: string;
    keyword?: string;
  }) {
    const result = await this.liveService.getLives(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 获取直播详情
   * GET /api/live/:id
   */
  @Get(':id')
  async getLiveDetail(@Query('id') id: string) {
    const result = await this.liveService.getLiveDetail(id);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 创建直播
   * POST /api/live
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createLive(@Body() body: any) {
    const result = await this.liveService.createLive(body);
    return {
      code: 200,
      msg: '创建成功',
      data: result,
    };
  }

  /**
   * 更新直播
   * PUT /api/live/:id
   */
  @Put(':id')
  async updateLive(@Query('id') id: string, @Body() body: any) {
    const result = await this.liveService.updateLive(id, body);
    return {
      code: 200,
      msg: '更新成功',
      data: result,
    };
  }

  /**
   * 删除直播
   * DELETE /api/live/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteLive(@Query('id') id: string) {
    await this.liveService.deleteLive(id);
    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }

  /**
   * 开始直播
   * POST /api/live/:id/start
   */
  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  async startLive(@Query('id') id: string) {
    const result = await this.liveService.startLive(id);
    return {
      code: 200,
      msg: '直播已开始',
      data: result,
    };
  }

  /**
   * 结束直播
   * POST /api/live/:id/end
   */
  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  async endLive(@Query('id') id: string) {
    const result = await this.liveService.endLive(id);
    return {
      code: 200,
      msg: '直播已结束',
      data: result,
    };
  }

  /**
   * 获取直播中控台数据
   * GET /api/live/:id/dashboard
   */
  @Get(':id/dashboard')
  async getLiveDashboard(@Query('id') id: string) {
    const result = await this.liveService.getLiveDashboard(id);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }
}
