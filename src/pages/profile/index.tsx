import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import {
  Settings,
  Bell,
  Heart,
  Clock,
  CreditCard,
  MessageCircle,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Star,
  CircleQuestionMark,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// 菜单项类型定义
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}

const ProfilePage = () => {
  const [userInfo] = useState({
    nickname: '学员用户',
    avatar: 'https://picsum.photos/seed/avatar/200/200',
    phone: '138****8888',
    isLoggedIn: true,
  });

  const [stats] = useState({
    courses: 4,
    favorites: 12,
    coupons: 3,
    points: 580,
  });

  const handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/login/index',
    });
  };

  const handleMenuClick = (url: string) => {
    if (!userInfo.isLoggedIn) {
      handleLogin();
      return;
    }
    Taro.navigateTo({ url });
  };

  const handleOrderClick = (status?: string) => {
    if (!userInfo.isLoggedIn) {
      handleLogin();
      return;
    }
    Taro.navigateTo({
      url: `/pages/order/index${status ? `?status=${status}` : ''}`,
    });
  };

  const menuItems: MenuItem[] = [
    {
      icon: <ShoppingBag size={20} color="#FF6B35" />,
      label: '我的订单',
      badge: 2,
      onClick: () => handleOrderClick(),
    },
    {
      icon: <Heart size={20} color="#EC4899" />,
      label: '我的收藏',
      onClick: () => handleMenuClick('/pages/favorites/index'),
    },
    {
      icon: <Clock size={20} color="#3B82F6" />,
      label: '学习历史',
      onClick: () => handleMenuClick('/pages/history/index'),
    },
    {
      icon: <Star size={20} color="#F59E0B" />,
      label: '我的评价',
      onClick: () => handleMenuClick('/pages/reviews/index'),
    },
    {
      icon: <CreditCard size={20} color="#10B981" />,
      label: '优惠券',
      badge: stats.coupons,
      onClick: () => handleMenuClick('/pages/coupons/index'),
    },
    {
      icon: <MessageCircle size={20} color="#8B5CF6" />,
      label: '消息通知',
      onClick: () => handleMenuClick('/pages/messages/index'),
    },
    {
      icon: <Bell size={20} color="#6B7280" />,
      label: '课程提醒',
      onClick: () => handleMenuClick('/pages/reminders/index'),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      icon: <Settings size={20} color="#6B7280" />,
      label: '设置',
      onClick: () => handleMenuClick('/pages/settings/index'),
    },
    {
      icon: <CircleQuestionMark size={20} color="#6B7280" />,
      label: '帮助与反馈',
      onClick: () => handleMenuClick('/pages/help/index'),
    },
  ];

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部用户信息 */}
      <View className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-6 pb-8">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="block text-lg font-semibold text-white">个人中心</Text>
          <Bell size={24} color="#FFFFFF" />
        </View>

        {userInfo.isLoggedIn ? (
          <View className="flex flex-row items-center">
            <Avatar className="w-14 h-14">
              <AvatarImage src={userInfo.avatar} />
            </Avatar>
            <View className="ml-4 flex-1">
              <Text className="block text-lg font-semibold text-white">{userInfo.nickname}</Text>
              <Text className="block text-sm text-white text-opacity-80">{userInfo.phone}</Text>
            </View>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-orange-500 bg-white"
              onClick={() => handleMenuClick('/pages/profile/edit')}
            >
              编辑资料
            </Button>
          </View>
        ) : (
          <View className="flex flex-row items-center justify-center py-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src="" />
            </Avatar>
            <View className="ml-4">
              <Button
                variant="default"
                className="bg-white text-orange-500"
                onClick={handleLogin}
              >
                登录/注册
              </Button>
            </View>
          </View>
        )}
      </View>

      {/* 数据统计卡片 */}
      <View className="px-4 -mt-4">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <View className="flex flex-row justify-around">
              <View
                className="flex flex-col items-center"
                onClick={() => handleMenuClick('/pages/study/index')}
              >
                <Text className="block text-xl font-bold text-gray-800">{stats.courses}</Text>
                <Text className="block text-xs text-gray-500">在学课程</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View
                className="flex flex-col items-center"
                onClick={() => handleMenuClick('/pages/favorites/index')}
              >
                <Text className="block text-xl font-bold text-gray-800">{stats.favorites}</Text>
                <Text className="block text-xs text-gray-500">我的收藏</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View
                className="flex flex-col items-center"
                onClick={() => handleMenuClick('/pages/coupons/index')}
              >
                <Text className="block text-xl font-bold text-gray-800">{stats.coupons}</Text>
                <Text className="block text-xs text-gray-500">优惠券</Text>
              </View>
              <View className="w-px bg-gray-200" />
              <View className="flex flex-col items-center">
                <Text className="block text-xl font-bold text-gray-800">{stats.points}</Text>
                <Text className="block text-xs text-gray-500">积分</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      <ScrollView scrollY className="flex-1 px-4 mt-4">
        {/* 订单入口 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="block text-base font-semibold text-gray-800">我的订单</Text>
              <View
                className="flex flex-row items-center"
                onClick={() => handleOrderClick()}
              >
                <Text className="block text-sm text-gray-500 mr-1">全部订单</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </View>
            <View className="flex flex-row justify-around">
              {[
                { label: '待付款', icon: '💰' },
                { label: '待发货', icon: '📦' },
                { label: '待收货', icon: '🚚' },
                { label: '待评价', icon: '⭐' },
              ].map((item, index) => (
                <View
                  key={index}
                  className="flex flex-col items-center"
                  onClick={() => handleOrderClick(['pending', 'shipped', 'received', 'review'][index])}
                >
                  <Text className="text-2xl mb-1">{item.icon}</Text>
                  <Text className="block text-xs text-gray-600">{item.label}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 功能菜单 */}
        <Card className="mb-4">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <View key={index}>
                <View
                  className="flex flex-row items-center justify-between px-4 py-3"
                  onClick={item.onClick}
                >
                  <View className="flex flex-row items-center">
                    {item.icon}
                    <Text className="block text-sm text-gray-800 ml-3">{item.label}</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    {item.badge ? (
                      <View className="bg-red-500 rounded-full px-2 py-1 mr-1">
                        <Text className="text-xs text-white">{item.badge}</Text>
                      </View>
                    ) : null}
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                </View>
                {index < menuItems.length - 1 && <Separator />}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* 设置菜单 */}
        <Card className="mb-4">
          <CardContent className="p-0">
            {settingsItems.map((item, index) => (
              <View key={index}>
                <View
                  className="flex flex-row items-center justify-between px-4 py-3"
                  onClick={item.onClick}
                >
                  <View className="flex flex-row items-center">
                    {item.icon}
                    <Text className="block text-sm text-gray-800 ml-3">{item.label}</Text>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
                {index < settingsItems.length - 1 && <Separator />}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* 退出登录 */}
        {userInfo.isLoggedIn && (
          <View className="mb-4">
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-600"
            >
              <LogOut size={16} color="#6B7280" />
              <Text className="ml-2">退出登录</Text>
            </Button>
          </View>
        )}

        {/* 版本信息 */}
        <View className="flex flex-col items-center py-4">
          <Text className="block text-xs text-gray-400">多平台卖课小程序 v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
