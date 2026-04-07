import { Injectable } from '@nestjs/common';

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  courseId: number;
  courseTitle: string;
  courseCover: string;
  teacher: string;
  price: number;
  originalPrice: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payMethod?: 'wechat' | 'alipay';
  paidAt?: string;
  createdAt: string;
}

export interface MyCourse {
  id: number;
  courseId: number;
  title: string;
  cover: string;
  teacher: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastStudyTime: string;
  status: 'learning' | 'completed';
  purchasedAt: string;
}

@Injectable()
export class OrderService {
  private orders: Order[] = [
    {
      id: 'order_001',
      orderNo: 'ORD202401180001',
      userId: 'user_001',
      courseId: 1,
      courseTitle: '短视频剪辑实战课：从入门到精通',
      courseCover: 'https://picsum.photos/seed/course1/400/300',
      teacher: '张老师',
      price: 299,
      originalPrice: 599,
      status: 'paid',
      payMethod: 'wechat',
      paidAt: '2024-01-15 10:30:00',
      createdAt: '2024-01-15 10:25:00'
    },
    {
      id: 'order_002',
      orderNo: 'ORD202401180002',
      userId: 'user_001',
      courseId: 2,
      courseTitle: '职场沟通技巧提升训练营',
      courseCover: 'https://picsum.photos/seed/course2/400/300',
      teacher: '李老师',
      price: 199,
      originalPrice: 399,
      status: 'paid',
      payMethod: 'alipay',
      paidAt: '2024-01-14 15:20:00',
      createdAt: '2024-01-14 15:15:00'
    },
    {
      id: 'order_003',
      orderNo: 'ORD202401180003',
      userId: 'user_001',
      courseId: 3,
      courseTitle: 'Python数据分析入门到实战',
      courseCover: 'https://picsum.photos/seed/course3/400/300',
      teacher: '王老师',
      price: 399,
      originalPrice: 799,
      status: 'pending',
      createdAt: '2024-01-18 09:00:00'
    }
  ];

  private myCourses: MyCourse[] = [
    {
      id: 1,
      courseId: 1,
      title: '短视频剪辑实战课：从入门到精通',
      cover: 'https://picsum.photos/seed/course1/400/300',
      teacher: '张老师',
      progress: 65,
      totalLessons: 20,
      completedLessons: 13,
      lastStudyTime: '2024-01-18 15:30:00',
      status: 'learning',
      purchasedAt: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      courseId: 2,
      title: '职场沟通技巧提升训练营',
      cover: 'https://picsum.photos/seed/course2/400/300',
      teacher: '李老师',
      progress: 100,
      totalLessons: 15,
      completedLessons: 15,
      lastStudyTime: '2024-01-15 20:00:00',
      status: 'completed',
      purchasedAt: '2024-01-14 15:20:00'
    }
  ];

  async createOrder(userId: string, courseId: number, price: number): Promise<Order> {
    const orderId = `order_${Date.now()}`;
    const orderNo = `ORD${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Date.now()).slice(-6)}`;
    
    const order: Order = {
      id: orderId,
      orderNo,
      userId,
      courseId,
      courseTitle: `课程${courseId}`,
      courseCover: `https://picsum.photos/seed/course${courseId}/400/300`,
      teacher: '讲师',
      price,
      originalPrice: price * 2,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    this.orders.push(order);
    return order;
  }

  async payOrder(orderId: string, payMethod: 'wechat' | 'alipay'): Promise<{
    success: boolean;
    order: Order;
    payInfo?: {
      nonceStr: string;
      sign: string;
      package: string;
      paySign: string;
      timestamp: string;
    };
  }> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('订单不存在');
    }
    
    order.status = 'paid';
    order.payMethod = payMethod;
    order.paidAt = new Date().toISOString();
    
    // 模拟支付回调信息
    const payInfo = {
      nonceStr: Math.random().toString(36).substr(2),
      sign: 'mock_sign',
      package: 'prepay_id=mock_prepay_id',
      paySign: 'mock_pay_sign',
      timestamp: Math.floor(Date.now() / 1000).toString()
    };
    
    return {
      success: true,
      order,
      payInfo
    };
  }

  async getOrderList(
    userId: string,
    status?: string,
    pagination?: { page: number; pageSize: number }
  ): Promise<{ list: Order[]; total: number; page: number; pageSize: number }> {
    let filtered = this.orders.filter(o => o.userId === userId);
    
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const list = filtered.slice(start, start + pageSize);
    
    return {
      list,
      total: filtered.length,
      page,
      pageSize
    };
  }

  async getOrderDetail(orderId: string): Promise<Order | null> {
    return this.orders.find(o => o.id === orderId) || null;
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean }> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
    }
    return { success: true };
  }

  async refundOrder(orderId: string, reason: string): Promise<{ success: boolean }> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'refunded';
      console.log(`退款原因: ${reason}`);
    }
    return { success: true };
  }

  async getMyCourses(
    userId: string,
    pagination?: { page: number; pageSize: number }
  ): Promise<{ list: MyCourse[]; total: number; page: number; pageSize: number }> {
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const list = this.myCourses.slice(start, start + pageSize);
    
    return {
      list,
      total: this.myCourses.length,
      page,
      pageSize
    };
  }

  async checkPurchased(userId: string, courseId: string): Promise<{ purchased: boolean; orderId?: string }> {
    const order = this.orders.find(
      o => o.userId === userId && o.courseId === parseInt(courseId) && o.status === 'paid'
    );
    
    return {
      purchased: !!order,
      orderId: order?.id
    };
  }
}
