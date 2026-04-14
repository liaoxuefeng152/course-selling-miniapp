import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStore, UserRole } from '@/stores/user';
import { Network } from '@/network';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    if (!/^1\d{10}$/.test(phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    // 开始倒计时
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      // 调用后端接口发送验证码
      await Network.request({
        url: '/api/users/send-code',
        method: 'POST',
        data: { phone },
      });

      Taro.showToast({ title: '验证码已发送', icon: 'success' });
    } catch (error) {
      console.error('发送验证码失败:', error);
      Taro.showToast({ title: '发送失败，请重试', icon: 'none' });
    }
  };

  const handleWechatLogin = async () => {
    // 检查是否在微信小程序环境
    const env = Taro.getEnv();
    if (env !== Taro.ENV_TYPE.WEAPP && env !== Taro.ENV_TYPE.TT) {
      Taro.showToast({
        title: '微信登录仅在小程序中可用',
        icon: 'none'
      });
      return;
    }

    setLoading(true);

    try {
      // 调用微信登录 API 获取 code
      const loginRes = await Taro.login();

      console.log('微信登录 code:', loginRes.code);

      if (!loginRes.code) {
        throw new Error('获取微信登录凭证失败');
      }

      // 调用后端接口进行微信登录
      const res = await Network.request({
        url: '/api/users/wechat-login',
        method: 'POST',
        data: { code: loginRes.code, role: UserRole.STUDENT },
      });

      console.log('微信登录响应:', res.data);

      if (res.data?.code === 200 && res.data?.data) {
        const { user, token } = res.data.data;

        // 保存用户信息到 store
        useUserStore.getState().login(user, token);

        Taro.showToast({ title: '登录成功', icon: 'success' });

        setTimeout(() => {
          Taro.reLaunch({ url: '/pages/index/index' });
        }, 1000);
      } else {
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' });
      }
    } catch (error) {
      console.error('微信登录失败:', error);
      Taro.showToast({ title: '微信登录失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }

    if (!code) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }

    setLoading(true);

    try {
      // 调用后端接口登录，默认使用学员角色
      const res = await Network.request({
        url: '/api/users/login',
        method: 'POST',
        data: { phone, code, role: UserRole.STUDENT },
      });

      console.log('登录响应:', res.data);

      if (res.data?.code === 200 && res.data?.data) {
        const { user, token } = res.data.data;

        // 保存用户信息到 store
        useUserStore.getState().login(user, token);

        Taro.showToast({ title: '登录成功', icon: 'success' });

        setTimeout(() => {
          // 所有用户都跳转到首页
          console.log('跳转到首页');
          Taro.reLaunch({ url: '/pages/index/index' });
        }, 1000);
      } else {
        Taro.showToast({ title: res.data?.msg || '登录失败', icon: 'none' });
      }
    } catch (error) {
      console.error('登录失败:', error);
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center">
          <View onClick={() => Taro.navigateBack()}>
            <ArrowLeft size={24} color="#374151" />
          </View>
          <Text className="block text-lg font-semibold text-gray-800 ml-4">登录/注册</Text>
        </View>
      </View>

      <View className="px-4 mt-8">
        <View className="mb-6">
          <Text className="block text-2xl font-bold text-gray-800 mb-2">欢迎回来</Text>
          <Text className="block text-sm text-gray-500">登录即可开始学习之旅</Text>
        </View>

        <Card>
          <CardContent className="p-6">
            {/* 手机号输入 */}
            <View className="mb-6">
              <Text className="block text-sm font-medium text-gray-700 mb-2">手机号</Text>
              <Input
                type="number"
                placeholder="请输入手机号"
                value={phone}
                onInput={(e) => setPhone(e.detail.value)}
                maxlength={11}
              />
            </View>

            {/* 验证码输入 */}
            <View className="mb-6">
              <Text className="block text-sm font-medium text-gray-700 mb-2">验证码</Text>
              <View className="flex flex-row items-center gap-3">
                <View className="flex-1">
                  <Input
                    type="number"
                    placeholder="请输入验证码"
                    value={code}
                    onInput={(e) => setCode(e.detail.value)}
                    maxlength={6}
                  />
                </View>
                <Button
                  variant={countdown > 0 ? 'outline' : 'default'}
                  className="flex-shrink-0"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </View>
            </View>

            {/* 登录按钮 */}
            <Button
              className="w-full bg-orange-500 text-white"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录/注册'}
            </Button>
          </CardContent>
        </Card>

        {/* 协议说明 */}
        <View className="mt-6 px-2">
          <Text className="block text-xs text-gray-500 text-center leading-relaxed">
            登录即表示您已同意
            <Text className="text-orange-500">《用户协议》</Text>
            和
            <Text className="text-orange-500">《隐私政策》</Text>
          </Text>
        </View>

        {/* 其他登录方式 */}
        <View className="mt-12">
          <View className="flex flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="block text-xs text-gray-400 px-4">其他登录方式</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <View className="flex flex-row justify-center gap-12">
            <View className="flex flex-col items-center" onClick={handleWechatLogin}>
              <View className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Text className="text-xl">💬</Text>
              </View>
              <Text className="block text-xs text-gray-500 mt-2">微信登录</Text>
            </View>
            <View className="flex flex-col items-center">
              <View className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Text className="text-xl">📱</Text>
              </View>
              <Text className="block text-xs text-gray-500 mt-2">手机号登录</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginPage;
