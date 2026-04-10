import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, ShoppingCart, Calendar } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  orderNo: string;
  studentName: string;
  studentAvatar: string;
  courseName: string;
  courseCover: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded' | 'cancelled';
  createdAt: string;
}

const InstructorOrdersListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders] = useState<Order[]>([
    {
      id: 1,
      orderNo: '202404100001',
      studentName: '学员张三',
      studentAvatar: 'https://picsum.photos/seed/s1/100/100',
      courseName: 'Python数据分析入门',
      courseCover: 'https://picsum.photos/seed/course1/100/100',
      amount: 199,
      status: 'paid',
      createdAt: '2024-04-10 10:30:00',
    },
    {
      id: 2,
      orderNo: '202404100002',
      studentName: '学员李四',
      studentAvatar: 'https://picsum.photos/seed/s2/100/100',
      courseName: 'Excel高级技巧实战',
      courseCover: 'https://picsum.photos/seed/course2/100/100',
      amount: 149,
      status: 'paid',
      createdAt: '2024-04-10 11:45:00',
    },
    {
      id: 3,
      orderNo: '202404090001',
      studentName: '学员王五',
      studentAvatar: 'https://picsum.photos/seed/s3/100/100',
      courseName: 'Java基础教程',
      courseCover: 'https://picsum.photos/seed/course3/100/100',
      amount: 299,
      status: 'refunded',
      createdAt: '2024-04-09 16:20:00',
    },
    {
      id: 4,
      orderNo: '202404080001',
      studentName: '学员赵六',
      studentAvatar: 'https://picsum.photos/seed/s4/100/100',
      courseName: '营销策略分享',
      courseCover: 'https://picsum.photos/seed/course4/100/100',
      amount: 99,
      status: 'pending',
      createdAt: '2024-04-08 14:15:00',
    },
    {
      id: 5,
      orderNo: '202404070001',
      studentName: '学员钱七',
      studentAvatar: 'https://picsum.photos/seed/s5/100/100',
      courseName: '职场沟通技巧',
      courseCover: 'https://picsum.photos/seed/course5/100/100',
      amount: 129,
      status: 'cancelled',
      createdAt: '2024-04-07 09:30:00',
    },
  ]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      paid: { label: '已支付', color: 'bg-green-500' },
      pending: { label: '待支付', color: 'bg-amber-500' },
      refunded: { label: '已退款', color: 'bg-red-500' },
      cancelled: { label: '已取消', color: 'bg-gray-500' },
    };
    return config[status] || { label: '', color: 'bg-gray-500' };
  };

  const handleOrderClick = () => {
    Taro.showActionSheet({
      itemList: ['查看详情（前往PC端）', '查看退款记录（前往PC端）'],
      success: (res) => {
        if (res.tapIndex === 0 || res.tapIndex === 1) {
          Taro.showToast({
            title: '请前往PC端查看',
            icon: 'none',
          });
        }
      },
    });
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'paid', label: '已支付' },
    { key: 'pending', label: '待支付' },
    { key: 'refunded', label: '已退款' },
  ];

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View onClick={() => Taro.navigateBack()}>
              <ArrowLeft size={24} color="#374151" />
            </View>
            <Text className="block text-lg font-semibold text-gray-800 ml-4">订单列表</Text>
          </View>
          <Text className="text-sm text-gray-500">共 {orders.length} 笔</Text>
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
        {filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <ShoppingCart size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无订单</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {filteredOrders.map((order) => {
              const status = getStatusBadge(order.status);
              return (
                <Card
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => handleOrderClick()}
                >
                  <CardContent className="p-4">
                    {/* 订单头部 */}
                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="text-xs text-gray-500">订单号: {order.orderNo}</Text>
                      <Badge className={`${status.color} text-white text-xs border-0`}>
                        {status.label}
                      </Badge>
                    </View>

                    {/* 课程信息 */}
                    <View className="flex flex-row items-start mb-3">
                      <View className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <Image
                          src={order.courseCover}
                          mode="aspectFill"
                          className="w-full h-full"
                        />
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="text-sm font-medium text-gray-800 line-clamp-2">
                          {order.courseName}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          购买人: {order.studentName}
                        </Text>
                      </View>
                    </View>

                    {/* 订单底部 */}
                    <View className="flex flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex flex-row items-center text-xs text-gray-500">
                        <Calendar size={12} color="#9CA3AF" />
                        <Text className="ml-1">{order.createdAt}</Text>
                      </View>
                      <Text className="text-base font-bold text-orange-500">
                        ¥{order.amount}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}

        {/* 提示信息 */}
        {filteredOrders.length > 0 && (
          <View className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <Text className="text-sm text-orange-800">
              订单详情、退款处理等功能请在PC端完成
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InstructorOrdersListPage;
