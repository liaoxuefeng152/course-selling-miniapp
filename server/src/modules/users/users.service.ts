import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  // 内存存储（生产环境应该使用数据库）
  private users: Map<string, any> = new Map();
  private codes: Map<string, { code: string; expireTime: number }> = new Map();

  /**
   * 发送验证码
   */
  async sendCode(phone: string) {
    // 验证手机号格式
    if (!/^1\d{10}$/.test(phone)) {
      throw new Error('手机号格式不正确');
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 5 * 60 * 1000; // 5分钟过期

    // 保存验证码
    this.codes.set(phone, { code, expireTime });

    console.log(`[验证码] 手机号: ${phone}, 验证码: ${code}, 过期时间: ${new Date(expireTime).toISOString()}`);

    // TODO: 实际应该调用短信服务发送验证码
    // await this.smsService.sendCode(phone, code);

    return { phone, expiresIn: 300 };
  }

  /**
   * 验证验证码
   */
  private verifyCode(phone: string, code: string): boolean {
    const savedCode = this.codes.get(phone);
    if (!savedCode) {
      return false;
    }

    if (Date.now() > savedCode.expireTime) {
      this.codes.delete(phone);
      return false;
    }

    if (savedCode.code !== code) {
      return false;
    }

    // 验证成功，删除验证码
    this.codes.delete(phone);
    return true;
  }

  /**
   * 手机号登录/注册
   */
  async login(phone: string, code: string, role: 'student' | 'instructor') {
    // 验证验证码
    if (!this.verifyCode(phone, code)) {
      throw new Error('验证码错误或已过期');
    }

    // 查找用户，如果不存在则创建
    let user = Array.from(this.users.values()).find((u) => u.phone === phone);

    if (!user) {
      // 创建新用户
      user = {
        id: Date.now().toString(),
        phone,
        nickname: role === 'instructor' ? '讲师用户' : '学员用户',
        avatar: role === 'instructor'
          ? 'https://picsum.photos/seed/instructor/200/200'
          : 'https://picsum.photos/seed/student/200/200',
        role,
        email: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(user.id, user);
    } else {
      // 更新用户角色
      user.role = role;
      user.updatedAt = new Date().toISOString();
    }

    // 生成 token
    const token = `token-${user.id}-${Date.now()}`;

    return {
      user,
      token,
    };
  }

  /**
   * 微信一键登录
   */
  async wechatLogin(code: string, role: 'student' | 'instructor') {
    // TODO: 调用微信登录接口获取用户信息
    // const wechatUser = await this.wechatService.login(code);

    // 模拟微信用户信息
    const openid = `openid_${code}`;
    let user = Array.from(this.users.values()).find((u) => u.openid === openid);

    if (!user) {
      user = {
        id: Date.now().toString(),
        openid,
        nickname: role === 'instructor' ? '讲师用户' : '学员用户',
        avatar: role === 'instructor'
          ? 'https://picsum.photos/seed/instructor/200/200'
          : 'https://picsum.photos/seed/student/200/200',
        role,
        phone: '',
        email: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(user.id, user);
    } else {
      user.role = role;
      user.updatedAt = new Date().toISOString();
    }

    const token = `token-${user.id}-${Date.now()}`;

    return {
      user,
      token,
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userId: string, data: any) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    // 更新允许的字段
    if (data.nickname) user.nickname = data.nickname;
    if (data.avatar) user.avatar = data.avatar;
    if (data.email) user.email = data.email;
    user.updatedAt = new Date().toISOString();

    this.users.set(userId, user);
    return user;
  }

  /**
   * 退出登录
   */
  async logout(userId: string) {
    // TODO: 清除 token 缓存
    console.log(`[退出登录] 用户ID: ${userId}`);
    return { success: true };
  }

  /**
   * 获取所有用户（调试用）
   */
  getAllUsers() {
    return Array.from(this.users.values());
  }
}
