import { View, Text, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
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
  User,
  GraduationCap,
  ArrowLeftRight,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserStore, UserRole } from '@/stores/user';

// 菜单项类型定义
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}

const ProfilePage = () => {
  const { userInfo, instructorInfo, switchRole, logout } = useUserStore();
  const [showRoleSwitchDialog, setShowRoleSwitchDialog] = useState(false);

  const [stats] = useState({
    courses: 4,
    favorites: 12,
    coupons: 3,
    points: 580,
  });

  // 从本地存储加载登录状态
  useEffect(() => {
    loadUserInfo();
  }, []);

  // 监听页面显示，重新加载状态
  useEffect(() => {
    const handleShow = () => {
      loadUserInfo();
    };

    Taro.onAppShow?.(handleShow);

    return () => {
      Taro.offAppShow?.(handleShow);
    };
  }, []);

  const loadUserInfo = () => {
    // 数据已从 store 自动加载，无需额外处理
    console.log('用户信息已从 store 加载');
  };

  const handleLogin = () => {
    console.log('点击登录按钮，准备跳转到登录页面');
    Taro.navigateTo({
      url: '/pages/login/index',
      success: () => {
        console.log('跳转登录页面成功');
      },
      fail: (err) => {
        console.error('跳转登录页面失败:', err);
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  };

  const handleMenuClick = (url: string) => {
    if (!userInfo) {
      handleLogin();
      return;
    }
    Taro.navigateTo({ url });
  };

  const handleOrderClick = (status?: string) => {
    if (!userInfo) {
      handleLogin();
      return;
    }
    Taro.navigateTo({
      url: `/pages/order/index${status ? `?status=${status}` : ''}`,
    });
  };

  const handleEditProfile = () => {
    if (!userInfo) {
      handleLogin();
      return;
    }
    Taro.navigateTo({
      url: '/pages/profile/edit/index',
    });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.showToast({ title: '已退出登录', icon: 'success' });
        }
      },
    });
  };

  // 临时调试：强制清除存储并刷新
  const handleDebugClear = () => {
    logout();
    Taro.showToast({ title: '已清除存储', icon: 'success' });
    console.log('调试：已清除所有存储');
  };

  // 身份切换
  const handleSwitchRole = () => {
    if (!userInfo) return;

    const currentRole = userInfo.role;
    const newRole = currentRole === UserRole.INSTRUCTOR ? UserRole.STUDENT : UserRole.INSTRUCTOR;

    Taro.showModal({
      title: '切换身份',
      content: `确定要切换到${newRole === UserRole.INSTRUCTOR ? '讲师' : '学员'}身份吗？`,
      success: (res) => {
        if (res.confirm) {
          switchRole(newRole);
          setShowRoleSwitchDialog(false);
          Taro.showToast({ title: '切换成功', icon: 'success' });

          // 如果切换到讲师身份，跳转到讲师工作台
          if (newRole === UserRole.INSTRUCTOR) {
            setTimeout(() => {
              Taro.redirectTo({ url: '/pages/instructor/index/index' });
            }, 1000);
          }
        }
      },
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

        {userInfo ? (
          <View className="flex flex-row items-center">
            <Avatar className="w-14 h-14">
              <AvatarImage src={userInfo?.avatar} />
            </Avatar>
            <View className="ml-4 flex-1">
              <View className="flex flex-row items-center">
                <Text className="block text-lg font-semibold text-white">{userInfo?.nickname}</Text>
                <View
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    userInfo?.role === UserRole.INSTRUCTOR ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {userInfo?.role === UserRole.INSTRUCTOR ? '讲师' : '学员'}
                </View>
              </View>
              <Text className="block text-sm text-white text-opacity-80">{userInfo?.phone}</Text>
            </View>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-orange-500 bg-white mr-2"
              onClick={() => setShowRoleSwitchDialog(true)}
            >
              <ArrowLeftRight size={14} color="#FF6B35" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-orange-500 bg-white"
              onClick={handleEditProfile}
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
        {userInfo && (
          <View className="mb-4">
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-600"
              onClick={handleLogout}
            >
              <LogOut size={16} color="#6B7280" />
              <Text className="ml-2">退出登录</Text>
            </Button>
          </View>
        )}

        {/* 临时调试按钮 */}
        <View className="mb-4">
          <Button
            variant="ghost"
            className="w-full text-xs text-gray-400"
            onClick={handleDebugClear}
          >
            调试：清除存储
          </Button>
        </View>

        {/* 版本信息 */}
        <View className="flex flex-col items-center py-4">
          <Text className="block text-xs text-gray-400">在线课堂 v1.0.0</Text>
        </View>
      </ScrollView>

      {/* 身份切换对话框 */}
      <Dialog open={showRoleSwitchDialog} onOpenChange={setShowRoleSwitchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>切换身份</DialogTitle>
          </DialogHeader>
          <View className="space-y-3 mt-4">
            <View
              className={`p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer ${
                userInfo?.role === UserRole.STUDENT ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
              }`}
              onClick={handleSwitchRole}
            >
              <GraduationCap
                size={32}
                color={userInfo?.role === UserRole.STUDENT ? '#FF6B35' : '#9CA3AF'}
              />
              <Text
                className={`block text-sm font-medium mt-2 ${
                  userInfo?.role === UserRole.STUDENT ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                学员身份
              </Text>
            </View>

            <View
              className={`p-4 rounded-xl border-2 flex flex-col items-center cursor-pointer ${
                userInfo?.role === UserRole.INSTRUCTOR ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'
              }`}
              onClick={handleSwitchRole}
            >
              <User
                size={32}
                color={userInfo?.role === UserRole.INSTRUCTOR ? '#FF6B35' : '#9CA3AF'}
              />
              <Text
                className={`block text-sm font-medium mt-2 ${
                  userInfo?.role === UserRole.INSTRUCTOR ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                讲师身份
              </Text>
              {instructorInfo?.status !== 'verified' && (
                <Text className="block text-xs text-red-500 mt-1">未认证</Text>
              )}
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default ProfilePage;
