import { Injectable } from '@nestjs/common';

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  token: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

@Injectable()
export class AuthService {
  // 模拟用户数据
  private users: Map<string, User> = new Map();
  private tokens: Map<string, string> = new Map(); // token -> userId

  constructor() {
    // 添加一个默认测试用户
    const testUser: User = {
      id: 'user_001',
      nickname: '学员用户',
      avatar: 'https://picsum.photos/seed/avatar/200/200',
      phone: '138****8888',
      token: 'test_token_123456'
    };
    this.users.set(testUser.id, testUser);
    this.tokens.set(testUser.token, testUser.id);
  }

  /**
   * 微信登录
   */
  async login(code: string): Promise<LoginResult> {
    // 模拟微信登录逻辑
    // 实际生产环境需要调用微信接口验证 code
    console.log('微信登录 code:', code);
    
    // 生成模拟用户
    const userId = `user_${Date.now()}`;
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    
    const user: User = {
      id: userId,
      nickname: '新用户',
      avatar: `https://picsum.photos/seed/${userId}/200/200`,
      phone: '',
      token
    };
    
    this.users.set(userId, user);
    this.tokens.set(token, userId);
    
    return {
      user,
      token
    };
  }

  /**
   * 手机号登录
   */
  async phoneLogin(phone: string, code: string): Promise<LoginResult> {
    // 模拟验证验证码
    console.log('手机号登录:', phone, '验证码:', code);
    
    // 查找已存在的用户或创建新用户
    let user = Array.from(this.users.values()).find(u => u.phone === phone);
    
    if (!user) {
      const userId = `user_${Date.now()}`;
      user = {
        id: userId,
        nickname: `用户${phone.slice(-4)}`,
        avatar: `https://picsum.photos/seed/${userId}/200/200`,
        phone,
        token: ''
      };
      this.users.set(userId, user);
    }
    
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2)}`;
    user.token = token;
    this.tokens.set(token, user.id);
    
    return {
      user,
      token
    };
  }

  /**
   * 发送验证码
   */
  async sendCode(phone: string): Promise<{ success: boolean; code: string }> {
    // 模拟发送验证码
    // 实际生产环境需要调用短信接口
    console.log('发送验证码到:', phone);
    
    // 生成4位验证码
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    return {
      success: true,
      code // 开发环境下直接返回验证码，生产环境不应返回
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  /**
   * 更新用户信息
   */
  async updateProfile(
    userId: string,
    data: { nickname?: string; avatar?: string }
  ): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;
    
    if (data.nickname) user.nickname = data.nickname;
    if (data.avatar) user.avatar = data.avatar;
    
    return user;
  }
}
