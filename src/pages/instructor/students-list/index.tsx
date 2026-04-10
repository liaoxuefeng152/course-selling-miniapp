import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, Users, Calendar, ShoppingCart } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface Student {
  id: number;
  nickname: string;
  avatar: string;
  phone: string;
  joinDate: string;
  orderCount: number;
  totalSpent: number;
  lastActive: string;
}

const InstructorStudentsListPage = () => {
  const [students] = useState<Student[]>([
    {
      id: 1,
      nickname: '学员张三',
      avatar: 'https://picsum.photos/seed/s1/100/100',
      phone: '138****1234',
      joinDate: '2024-03-15',
      orderCount: 3,
      totalSpent: 597,
      lastActive: '2小时前',
    },
    {
      id: 2,
      nickname: '学员李四',
      avatar: 'https://picsum.photos/seed/s2/100/100',
      phone: '139****5678',
      joinDate: '2024-03-20',
      orderCount: 1,
      totalSpent: 199,
      lastActive: '1天前',
    },
    {
      id: 3,
      nickname: '学员王五',
      avatar: 'https://picsum.photos/seed/s3/100/100',
      phone: '137****9012',
      joinDate: '2024-04-01',
      orderCount: 2,
      totalSpent: 448,
      lastActive: '3天前',
    },
    {
      id: 4,
      nickname: '学员赵六',
      avatar: 'https://picsum.photos/seed/s4/100/100',
      phone: '136****3456',
      joinDate: '2024-04-05',
      orderCount: 1,
      totalSpent: 149,
      lastActive: '5天前',
    },
    {
      id: 5,
      nickname: '学员钱七',
      avatar: 'https://picsum.photos/seed/s5/100/100',
      phone: '135****7890',
      joinDate: '2024-04-08',
      orderCount: 2,
      totalSpent: 398,
      lastActive: '刚刚',
    },
  ]);

  const handleStudentClick = () => {
    Taro.showActionSheet({
      itemList: ['查看详情（前往PC端）', '查看学习记录（前往PC端）'],
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

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View onClick={() => Taro.navigateBack()}>
              <ArrowLeft size={24} color="#374151" />
            </View>
            <Text className="block text-lg font-semibold text-gray-800 ml-4">学员列表</Text>
          </View>
          <Text className="text-sm text-gray-500">共 {students.length} 人</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {students.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Users size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无学员</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-3">
            {students.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer"
                onClick={() => handleStudentClick()}
              >
                <CardContent className="p-4">
                  <View className="flex flex-row items-start">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={student.avatar} />
                    </Avatar>
                    <View className="flex-1 ml-3">
                      <View className="flex flex-row items-center justify-between mb-2">
                        <Text className="text-base font-semibold text-gray-800">
                          {student.nickname}
                        </Text>
                      </View>
                      <Text className="text-sm text-gray-500 mb-2">{student.phone}</Text>
                      <View className="flex flex-row items-center gap-4">
                        <View className="flex flex-row items-center text-xs text-gray-500">
                          <Calendar size={12} color="#9CA3AF" />
                          <Text className="ml-1">加入: {student.joinDate}</Text>
                        </View>
                        <View className="flex flex-row items-center text-xs text-gray-500">
                          <ShoppingCart size={12} color="#9CA3AF" />
                          <Text className="ml-1">订单: {student.orderCount}</Text>
                        </View>
                      </View>
                      <View className="mt-2 pt-2 border-t border-gray-100 flex flex-row items-center justify-between">
                        <Text className="text-xs text-gray-500">累计消费</Text>
                        <Text className="text-sm font-semibold text-orange-500">
                          ¥{student.totalSpent}
                        </Text>
                      </View>
                      <View className="mt-1 flex flex-row items-center justify-between">
                        <Text className="text-xs text-gray-500">最后活跃</Text>
                        <Text className="text-xs text-gray-400">{student.lastActive}</Text>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        {/* 提示信息 */}
        {students.length > 0 && (
          <View className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <Text className="text-sm text-orange-800">
              学员详细信息、学习记录、标签管理等功能请在PC端完成
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InstructorStudentsListPage;
