import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import {
  ChevronRight,
  Bell,
  Lock,
  Info,
  Moon,
  Globe,
  FileText,
  LogOut,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import './index.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      icon: <Bell size={20} color="#6B7280" />,
      label: '消息通知',
      value: '开启',
      hasSwitch: true,
      switchKey: 'notifications' as const,
    },
    {
      icon: <FileText size={20} color="#6B7280" />,
      label: '用户协议',
      url: '/pages/agreement/index',
    },
    {
      icon: <Info size={20} color="#6B7280" />,
      label: '关于我们',
      url: '/pages/about/index',
    },
  ];

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出登录', icon: 'success' });
          // 实际应该清除登录状态并跳转
        }
      },
    });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <ScrollView scrollY className="flex-1 px-4 py-4">
        <Text className="block text-sm text-gray-500 mb-3">账号设置</Text>
        <Card className="mb-6">
          <CardContent className="p-0">
            <View className="flex flex-row items-center justify-between px-4 py-3">
              <View className="flex flex-row items-center">
                <Lock size={20} color="#6B7280" />
                <Text className="block text-sm text-gray-800 ml-3">修改密码</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
            <Separator />
            <View className="flex flex-row items-center justify-between px-4 py-3">
              <View className="flex flex-row items-center">
                <Globe size={20} color="#6B7280" />
                <Text className="block text-sm text-gray-800 ml-3">切换账号</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>

        <Text className="block text-sm text-gray-500 mb-3">偏好设置</Text>
        <Card className="mb-6">
          <CardContent className="p-0">
            <View className="flex flex-row items-center justify-between px-4 py-3">
              <View className="flex flex-row items-center">
                <Bell size={20} color="#6B7280" />
                <Text className="block text-sm text-gray-800 ml-3">消息推送</Text>
              </View>
              <Switch
                checked={settings.notifications}
                onCheckedChange={() => handleToggle('notifications')}
              />
            </View>
            <Separator />
            <View className="flex flex-row items-center justify-between px-4 py-3">
              <View className="flex flex-row items-center">
                <Moon size={20} color="#6B7280" />
                <Text className="block text-sm text-gray-800 ml-3">深色模式</Text>
              </View>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </View>
          </CardContent>
        </Card>

        <Text className="block text-sm text-gray-500 mb-3">其他</Text>
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <View key={index}>
                {item.hasSwitch ? (
                  <View className="flex flex-row items-center justify-between px-4 py-3">
                    <View className="flex flex-row items-center">
                      {item.icon}
                      <Text className="block text-sm text-gray-800 ml-3">{item.label}</Text>
                    </View>
                    <Switch
                      checked={settings[item.switchKey]}
                      onCheckedChange={() => handleToggle(item.switchKey)}
                    />
                  </View>
                ) : (
                  <View
                    className="flex flex-row items-center justify-between px-4 py-3"
                    onClick={() => item.url && Taro.navigateTo({ url: item.url })}
                  >
                    <View className="flex flex-row items-center">
                      {item.icon}
                      <Text className="block text-sm text-gray-800 ml-3">{item.label}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                )}
                {index < menuItems.length - 1 && <Separator />}
              </View>
            ))}
          </CardContent>
        </Card>

        <View className="mb-4">
          <View
            className="flex flex-row items-center justify-center py-3 bg-white rounded-xl"
            onClick={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="block text-base text-red-500 ml-2">退出登录</Text>
          </View>
        </View>

        <View className="flex flex-col items-center py-4">
          <Text className="block text-xs text-gray-400">在线课堂 v1.0.0</Text>
          <Text className="block text-xs text-gray-400 mt-1">让学习更简单</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsPage;
