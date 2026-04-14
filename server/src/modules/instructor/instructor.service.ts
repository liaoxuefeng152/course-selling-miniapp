import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class InstructorService {
  // 内存存储（生产环境应该使用数据库）
  private certifies: Map<string, any> = new Map();
  private stats: Map<string, any> = new Map();
  private withdraws: Map<string, any> = new Map();

  /**
   * 提交讲师认证申请
   */
  async submitCertify(data: any) {
    // 查找是否已有认证记录
    const existing = Array.from(this.certifies.values()).find((c) => c.userId === data.userId);
    if (existing && (existing.status === 'pending' || existing.status === 'verified')) {
      throw new Error('已有待审核或已通过的认证记录');
    }

    const certify = {
      id: `certify_${Date.now()}`,
      userId: data.userId,
      certifyType: data.certifyType,
      status: 'pending',
      // 个人认证信息
      realName: data.certifyType === 'personal' ? data.realName : undefined,
      idCard: data.certifyType === 'personal' ? data.idCard : undefined,
      idCardFront: data.certifyType === 'personal' ? data.idCardFront : undefined,
      idCardBack: data.certifyType === 'personal' ? data.idCardBack : undefined,
      // 机构认证信息
      organizationName: data.certifyType === 'organization' ? data.organizationName : undefined,
      businessLicense: data.certifyType === 'organization' ? data.businessLicense : undefined,
      legalPersonIdCard: data.certifyType === 'organization' ? data.legalPersonIdCard : undefined,
      contactPhone: data.contactPhone,
      rejectReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.certifies.set(certify.id, certify);
    console.log(`[提交认证] 用户ID: ${data.userId}, 认证类型: ${data.certifyType}`);

    return certify;
  }

  /**
   * 查询讲师认证状态
   */
  async getCertify(userId: string) {
    const certify = Array.from(this.certifies.values()).find((c) => c.userId === userId);
    return certify || null;
  }

  /**
   * 获取所有认证申请列表（管理端）
   */
  async getCertifyList(query: { page?: number; pageSize?: number; status?: string }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    let list = Array.from(this.certifies.values());

    // 按状态筛选
    if (query.status) {
      list = list.filter((item) => item.status === query.status);
    }

    // 按时间倒序排序
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = list.slice(start, end);

    return {
      items,
      total: list.length,
      page,
      pageSize,
      totalPages: Math.ceil(list.length / pageSize),
    };
  }

  /**
   * 审核认证申请（管理端）
   */
  async reviewCertify(certifyId: string, status: 'verified' | 'rejected', rejectReason?: string) {
    const certify = this.certifies.get(certifyId);
    if (!certify) {
      throw new Error('认证记录不存在');
    }

    if (certify.status !== 'pending') {
      throw new Error('只能审核待审核的申请');
    }

    certify.status = status;
    certify.rejectReason = rejectReason || null;
    certify.updatedAt = new Date().toISOString();

    this.certifies.set(certifyId, certify);

    console.log(`[审核认证] 认证ID: ${certifyId}, 状态: ${status}, 拒绝原因: ${rejectReason || '无'}`);

    return certify;
  }

  /**
   * 获取讲师统计数据
   */
  async getStats(userId: string) {
    // 从缓存获取或创建新数据
    let stats = this.stats.get(userId);

    if (!stats) {
      stats = {
        userId,
        todaySales: Math.floor(Math.random() * 10000),
        totalSales: Math.floor(Math.random() * 100000),
        courseCount: Math.floor(Math.random() * 20),
        liveCount: Math.floor(Math.random() * 50),
        studentCount: Math.floor(Math.random() * 500),
        updatedAt: new Date().toISOString(),
      };
      this.stats.set(userId, stats);
    }

    return stats;
  }

  /**
   * 更新统计数据
   */
  async updateStats(userId: string, data: any) {
    let stats = this.stats.get(userId);

    if (!stats) {
      stats = {
        userId,
        todaySales: 0,
        totalSales: 0,
        courseCount: 0,
        liveCount: 0,
        studentCount: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    // 更新统计数据
    if (data.todaySales !== undefined) stats.todaySales = data.todaySales;
    if (data.totalSales !== undefined) stats.totalSales = data.totalSales;
    if (data.courseCount !== undefined) stats.courseCount = data.courseCount;
    if (data.liveCount !== undefined) stats.liveCount = data.liveCount;
    if (data.studentCount !== undefined) stats.studentCount = data.studentCount;
    stats.updatedAt = new Date().toISOString();

    this.stats.set(userId, stats);
    return stats;
  }

  /**
   * 申请提现
   */
  async applyWithdraw(data: {
    amount: number;
    bankName: string;
    bankAccount: string;
    accountName: string;
  }) {
    // 验证提现金额
    if (data.amount <= 0) {
      throw new Error('提现金额必须大于0');
    }

    if (data.amount < 100) {
      throw new Error('最低提现金额为100元');
    }

    // 创建提现记录
    const withdraw = {
      id: `WD_${Date.now()}`,
      amount: data.amount,
      bankName: data.bankName,
      bankAccount: this.maskBankAccount(data.bankAccount),
      accountName: data.accountName,
      status: 'pending', // pending, processing, success, failed
      applyTime: new Date().toISOString(),
      completeTime: null,
      remark: '',
    };

    this.withdraws.set(withdraw.id, withdraw);
    console.log(`[提现申请] 金额: ¥${data.amount}, 状态: 待审核`);

    return withdraw;
  }

  /**
   * 获取提现记录列表
   */
  async getWithdrawList(query: {
    userId: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }) {
    const allWithdraws = Array.from(this.withdraws.values());

    // 按状态筛选
    let filtered = allWithdraws;
    if (query.status) {
      filtered = allWithdraws.filter((w) => w.status === query.status);
    }

    // 分页
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const list = filtered.slice(start, end).reverse(); // 最新的在前

    return {
      list,
      total: filtered.length,
      page,
      pageSize,
    };
  }

  /**
   * 脱敏银行卡号
   */
  private maskBankAccount(account: string): string {
    const cleanAccount = account.replace(/\s/g, '');
    if (cleanAccount.length <= 8) {
      return cleanAccount;
    }
    return cleanAccount.substring(0, 4) + ' ' + '*'.repeat(cleanAccount.length - 8) + ' ' + cleanAccount.substring(cleanAccount.length - 4);
  }

  /**
   * 获取讲师信息（学员端/公开信息）
   */
  async getInstructorInfo(instructorId: string) {
    // 查找讲师认证记录
    const certify = Array.from(this.certifies.values()).find((c) => c.userId === instructorId && c.status === 'verified');

    // 如果没有找到认证记录，返回模拟数据（开发环境）
    if (!certify) {
      // 返回模拟讲师数据
      return {
        id: instructorId,
        name: '测试讲师',
        avatar: `https://picsum.photos/seed/${instructorId}/200/200`,
        bio: '这是一位专业讲师，专注于课程创作和教学',
        courseCount: 3,
        studentCount: 1000,
        rating: 4.9,
        certifyType: 'personal',
        createdAt: new Date().toISOString(),
      };
    }

    // 获取讲师统计数据
    const stats = await this.getStats(instructorId);

    // 返回讲师公开信息
    return {
      id: instructorId,
      name: certify.certifyType === 'personal' ? certify.realName : certify.organizationName,
      avatar: `https://picsum.photos/seed/${instructorId}/200/200`,
      bio: certify.certifyType === 'personal' ? '资深讲师，专注于课程创作' : '专业培训机构',
      courseCount: stats.courseCount,
      studentCount: stats.studentCount,
      rating: 4.8 + Math.random() * 0.2, // 模拟评分 4.8-5.0
      certifyType: certify.certifyType,
      createdAt: certify.createdAt,
    };
  }

  /**
   * 获取讲师的课程列表（学员端/公开信息）
   */
  async getInstructorCourses(query: {
    instructorId: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    // TODO: 从课程服务获取讲师的课程列表
    // 这里使用模拟数据
    const mockCourses = [
      {
        id: `course_${query.instructorId}_1`,
        title: '课程示例1',
        coverImage: `https://picsum.photos/seed/${query.instructorId}_1/400/300`,
        price: 299.00,
        originalPrice: 599.00,
        studentCount: Math.floor(Math.random() * 1000),
        rating: 4.8,
      },
      {
        id: `course_${query.instructorId}_2`,
        title: '课程示例2',
        coverImage: `https://picsum.photos/seed/${query.instructorId}_2/400/300`,
        price: 199.00,
        originalPrice: 399.00,
        studentCount: Math.floor(Math.random() * 1000),
        rating: 4.7,
      },
    ];

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = mockCourses.slice(start, end);

    return {
      list,
      total: mockCourses.length,
      page,
      pageSize,
    };
  }

  /**
   * 获取所有提现记录（调试用）
   */
  getAllWithdraws() {
    return Array.from(this.withdraws.values());
  }
}
