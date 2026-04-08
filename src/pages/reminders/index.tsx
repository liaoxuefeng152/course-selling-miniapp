import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Bell, Clock, Radio, Trash2 } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface Reminder {
  id: number;
  courseId: number;
  courseTitle: string;
  courseCover: string;
  teacher: string;
  type: 'live' | 'update' | 'deadline';
  title: string;
  time: string;
  enabled: boolean;
  repeat: 'once' | 'daily' | 'weekly';
}

const RemindersPage = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      courseId: 1,
      courseTitle: '短视频剪辑实战课：从入门到精通',
      courseCover: 'https://picsum.photos/seed/rem1/400/300',
      teacher: '张老师',
      type: 'live',
      title: '直播提醒',
      time: '今晚 20:00',
      enabled: true,
      repeat: 'once',
    },
    {
      id: 2,
      courseId: 2,
      courseTitle: '职场沟通技巧提升训练营',
      courseCover: 'https://picsum.photos/seed/rem2/400/300',
      teacher: '李老师',
      type: 'update',
      title: '课程更新',
      time: '每周三 10:00',
      enabled: true,
      repeat: 'weekly',
    },
    {
      id: 3,
      courseId: 3,
      courseTitle: 'Python数据分析入门到实战',
      courseCover: 'https://picsum.photos/seed/rem3/400/300',
      teacher: '王老师',
      type: 'deadline',
      title: '作业截止',
      time: '2024-01-25 23:59',
      enabled: false,
      repeat: 'once',
    },
  ]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      live: '直播提醒',
      update: '课程更新',
      deadline: '截止提醒',
    };
    return labels[type] || '提醒';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      live: 'bg-red-500',
      update: 'bg-blue-500',
      deadline: 'bg-orange-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getRepeatLabel = (repeat: string) => {
    const labels: Record<string, string> = {
      once: '仅一次',
      daily: '每天',
      weekly: '每周',
    };
    return labels[repeat] || '';
  };

  const handleToggle = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDelete = (id: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这个提醒吗？',
      success: (res) => {
        if (res.confirm) {
          setReminders((prev) => prev.filter((r) => r.id !== id));
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const handleCourseClick = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const enabledCount = reminders.filter((r) => r.enabled).length;

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <View className="bg-white px-4 py-3 flex flex-row items-center justify-between">
        <View>
          <Text className="block text-base font-medium text-gray-800">课程提醒</Text>
          <Text className="block text-sm text-gray-500">
            已开启 {enabledCount}/{reminders.length} 个提醒
          </Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {reminders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Bell size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无提醒设置</Text>
            <Text className="block text-sm text-gray-400 mt-2">
              在课程详情页可以设置开播提醒
            </Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {reminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row">
                    <Avatar
                      className="w-16 h-16 rounded-lg overflow-hidden"
                      onClick={() => handleCourseClick(reminder.courseId)}
                    >
                      <AvatarImage src={reminder.courseCover} />
                    </Avatar>

                    <View className="flex-1 ml-3">
                      <View className="flex flex-row items-center justify-between mb-1">
                        <View className="flex flex-row items-center">
                          <View className={`px-2 py-1 ${getTypeColor(reminder.type)} rounded text-xs text-white mr-2`}>
                            {getTypeLabel(reminder.type)}
                          </View>
                          {reminder.repeat !== 'once' && (
                            <Text className="block text-xs text-gray-500">
                              {getRepeatLabel(reminder.repeat)}
                            </Text>
                          )}
                        </View>
                        <Switch
                          checked={reminder.enabled}
                          onCheckedChange={() => handleToggle(reminder.id)}
                        />
                      </View>

                      <Text className="block text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                        {reminder.courseTitle}
                      </Text>

                      <View className="flex flex-row items-center mb-1">
                        <Clock size={12} color="#9CA3AF" />
                        <Text className="block text-xs text-gray-500 ml-1">
                          讲师: {reminder.teacher}
                        </Text>
                      </View>

                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center">
                          {reminder.type === 'live' && <Radio size={12} color="#EF4444" />}
                          {reminder.type === 'live' && (
                            <Text className="block text-xs text-red-500 ml-1">{reminder.time}</Text>
                          )}
                          {reminder.type !== 'live' && (
                            <Text className="block text-xs text-gray-400">{reminder.time}</Text>
                          )}
                        </View>
                        <View onClick={() => handleDelete(reminder.id)}>
                          <Trash2 size={14} color="#9CA3AF" />
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        <View className="mt-6 p-4 bg-gray-100 rounded-xl">
          <Text className="block text-sm text-gray-600">
            提示：开启提醒后，系统会在课程开播前或更新时发送通知给您。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default RemindersPage;
