import { Injectable } from '@nestjs/common';

@Injectable()
export class PlatformService {
  // 内存存储（生产环境应该使用数据库）
  private accounts: Map<string, any> = new Map();

  /**
   * 获取已绑定的平台账号列表
   */
  async getAccounts(userId: string) {
    const userAccounts = Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId
    );
    return userAccounts;
  }

  /**
   * 绑定平台账号
   */
  async bindAccount(data: {
    userId: string;
    platform: string;
    openId: string;
    nickname: string;
    avatar: string;
    accessToken: string;
  }) {
    const id = `account_${data.platform}_${data.openId}`;

    // 检查是否已绑定
    const existing = this.accounts.get(id);
    if (existing && existing.userId === data.userId) {
      throw new Error('该账号已绑定');
    }

    const account = {
      id,
      userId: data.userId,
      platform: data.platform,
      openId: data.openId,
      nickname: data.nickname,
      avatar: data.avatar,
      accessToken: data.accessToken,
      refreshToken: '', // TODO: 从授权回调中获取
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后过期
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.accounts.set(id, account);
    console.log(`[绑定账号] 用户ID: ${data.userId}, 平台: ${data.platform}, OpenID: ${data.openId}`);

    return account;
  }

  /**
   * 解绑平台账号
   */
  async unbindAccount(userId: string, platform: string, openId: string) {
    const id = `account_${platform}_${openId}`;
    const account = this.accounts.get(id);

    if (!account) {
      throw new Error('账号不存在');
    }

    if (account.userId !== userId) {
      throw new Error('无权解绑该账号');
    }

    this.accounts.delete(id);
    console.log(`[解绑账号] 用户ID: ${userId}, 平台: ${platform}, OpenID: ${openId}`);
  }

  /**
   * 刷新平台账号 Token
   */
  async refreshToken(userId: string, platform: string, openId: string) {
    const id = `account_${platform}_${openId}`;
    const account = this.accounts.get(id);

    if (!account) {
      throw new Error('账号不存在');
    }

    if (account.userId !== userId) {
      throw new Error('无权操作该账号');
    }

    // TODO: 调用平台接口刷新 token
    // const newToken = await this.refreshPlatformToken(account.refreshToken);
    const newToken = `new_token_${Date.now()}`;

    account.accessToken = newToken;
    account.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    account.updatedAt = new Date().toISOString();

    this.accounts.set(id, account);

    console.log(`[刷新Token] 平台: ${platform}, OpenID: ${openId}`);

    return account;
  }

  /**
   * 获取平台授权 URL
   */
  async getAuthorizeUrl(platform: string, redirectUri: string) {
    // TODO: 根据不同的平台返回不同的授权 URL
    let authorizeUrl = '';

    if (platform === 'douyin') {
      // 抖音开放平台授权 URL
      authorizeUrl = `https://open.douyin.com/platform/oauth/connect?client_id=YOUR_CLIENT_ID&response_type=code&scope=user_info&redirect_uri=${encodeURIComponent(redirectUri)}`;
    } else if (platform === 'wechat') {
      // 微信视频号授权 URL
      authorizeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=YOUR_APPID&response_type=code&scope=snsapi_userinfo&redirect_uri=${encodeURIComponent(redirectUri)}#wechat_redirect`;
    } else {
      throw new Error('不支持的平台');
    }

    return { authorizeUrl };
  }

  /**
   * 通过授权码获取平台账号信息
   */
  async getAccountByCode(platform: string, code: string, redirectUri: string) {
    // TODO: 调用平台接口获取 access_token 和用户信息
    // const platformUser = await this.getPlatformUserInfo(platform, code, redirectUri);

    // 模拟返回
    return {
      openId: `mock_openid_${code}`,
      nickname: `平台用户_${code}`,
      avatar: `https://picsum.photos/seed/${code}/200/200`,
      accessToken: `access_token_${code}`,
    };
  }
}
