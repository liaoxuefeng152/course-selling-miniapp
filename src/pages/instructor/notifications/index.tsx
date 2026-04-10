import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, Bell, ShoppingCart, MessageSquare, Calendar, Check } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: number;
  type: 'order' | 'message' | 'live' | 'system';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'order',
      title: '新订单提醒',
      content: '学员张三购买了《Python数据分析入门》课程',
      time: '10分钟前',
      read: false,
    },
    {
      id: 2,
      type: 'message',
      title: '学员提问',
      content: '学员李四在《Excel高级技巧》课程中提问：如何使用数据透视表？',
      time: '30分钟前',
      read: false,
    },
    {
      id: 3,
      type: 'live',
      title: '直播预约提醒',
      content: '您创建的直播《营销实战分享会》将于明天15:00开始',
      time: '1小时前',
      read: false,
    },
    {
      id: 4,
      type: 'order',
      title: '订单退款申请',
      content: '学员王五申请退款《Java基础教程》课程，请前往PC端处理',
      time: '2小时前',
      read: true,
    },
    {
      id: 5,
      type: 'system',
      title: '系统通知',
      content: '您的认证申请已通过审核，现在可以创建课程和开展直播了',
      time: '昨天',
      read: true,
    },
    {
      id: 6,
      type: 'live',
      title: '直播已结束',
      content: '您的直播《Excel高级技巧》已结束，本次观看人数1258人',
      time: '昨天',
      read: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={20} color="#FF6B35" />;
      case 'message':
        return <MessageSquare size={20} color="#3B82F6" />;
      case 'live':
        return <Calendar size={20} color="#10B981" />;
      default:
        return <Bell size={20} color="#9CA3AF" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      order: '订单',
      message: '消息',
      live: '直播',
      system: '系统',
    };
    return labels[type] || '其他';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      order: 'bg-orange-500',
      message: 'bg-blue-500',
      live: 'bg-green-500',
      system: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // 根据类型跳转到对应页面
    switch (notification.type) {
      case 'message':
        Taro.showToast({ title: '请前往PC端回复学员问题', icon: 'none' });
        break;
      case 'live':
        Taro.showToast({ title: '直播详情请在PC端查看', icon: 'none' });
        break;
      case 'order':
        Taro.showToast({ title: '订单详情请在PC端查看', icon: 'none' });
        break;
      default:
        break;
    }
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'unread', label: '未读' },
    { key: 'order', label: '订单' },
    { key: 'message', label: '消息' },
  ];

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View onClick={() => Taro.navigateBack()}>
              <ArrowLeft size={24} color="#374151" />
            </View>
            <Text className="block text-lg font-semibold text-gray-800 ml-4">消息通知</Text>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white border-0">{unreadCount}</Badge>
            )}
          </View>
          <Text
            className="text-sm text-orange-500"
            onClick={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
              Taro.showToast({ title: '已全部标记为已读', icon: 'success' });
            }}
          >
            全部已读
          </Text>
        </View>
      </View>

      {/* 标签切换 */}
      <View className="bg-white px-4 py-3 flex flex-row items-center">
        {tabs.map((tab) => (
          <View
            key={tab.key}
            className={`mr-4 pb-2 ${
              activeTab === tab.key
                ? 'border-b-2 border-orange-500'
                : 'border-b-2 border-transparent'
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text
              className={`text-sm ${
                activeTab === tab.key ? 'text-orange-500 font-semibold' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {filteredNotifications.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Bell size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无通知</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer ${!notification.read ? 'border-l-4 border-l-orange-500' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <View className="flex flex-row">
                    <View className="flex-shrink-0 mr-3 mt-1">
                      {getIcon(notification.type)}
                    </View>
                    <View className="flex-1">
                      <View className="flex flex-row items-center justify-between mb-2">
                        <View className="flex flex-row items-center">
                          <Text className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </Text>
                          <Badge
                            className={`ml-2 ${getTypeColor(notification.type)} text-white text-xs border-0`}
                          >
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </View>
                        {!notification.read && (
                          <View className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </View>
                      <Text className="text-sm text-gray-600 mb-2 leading-relaxed">
                        {notification.content}
                      </Text>
                      <View className="flex flex-row items-center justify-between">
                        <Text className="text-xs text-gray-400">{notification.time}</Text>
                        {!notification.read && (
                          <View
                            className="flex flex-row items-center text-xs text-orange-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <Check size={12} color="#FF6B35" />
                            <Text className="ml-1">标记已读</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* 提示信息 */}
        {filteredNotifications.length > 0 && (
          <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Text className="text-sm text-blue-800">
              订单处理、学员回复等操作请在PC端完成
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsPage;
