import { Controller, Get, Post, Put, Delete, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * 获取课程列表
   * GET /api/courses
   */
  @Get()
  async getCourses(@Query() query: {
    page?: number;
    pageSize?: number;
    status?: string;
    keyword?: string;
  }) {
    const result = await this.courseService.getCourses(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 获取课程详情
   * GET /api/courses/:id
   */
  @Get(':id')
  async getCourseDetail(@Param('id') id: string) {
    const result = await this.courseService.getCourseDetail(id);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 创建课程
   * POST /api/courses
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCourse(@Body() body: any) {
    const result = await this.courseService.createCourse(body);
    return {
      code: 200,
      msg: '创建成功',
      data: result,
    };
  }

  /**
   * 更新课程
   * PUT /api/courses/:id
   */
  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() body: any) {
    const result = await this.courseService.updateCourse(id, body);
    return {
      code: 200,
      msg: '更新成功',
      data: result,
    };
  }

  /**
   * 删除课程
   * DELETE /api/courses/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCourse(@Param('id') id: string) {
    await this.courseService.deleteCourse(id);
    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }

  /**
   * 发布/下架课程
   * POST /api/courses/:id/publish
   */
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publishCourse(@Param('id') id: string, @Body() body: { status: 'published' | 'draft' }) {
    const result = await this.courseService.updateCourse(id, { status: body.status });
    return {
      code: 200,
      msg: body.status === 'published' ? '发布成功' : '下架成功',
      data: result,
    };
  }
}
