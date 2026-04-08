import { Injectable } from '@nestjs/common';

@Injectable()
export class CourseService {
  // 内存存储（生产环境应该使用数据库）
  private courses: Map<string, any> = new Map();

  /**
   * 获取课程列表
   */
  async getCourses(query: {
    page?: number;
    pageSize?: number;
    status?: string;
    keyword?: string;
  }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    let list = Array.from(this.courses.values());

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
   * 获取课程详情
   */
  async getCourseDetail(id: string) {
    const course = this.courses.get(id);
    if (!course) {
      throw new Error('课程不存在');
    }
    return course;
  }

  /**
   * 创建课程
   */
  async createCourse(data: any) {
    const course = {
      id: `course_${Date.now()}`,
      instructorId: data.instructorId,
      title: data.title,
      description: data.description || '',
      coverImage: data.coverImage || '',
      price: data.price || 0,
      originalPrice: data.originalPrice || 0,
      category: data.category || '',
      tags: data.tags || [],
      chapters: data.chapters || [],
      status: 'draft',
      viewCount: 0,
      purchaseCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.courses.set(course.id, course);
    console.log(`[创建课程] 课程ID: ${course.id}, 标题: ${course.title}`);

    return course;
  }

  /**
   * 更新课程
   */
  async updateCourse(id: string, data: any) {
    const course = this.courses.get(id);
    if (!course) {
      throw new Error('课程不存在');
    }

    // 更新允许的字段
    if (data.title) course.title = data.title;
    if (data.description !== undefined) course.description = data.description;
    if (data.coverImage !== undefined) course.coverImage = data.coverImage;
    if (data.price !== undefined) course.price = data.price;
    if (data.originalPrice !== undefined) course.originalPrice = data.originalPrice;
    if (data.category !== undefined) course.category = data.category;
    if (data.tags !== undefined) course.tags = data.tags;
    if (data.chapters !== undefined) course.chapters = data.chapters;
    if (data.status !== undefined) course.status = data.status;

    course.updatedAt = new Date().toISOString();

    this.courses.set(id, course);
    return course;
  }

  /**
   * 删除课程
   */
  async deleteCourse(id: string) {
    const course = this.courses.get(id);
    if (!course) {
      throw new Error('课程不存在');
    }

    this.courses.delete(id);
    console.log(`[删除课程] 课程ID: ${id}`);
  }

  /**
   * 增加课程购买数量
   */
  async incrementPurchaseCount(id: string) {
    const course = this.courses.get(id);
    if (course) {
      course.purchaseCount += 1;
      course.updatedAt = new Date().toISOString();
      this.courses.set(id, course);
    }
  }

  /**
   * 增加课程浏览量
   */
  async incrementViewCount(id: string) {
    const course = this.courses.get(id);
    if (course) {
      course.viewCount += 1;
      course.updatedAt = new Date().toISOString();
      this.courses.set(id, course);
    }
  }
}
