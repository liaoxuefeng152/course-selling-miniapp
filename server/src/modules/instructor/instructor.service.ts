import { Injectable } from '@nestjs/common';

@Injectable()
export class InstructorService {
  // 内存存储（生产环境应该使用数据库）
  private certifies: Map<string, any> = new Map();
  private stats: Map<string, any> = new Map();

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
}
