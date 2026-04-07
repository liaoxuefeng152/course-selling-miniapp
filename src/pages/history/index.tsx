import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Clock, Trash2 } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import './index.css';

interface History {
  id: number;
  courseId: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  progress: number;
  lastLesson: string;
  watchedAt: string;
  duration: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<History[]>([
    {
      id: 1,
      courseId: 1,
      title: '短视频剪辑实战课：从入门到精通',
      cover: 'https://picsum.photos/seed/hist1/400/300',
      teacher: '张老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
      progress: 65,
      lastLesson: '1.3 素材导入与整理',
      watchedAt: '2024-01-18 15:30',
      duration: '12:45',
    },
    {
      id: 2,
      courseId: 2,
      title: '职场沟通技巧提升训练营',
      cover: 'https://picsum.photos/seed/hist2/400/300',
      teacher: '李老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
      progress: 30,
      lastLesson: '2.1 沟通的本质',
      watchedAt: '2024-01-17 20:15',
      duration: '18:30',
    },
    {
      id: 3,
      courseId: 3,
      title: 'Python数据分析入门到实战',
      cover: 'https://picsum.photos/seed/hist3/400/300',
      teacher: '王老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
      progress: 100,
      lastLesson: '全部课时',
      watchedAt: '2024-01-16 10:00',
      duration: '1:30:00',
    },
  ]);

  const handleContinue = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const handleDelete = (id: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          setHistory((prev) => prev.filter((h) => h.id !== id));
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const handleClearAll = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要清空所有学习历史吗？',
      success: (res) => {
        if (res.confirm) {
          setHistory([]);
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      },
    });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {history.length > 0 && (
        <View className="bg-white px-4 py-3 flex flex-row justify-end">
          <View className="flex flex-row items-center" onClick={handleClearAll}>
            <Trash2 size={16} color="#EF4444" />
            <Text className="block text-sm text-red-500 ml-1">清空全部</Text>
          </View>
        </View>
      )}

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {history.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Clock size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无学习历史</Text>
            <Button className="mt-4 bg-orange-500 text-white" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
              去学习
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {history.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row mb-3">
                    <Avatar className="w-20 h-20 rounded-lg overflow-hidden">
                      <AvatarImage src={item.cover} />
                    </Avatar>

                    <View className="flex-1 ml-3">
                      <Text className="block text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {item.title}
                      </Text>
                      <View className="flex flex-row items-center mb-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={item.teacherAvatar} />
                        </Avatar>
                        <Text className="block text-xs text-gray-500 ml-1">{item.teacher}</Text>
                      </View>
                      <Text className="block text-xs text-gray-400">
                        最后学习: {item.lastLesson}
                      </Text>
                    </View>
                  </View>

                  <View className="mb-3">
                    <View className="flex flex-row justify-between mb-1">
                      <Text className="block text-xs text-gray-500">学习进度</Text>
                      <Text className="block text-xs text-orange-500">{item.progress}%</Text>
                    </View>
                    <Progress value={item.progress} className="h-2" />
                  </View>

                  <View className="flex flex-row items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex flex-row items-center">
                      <Clock size={14} color="#9CA3AF" />
                      <Text className="block text-xs text-gray-400 ml-1">
                        {item.watchedAt} · 观看{item.duration}
                      </Text>
                    </View>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-orange-500 text-white"
                      onClick={() => handleContinue(item.courseId)}
                    >
                      {item.progress === 100 ? '复习' : '继续'}
                    </Button>
                  </View>

                  <View className="flex flex-row justify-end mt-2">
                    <View onClick={() => handleDelete(item.id)}>
                      <Text className="block text-xs text-gray-400">删除记录</Text>
                    </View>
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

export default HistoryPage;
