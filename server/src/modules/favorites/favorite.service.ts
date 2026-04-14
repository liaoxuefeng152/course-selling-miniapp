import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteService {
  // 内存存储（生产环境应该使用数据库）
  private favorites: Map<string, Set<string>> = new Map(); // key: userId, value: Set<courseId>

  /**
   * 添加/取消收藏
   */
  async toggleFavorite(userId: string, courseId: string) {
    if (!this.favorites.has(userId)) {
      this.favorites.set(userId, new Set());
    }

    const userFavorites = this.favorites.get(userId)!;
    const isFavorited = userFavorites.has(courseId);

    if (isFavorited) {
      userFavorites.delete(courseId);
      console.log(`[取消收藏] 用户ID: ${userId}, 课程ID: ${courseId}`);
    } else {
      userFavorites.add(courseId);
      console.log(`[添加收藏] 用户ID: ${userId}, 课程ID: ${courseId}`);
    }

    return {
      isFavorited: !isFavorited,
    };
  }

  /**
   * 获取收藏列表
   */
  async getFavoriteList(params: {
    userId: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    // 获取用户收藏的课程ID列表
    const favoriteCourseIds = this.favorites.get(params.userId) || new Set();

    if (favoriteCourseIds.size === 0) {
      return {
        list: [],
        total: 0,
        page,
        pageSize,
      };
    }

    // TODO: 联合查询课程详细信息
    const courses = Array.from(favoriteCourseIds).map((courseId: string) => ({
      courseId,
      title: '课程标题', // TODO: 从课程服务获取
      coverImage: 'https://example.com/cover.jpg',
      instructorName: '讲师名称', // TODO: 从课程服务获取
      price: 299.00, // TODO: 从课程服务获取
      originalPrice: 599.00,
      favoritedAt: new Date().toISOString(), // TODO: 存储收藏时间
    }));

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = courses.slice(start, end);

    return {
      list,
      total: courses.length,
      page,
      pageSize,
    };
  }

  /**
   * 检查是否已收藏
   */
  async checkFavorited(userId: string, courseId: string) {
    const userFavorites = this.favorites.get(userId);
    const isFavorited = userFavorites?.has(courseId) || false;

    return {
      isFavorited,
    };
  }
}
