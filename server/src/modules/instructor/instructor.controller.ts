import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { InstructorService } from './instructor.service';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  /**
   * 提交讲师认证申请（讲师端）
   * POST /api/instructor/certify
   */
  @Post('certify')
  @HttpCode(HttpStatus.OK)
  async submitCertify(@Body() body: any) {
    const result = await this.instructorService.submitCertify(body);
    return {
      code: 200,
      msg: '提交成功，等待审核',
      data: result,
    };
  }

  /**
   * 查询讲师认证状态（讲师端）
   * GET /api/instructor/certify
   */
  @Get('certify')
  async getCertify(@Query('userId') userId: string) {
    const result = await this.instructorService.getCertify(userId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 获取所有认证申请列表（管理端）
   * GET /api/instructor/certify/list
   */
  @Get('certify/list')
  async getCertifyList(@Query() query: {
    page?: number;
    pageSize?: number;
    status?: string;
  }) {
    const result = await this.instructorService.getCertifyList(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 审核认证申请（管理端）
   * POST /api/instructor/certify/review
   */
  @Post('certify/review')
  @HttpCode(HttpStatus.OK)
  async reviewCertify(@Body() body: {
    certifyId: string;
    status: 'verified' | 'rejected';
    rejectReason?: string;
  }) {
    const result = await this.instructorService.reviewCertify(body.certifyId, body.status, body.rejectReason);
    return {
      code: 200,
      msg: body.status === 'verified' ? '审核通过' : '已拒绝',
      data: result,
    };
  }

  /**
   * 获取讲师统计数据
   * GET /api/instructor/stats
   */
  @Get('stats')
  async getStats(@Query('userId') userId: string) {
    const result = await this.instructorService.getStats(userId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 获取讲师信息（学员端/公开信息）
   * GET /api/instructor/info
   */
  @Get('info')
  async getInstructorInfo(@Query('instructorId') instructorId: string) {
    const result = await this.instructorService.getInstructorInfo(instructorId);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 获取讲师的课程列表（学员端/公开信息）
   * GET /api/instructor/courses
   */
  @Get('courses')
  async getInstructorCourses(@Query() query: {
    instructorId: string;
    page?: number;
    pageSize?: number;
  }) {
    const result = await this.instructorService.getInstructorCourses(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }

  /**
   * 申请提现（讲师端）
   * POST /api/instructor/withdraw/apply
   */
  @Post('withdraw/apply')
  @HttpCode(HttpStatus.OK)
  async applyWithdraw(@Body() body: {
    amount: number;
    bankName: string;
    bankAccount: string;
    accountName: string;
  }) {
    const result = await this.instructorService.applyWithdraw(body);
    return {
      code: 200,
      msg: '提现申请已提交',
      data: result,
    };
  }

  /**
   * 获取提现记录列表（讲师端）
   * GET /api/instructor/withdraw/list
   */
  @Get('withdraw/list')
  async getWithdrawList(@Query() query: {
    userId: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const result = await this.instructorService.getWithdrawList(query);
    return {
      code: 200,
      msg: '获取成功',
      data: result,
    };
  }
}
