import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Bell, Trash2 } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import './index.css';

interface Notification {
  id: number;
  type: 'system' | 'course' | 'order' | 'activity';
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  icon: string;
}

const MessagesPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'system',
      title: '系统通知',
      content: '恭喜您获得新人优惠券一张，满199减50，快去使用吧！',
      createdAt: '2024-01-18 10:00',
      isRead: false,
      icon: '🎁',
    },
    {
      id: 2,
      type: 'course',
      title: '课程更新提醒',
      content: '您关注的《短视频剪辑实战课》已更新第5章，快去学习吧！',
      createdAt: '2024-01-17 15:30',
      isRead: false,
      icon: '📚',
    },
    {
      id: 3,
      type: 'order',
      title: '订单提醒',
      content: '您购买的课程《职场沟通技巧提升训练营》已开课，记得按时学习哦～',
      createdAt: '2024-01-16 09:00',
      isRead: true,
      icon: '📦',
    },
    {
      id: 4,
      type: 'activity',
      title: '活动通知',
      content: '新年特惠！全场课程8折起，限时3天，立即抢购！',
      createdAt: '2024-01-15 12:00',
      isRead: true,
      icon: '🔥',
    },
  ]);

  const getIcon = (_type: string, icon: string) => {
    return icon;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      system: 'bg-purple-100',
      course: 'bg-blue-100',
      order: 'bg-green-100',
      activity: 'bg-orange-100',
    };
    return colors[type] || 'bg-gray-100';
  };

  const handleClick = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
    Taro.showToast({ title: notification.title, icon: 'none' });
  };

  const handleDelete = (id: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这条消息吗？',
      success: (res) => {
        if (res.confirm) {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    Taro.showToast({ title: '已全部标为已读', icon: 'success' });
  };

  const handleClearAll = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要清空所有消息吗？',
      success: (res) => {
        if (res.confirm) {
          setNotifications([]);
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      },
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayNotifications =
    activeTab === 'all' ? notifications : notifications.filter((n) => !n.isRead);

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <View className="bg-white sticky top-0 z-10">
        <View className="flex flex-row">
          <View
            className={`flex-1 py-3 text-center ${activeTab === 'all' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            <Text className={`text-base font-medium ${activeTab === 'all' ? 'text-orange-500' : 'text-gray-500'}`}>
              全部消息
            </Text>
          </View>
          <View
            className={`flex-1 py-3 text-center relative ${activeTab === 'unread' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('unread')}
          >
            <Text className={`text-base font-medium ${activeTab === 'unread' ? 'text-orange-500' : 'text-gray-500'}`}>
              未读消息 {unreadCount > 0 && `(${unreadCount})`}
            </Text>
          </View>
        </View>
      </View>

      {notifications.length > 0 && (
        <View className="bg-white px-4 py-2 flex flex-row justify-end gap-4">
          <View onClick={handleReadAll}>
            <Text className="block text-sm text-orange-500">全部标为已读</Text>
          </View>
          <View onClick={handleClearAll}>
            <Text className="block text-sm text-gray-500">清空</Text>
          </View>
        </View>
      )}

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {displayNotifications.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Bell size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">
              {activeTab === 'unread' ? '暂无未读消息' : '暂无消息'}
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {displayNotifications.map((notification) => (
              <Card key={notification.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row">
                    <View className={`w-10 h-10 rounded-full ${getTypeColor(notification.type)} flex items-center justify-center`}>
                      <Text className="text-xl">{getIcon(notification.type, notification.icon)}</Text>
                    </View>

                    <View className="flex-1 ml-3">
                      <View className="flex flex-row items-center justify-between mb-1">
                        <Text className="block text-sm font-medium text-gray-800">
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <View className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </View>
                      <Text className="block text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.content}
                      </Text>
                      <View className="flex flex-row items-center justify-between">
                        <Text className="block text-xs text-gray-400">
                          {notification.createdAt}
                        </Text>
                        <View onClick={() => handleDelete(notification.id)}>
                          <Trash2 size={14} color="#9CA3AF" />
                        </View>
                      </View>
                    </View>
                  </View>

                  <View
                    className="mt-3 pt-3 border-t border-gray-100"
                    onClick={() => handleClick(notification)}
                  >
                    <Text className="block text-sm text-orange-500">查看详情</Text>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
