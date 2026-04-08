import { Injectable } from '@nestjs/common';

@Injectable()
export class LiveService {
  // 内存存储（生产环境应该使用数据库）
  private lives: Map<string, any> = new Map();

  /**
   * 获取直播列表
   */
  async getLives(query: {
    page?: number;
    pageSize?: number;
    status?: string;
    keyword?: string;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    let list = Array.from(this.lives.values());

    // 按状态筛选
    if (query.status) {
      list = list.filter((item) => item.status === query.status);
    }

    // 按关键词搜索
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      list = list.filter((item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      );
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
   * 获取直播详情
   */
  async getLiveDetail(id: string) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }
    return live;
  }

  /**
   * 创建直播
   */
  async createLive(data: any) {
    const live = {
      id: `live_${Date.now()}`,
      instructorId: data.instructorId,
      title: data.title,
      description: data.description || '',
      coverImage: data.coverImage || '',
      platform: data.platform || 'douyin', // douyin, wechat, all
      streamUrl: data.streamUrl || '',
      scheduledStartTime: data.scheduledStartTime,
      scheduledEndTime: data.scheduledEndTime,
      status: 'scheduled', // scheduled, live, ended, cancelled
      viewerCount: 0,
      peakViewerCount: 0,
      likeCount: 0,
      shareCount: 0,
      productIds: data.productIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.lives.set(live.id, live);
    console.log(`[创建直播] 直播ID: ${live.id}, 标题: ${live.title}, 平台: ${live.platform}`);

    return live;
  }

  /**
   * 更新直播
   */
  async updateLive(id: string, data: any) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }

    // 更新允许的字段
    if (data.title) live.title = data.title;
    if (data.description !== undefined) live.description = data.description;
    if (data.coverImage !== undefined) live.coverImage = data.coverImage;
    if (data.platform !== undefined) live.platform = data.platform;
    if (data.streamUrl !== undefined) live.streamUrl = data.streamUrl;
    if (data.scheduledStartTime !== undefined) live.scheduledStartTime = data.scheduledStartTime;
    if (data.scheduledEndTime !== undefined) live.scheduledEndTime = data.scheduledEndTime;
    if (data.productIds !== undefined) live.productIds = data.productIds;
    if (data.status !== undefined) live.status = data.status;

    live.updatedAt = new Date().toISOString();

    this.lives.set(id, live);
    return live;
  }

  /**
   * 删除直播
   */
  async deleteLive(id: string) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }

    this.lives.delete(id);
    console.log(`[删除直播] 直播ID: ${id}`);
  }

  /**
   * 开始直播
   */
  async startLive(id: string) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }

    if (live.status !== 'scheduled') {
      throw new Error('只能开始已预约的直播');
    }

    live.status = 'live';
    live.actualStartTime = new Date().toISOString();
    live.updatedAt = new Date().toISOString();

    this.lives.set(id, live);
    console.log(`[开始直播] 直播ID: ${id}`);

    return live;
  }

  /**
   * 结束直播
   */
  async endLive(id: string) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }

    if (live.status !== 'live') {
      throw new Error('只能结束进行中的直播');
    }

    live.status = 'ended';
    live.actualEndTime = new Date().toISOString();
    live.updatedAt = new Date().toISOString();

    this.lives.set(id, live);
    console.log(`[结束直播] 直播ID: ${id}, 峰值观看: ${live.peakViewerCount}`);

    return live;
  }

  /**
   * 获取直播中控台数据
   */
  async getLiveDashboard(id: string) {
    const live = this.lives.get(id);
    if (!live) {
      throw new Error('直播不存在');
    }

    // 返回中控台所需的数据
    return {
      ...live,
      dashboard: {
        viewerCount: live.viewerCount,
        peakViewerCount: live.peakViewerCount,
        likeCount: live.likeCount,
        shareCount: live.shareCount,
        duration: live.actualStartTime
          ? Math.floor((Date.now() - new Date(live.actualStartTime).getTime()) / 1000)
          : 0,
        productSales: 0,
        orders: [],
      },
    };
  }

  /**
   * 更新直播数据（实时数据更新）
   */
  async updateLiveStats(id: string, data: {
    viewerCount?: number;
    likeCount?: number;
    shareCount?: number;
  }) {
    const live = this.lives.get(id);
    if (live) {
      if (data.viewerCount !== undefined) {
        live.viewerCount = data.viewerCount;
        if (data.viewerCount > live.peakViewerCount) {
          live.peakViewerCount = data.viewerCount;
        }
      }
      if (data.likeCount !== undefined) live.likeCount = data.likeCount;
      if (data.shareCount !== undefined) live.shareCount = data.shareCount;
      live.updatedAt = new Date().toISOString();
      this.lives.set(id, live);
    }
  }
}
