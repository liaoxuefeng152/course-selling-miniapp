import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StudyService {
  // 内存存储（生产环境应该使用数据库）
  private studyProgress: Map<string, any> = new Map(); // key: userId_courseId
  private coursePurchases: Map<string, Set<string>> = new Map(); // key: userId, value: Set<courseId>

  /**
   * 获取我的课程列表
   */
  async getMyCourses(params: {
    userId: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    // 获取用户已购买的课程
    const purchasedCourseIds = this.coursePurchases.get(params.userId) || new Set();

    if (purchasedCourseIds.size === 0) {
      return {
        list: [],
        total: 0,
        page,
        pageSize,
      };
    }

    // 获取每个课程的学习进度
    const courses = Array.from(purchasedCourseIds).map((courseId: string) => {
      const key = `${params.userId}_${courseId}`;
      const progress = this.studyProgress.get(key);

      return {
        courseId,
        title: '课程标题', // TODO: 从课程服务获取
        coverImage: 'https://example.com/cover.jpg',
        instructorName: '讲师名称', // TODO: 从课程服务获取
        progress: progress?.overallProgress || 0,
        lastWatchTime: progress?.lastWatchTime || null,
        purchasedAt: progress?.purchasedAt || new Date().toISOString(),
        totalLessons: progress?.totalLessons || 0,
        completedLessons: progress?.completedLessons || 0,
      };
    });

    // 按最后学习时间排序
    courses.sort((a, b) => {
      const timeA = a.lastWatchTime ? new Date(a.lastWatchTime).getTime() : 0;
      const timeB = b.lastWatchTime ? new Date(b.lastWatchTime).getTime() : 0;
      return timeB - timeA;
    });

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
   * 记录学习进度
   */
  async recordProgress(data: {
    userId: string;
    courseId: string;
    lessonId: string;
    progress: number;
    currentTime: number;
  }) {
    const key = `${data.userId}_${data.courseId}`;
    const existing = this.studyProgress.get(key);

    const progressData = {
      userId: data.userId,
      courseId: data.courseId,
      overallProgress: data.progress,
      lastWatchTime: new Date().toISOString(),
      lessons: existing?.lessons || {},
      totalLessons: existing?.totalLessons || 0,
      completedLessons: existing?.completedLessons || 0,
      totalDuration: existing?.totalDuration || 0,
      watchedDuration: existing?.watchedDuration || 0,
      purchasedAt: existing?.purchasedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 更新课时进度
    progressData.lessons[data.lessonId] = {
      lessonId: data.lessonId,
      progress: data.progress,
      currentTime: data.currentTime,
      watchedDuration: data.currentTime,
      completed: data.progress >= 100,
      lastWatchTime: new Date().toISOString(),
    };

    // 更新总体进度统计
    const lessons = Object.values(progressData.lessons);
    progressData.completedLessons = lessons.filter((l: any) => l.completed).length;
    progressData.totalLessons = lessons.length;
    progressData.watchedDuration = lessons.reduce((sum: number, l: any) => sum + l.currentTime, 0);

    this.studyProgress.set(key, progressData);
    console.log(`[学习进度] 用户ID: ${data.userId}, 课程ID: ${data.courseId}, 进度: ${data.progress}%`);

    return null;
  }

  /**
   * 获取学习详情
   */
  async getStudyDetail(userId: string, courseId: string) {
    const key = `${userId}_${courseId}`;
    const progress = this.studyProgress.get(key);

    if (!progress) {
      throw new NotFoundException('未找到学习记录');
    }

    return {
      courseId: progress.courseId,
      progress: progress.overallProgress,
      totalLessons: progress.totalLessons,
      completedLessons: progress.completedLessons,
      totalDuration: progress.totalDuration,
      watchedDuration: progress.watchedDuration,
      lastWatchTime: progress.lastWatchTime,
      lessons: Object.values(progress.lessons),
    };
  }

  /**
   * 标记课程已购买
   */
  async markCoursePurchased(userId: string, courseId: string) {
    if (!this.coursePurchases.has(userId)) {
      this.coursePurchases.set(userId, new Set());
    }
    this.coursePurchases.get(userId)!.add(courseId);

    // 初始化学习进度
    const key = `${userId}_${courseId}`;
    if (!this.studyProgress.has(key)) {
      this.studyProgress.set(key, {
        userId,
        courseId,
        overallProgress: 0,
        lastWatchTime: null,
        lessons: {},
        totalLessons: 0,
        completedLessons: 0,
        totalDuration: 0,
        watchedDuration: 0,
        purchasedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(`[课程购买] 用户ID: ${userId}, 课程ID: ${courseId}`);
  }
}
