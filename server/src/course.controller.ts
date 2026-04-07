import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * 获取课程列表
   */
  @Get('list')
  async getCourseList(
    @Query('categoryId') categoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    console.log('=== 获取课程列表请求 ===');
    console.log('URL: /api/courses/list');
    console.log('Method: GET');
    console.log('Query:', { categoryId, keyword, sort, page, pageSize });
    
    const result = await this.courseService.getCourseList({
      categoryId,
      keyword,
      sort,
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
   * 获取课程详情
   */
  @Get('detail')
  async getCourseDetail(@Query('id') id: string) {
    console.log('=== 获取课程详情请求 ===');
    console.log('URL: /api/courses/detail');
    console.log('Method: GET');
    console.log('Query:', { id });
    
    const result = await this.courseService.getCourseDetail(id);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取首页推荐课程
   */
  @Get('featured')
  async getFeaturedCourses() {
    console.log('=== 获取首页推荐课程请求 ===');
    console.log('URL: /api/courses/featured');
    console.log('Method: GET');
    
    const result = await this.courseService.getFeaturedCourses();
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取直播列表
   */
  @Get('lives')
  async getLiveList(@Query('status') status?: string) {
    console.log('=== 获取直播列表请求 ===');
    console.log('URL: /api/courses/lives');
    console.log('Method: GET');
    console.log('Query:', { status });
    
    const result = await this.courseService.getLiveList(status);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取直播详情
   */
  @Get('live-detail')
  async getLiveDetail(@Query('id') id: string) {
    console.log('=== 获取直播详情请求 ===');
    console.log('URL: /api/courses/live-detail');
    console.log('Method: GET');
    console.log('Query:', { id });
    
    const result = await this.courseService.getLiveDetail(id);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 收藏/取消收藏课程
   */
  @Post('favorite')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(@Body() body: { userId: string; courseId: number; action: 'add' | 'remove' }) {
    console.log('=== 收藏/取消收藏课程请求 ===');
    console.log('URL: /api/courses/favorite');
    console.log('Method: POST');
    console.log('Body:', JSON.stringify(body));
    
    const result = await this.courseService.toggleFavorite(body.userId, body.courseId, body.action);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取用户收藏列表
   */
  @Get('favorites')
  async getFavorites(@Query('userId') userId: string) {
    console.log('=== 获取用户收藏列表请求 ===');
    console.log('URL: /api/courses/favorites');
    console.log('Method: GET');
    console.log('Query:', { userId });
    
    const result = await this.courseService.getFavorites(userId);
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }

  /**
   * 获取课程分类
   */
  @Get('categories')
  async getCategories() {
    console.log('=== 获取课程分类请求 ===');
    console.log('URL: /api/courses/categories');
    console.log('Method: GET');
    
    const result = await this.courseService.getCategories();
    
    console.log('Response Data:', JSON.stringify(result));
    return {
      code: 200,
      msg: 'success',
      data: result
    };
  }
}
