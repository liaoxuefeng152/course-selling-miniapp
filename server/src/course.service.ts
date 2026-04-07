import { Injectable } from '@nestjs/common';

export interface Course {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  teacherIntro: string;
  price: number;
  originalPrice: number;
  students: number;
  rating: number;
  reviews: number;
  type: 'video' | 'audio' | 'text' | 'live';
  tags: string[];
  description: string;
  categoryId: number;
  categoryName: string;
  chapters: Chapter[];
  hasDiscount: boolean;
  discountPrice?: number;
}

export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  isFree: boolean;
  isCompleted: boolean;
}

export interface Live {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'replay';
  viewers: number;
  courseId: number;
  courseName?: string;
  price?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

@Injectable()
export class CourseService {
  private courses: Course[] = [
    {
      id: 1,
      title: '短视频剪辑实战课：从入门到精通',
      cover: 'https://picsum.photos/seed/course1/800/500',
      teacher: '张老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
      teacherIntro: '资深短视频运营专家，拥有10年影视制作经验，擅长短视频内容策划与剪辑技巧。',
      price: 299,
      originalPrice: 599,
      students: 1234,
      rating: 4.8,
      reviews: 456,
      type: 'video',
      tags: ['热门', '实战', '剪辑'],
      description: '这门课程将帮助你从零开始掌握短视频剪辑技能...',
      categoryId: 1,
      categoryName: '技能培训',
      hasDiscount: true,
      discountPrice: 299,
      chapters: [
        {
          id: 1,
          title: '第一章：剪辑基础入门',
          lessons: [
            { id: 1, title: '1.1 认识短视频剪辑', duration: '15:30', isFree: true, isCompleted: false },
            { id: 2, title: '1.2 剪辑软件安装与设置', duration: '12:45', isFree: true, isCompleted: false },
            { id: 3, title: '1.3 素材导入与整理', duration: '18:20', isFree: false, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 2,
      title: '职场沟通技巧提升训练营',
      cover: 'https://picsum.photos/seed/course2/800/500',
      teacher: '李老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
      teacherIntro: '资深职场培训讲师，专注职场软技能培训8年。',
      price: 199,
      originalPrice: 399,
      students: 856,
      rating: 4.9,
      reviews: 234,
      type: 'video',
      tags: ['畅销', '职场'],
      description: '提升职场沟通能力，让你在职场中更加游刃有余...',
      categoryId: 2,
      categoryName: '职场提升',
      hasDiscount: false,
      chapters: [
        {
          id: 1,
          title: '第一章：沟通基础',
          lessons: [
            { id: 1, title: '1.1 沟通的本质', duration: '20:00', isFree: true, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Python数据分析入门到实战',
      cover: 'https://picsum.photos/seed/course3/800/500',
      teacher: '王老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
      teacherIntro: '数据分析师，某知名互联网公司技术总监。',
      price: 399,
      originalPrice: 799,
      students: 2341,
      rating: 4.7,
      reviews: 567,
      type: 'video',
      tags: ['编程', '数据'],
      description: '从零开始学习Python数据分析，掌握数据处理、可视化等核心技能...',
      categoryId: 1,
      categoryName: '技能培训',
      hasDiscount: true,
      discountPrice: 399,
      chapters: []
    },
    {
      id: 4,
      title: '摄影入门：手机拍摄技巧',
      cover: 'https://picsum.photos/seed/course4/800/500',
      teacher: '陈老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher4/100/100',
      teacherIntro: '资深摄影师，作品多次获奖。',
      price: 99,
      originalPrice: 199,
      students: 5678,
      rating: 4.6,
      reviews: 890,
      type: 'video',
      tags: ['摄影'],
      description: '用手机也能拍出专业级照片...',
      categoryId: 3,
      categoryName: '兴趣爱好',
      hasDiscount: false,
      chapters: []
    },
    {
      id: 5,
      title: '瑜伽塑形：在家练出好身材',
      cover: 'https://picsum.photos/seed/course5/800/500',
      teacher: '赵老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher5/100/100',
      teacherIntro: '资深瑜伽教练，10年教学经验。',
      price: 159,
      originalPrice: 299,
      students: 3421,
      rating: 4.8,
      reviews: 456,
      type: 'video',
      tags: ['健身', '瑜伽'],
      description: '在家就能做的瑜伽塑形课程...',
      categoryId: 3,
      categoryName: '兴趣爱好',
      hasDiscount: false,
      chapters: []
    }
  ];

  private lives: Live[] = [
    {
      id: 1,
      title: '抖音直播带货实战分享',
      cover: 'https://picsum.photos/seed/live1/800/500',
      teacher: '刘老师',
      teacherAvatar: 'https://picsum.photos/seed/liveTeacher1/100/100',
      startTime: '今晚 20:00',
      status: 'upcoming',
      viewers: 0,
      courseId: 1,
      courseName: '抖音带货必修课',
      price: 199
    },
    {
      id: 2,
      title: '2024年考研备考规划指导',
      cover: 'https://picsum.photos/seed/live2/800/500',
      teacher: '周老师',
      teacherAvatar: 'https://picsum.photos/seed/liveTeacher2/100/100',
      startTime: '正在直播',
      status: 'live',
      viewers: 2341,
      courseId: 2,
      courseName: '考研英语全程班',
      price: 999
    },
    {
      id: 3,
      title: '电商创业从0到1实战课',
      cover: 'https://picsum.photos/seed/live3/800/500',
      teacher: '孙老师',
      teacherAvatar: 'https://picsum.photos/seed/liveTeacher3/100/100',
      startTime: '明天 14:00',
      status: 'upcoming',
      viewers: 0,
      courseId: 3,
      courseName: '电商创业指南',
      price: 299
    },
    {
      id: 4,
      title: '职场沟通技巧提升训练营',
      cover: 'https://picsum.photos/seed/live4/800/500',
      teacher: '李老师',
      teacherAvatar: 'https://picsum.photos/seed/liveTeacher4/100/100',
      startTime: '2024-01-15 20:00',
      status: 'replay',
      viewers: 5678,
      courseId: 2,
      courseName: '职场沟通课',
      price: 199
    }
  ];

  private categories: Category[] = [
    { id: 1, name: '技能培训', icon: '💼' },
    { id: 2, name: '职场提升', icon: '📈' },
    { id: 3, name: '兴趣爱好', icon: '🎨' },
    { id: 4, name: '考证考编', icon: '📚' },
    { id: 5, name: '亲子教育', icon: '👨‍👩‍👧' },
    { id: 6, name: '美食烹饪', icon: '🍳' }
  ];

  async getCourseList(params: {
    categoryId?: string;
    keyword?: string;
    sort?: string;
    page: number;
    pageSize: number;
  }): Promise<{ list: Course[]; total: number; page: number; pageSize: number }> {
    let filtered = [...this.courses];

    // 分类筛选
    if (params.categoryId) {
      filtered = filtered.filter(c => c.categoryId === parseInt(params.categoryId!));
    }

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(keyword) ||
        c.teacher.toLowerCase().includes(keyword)
      );
    }

    // 排序
    switch (params.sort) {
      case 'hot':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'new':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
    }

    // 分页
    const start = (params.page - 1) * params.pageSize;
    const list = filtered.slice(start, start + params.pageSize);

    return {
      list,
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize
    };
  }

  async getCourseDetail(id: string): Promise<Course | null> {
    return this.courses.find(c => c.id === parseInt(id)) || null;
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return this.courses.slice(0, 3);
  }

  async getLiveList(status?: string): Promise<Live[]> {
    if (status) {
      return this.lives.filter(l => l.status === status);
    }
    return this.lives;
  }

  async getLiveDetail(id: string): Promise<Live | null> {
    return this.lives.find(l => l.id === parseInt(id)) || null;
  }

  async toggleFavorite(userId: string, courseId: number, action: 'add' | 'remove'): Promise<{ success: boolean }> {
    console.log(`用户 ${userId} ${action === 'add' ? '收藏' : '取消收藏'} 课程 ${courseId}`);
    return { success: true };
  }

  async getFavorites(userId: string): Promise<Course[]> {
    console.log(`获取用户 ${userId} 的收藏列表`);
    return this.courses.slice(0, 2);
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }
}
