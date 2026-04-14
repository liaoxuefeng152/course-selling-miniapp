import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { StudyService } from './study.service';

@Controller('study')
export class StudyController {
  constructor(private readonly studyService: StudyService) {}

  /**
   * 获取我的课程列表
   * GET /api/study/my-courses
   */
  @Get('my-courses')
  async getMyCourses(@Query() query: {
    userId: string;
    page?: number;
    pageSize?: number;
  }) {
    const result = await this.studyService.getMyCourses(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 记录学习进度
   * POST /api/study/progress
   */
  @Post('progress')
  @HttpCode(HttpStatus.OK)
  async recordProgress(@Body() body: {
    userId: string;
    courseId: string;
    lessonId: string;
    progress: number;
    currentTime: number;
  }) {
    await this.studyService.recordProgress(body);
    return {
      code: 200,
      msg: '记录成功',
      data: null,
    };
  }

  /**
   * 获取学习详情
   * GET /api/study/detail
   */
  @Get('detail')
  async getStudyDetail(@Query() query: {
    userId: string;
    courseId: string;
  }) {
    const result = await this.studyService.getStudyDetail(query.userId, query.courseId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }
}
