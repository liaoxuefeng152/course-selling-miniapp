import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Play, Users, Clock, Radio } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

// 直播类型定义
interface Live {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'replay';
  viewers: number;
  courseName?: string;
  price?: number;
}

const LivePage = () => {
  const [activeTab, setActiveTab] = useState('live');
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockLives: Live[] = [
        {
          id: 1,
          title: '抖音直播带货实战分享',
          cover: 'https://picsum.photos/seed/live1/400/300',
          teacher: '刘老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher1/100/100',
          startTime: '今晚 20:00',
          status: 'upcoming',
          viewers: 0,
          courseName: '抖音带货必修课',
          price: 199,
        },
        {
          id: 2,
          title: '2024年考研备考规划指导',
          cover: 'https://picsum.photos/seed/live2/400/300',
          teacher: '周老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher2/100/100',
          startTime: '正在直播',
          status: 'live',
          viewers: 2341,
          courseName: '考研英语全程班',
          price: 999,
        },
        {
          id: 3,
          title: '电商创业从0到1实战课',
          cover: 'https://picsum.photos/seed/live3/400/300',
          teacher: '孙老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher3/100/100',
          startTime: '明天 14:00',
          status: 'upcoming',
          viewers: 0,
          courseName: '电商创业指南',
          price: 299,
        },
        {
          id: 4,
          title: '职场沟通技巧提升训练营',
          cover: 'https://picsum.photos/seed/live4/400/300',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher4/100/100',
          startTime: '2024-01-15 20:00',
          status: 'replay',
          viewers: 5678,
          courseName: '职场沟通课',
          price: 199,
        },
        {
          id: 5,
          title: '短视频剪辑实战分享',
          cover: 'https://picsum.photos/seed/live5/400/300',
          teacher: '张老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher5/100/100',
          startTime: '2024-01-10 19:00',
          status: 'replay',
          viewers: 8902,
          courseName: 'Pr剪辑教程',
          price: 399,
        },
      ];

      // 根据 tab 过滤
      const filtered = mockLives.filter((live) => {
        if (activeTab === 'live') return live.status === 'live';
        if (activeTab === 'upcoming') return live.status === 'upcoming';
        if (activeTab === 'replay') return live.status === 'replay';
        return true;
      });

      setLives(filtered);
    } catch (error) {
      console.error('获取直播数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveClick = (liveId: number) => {
    Taro.navigateTo({
      url: `/pages/live-detail/index?id=${liveId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      live: { label: '直播中', color: 'bg-red-500' },
      upcoming: { label: '预约', color: 'bg-amber-500' },
      replay: { label: '回放', color: 'bg-gray-500' },
    };
    return config[status] || { label: '', color: 'bg-gray-500' };
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部标题 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center mb-4">
          <Radio size={24} color="#FF6B35" />
          <Text className="block text-xl font-bold text-gray-800 ml-2">直播课堂</Text>
        </View>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="live" className="flex-1">正在直播</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">直播预约</TabsTrigger>
            <TabsTrigger value="replay" className="flex-1">直播回放</TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 直播列表 */}
      <ScrollView scrollY className="flex-1 px-4 py-4">
        {loading ? (
          <View className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <View key={i} className="bg-white rounded-xl overflow-hidden">
                <View className="h-48 bg-gray-200 animate-pulse" />
                <View className="p-4">
                  <View className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <View className="h-3 bg-gray-200 rounded w-1/2" />
                </View>
              </View>
            ))}
          </View>
        ) : lives.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Image
              className="w-32 h-32 mb-4 opacity-50"
              src="https://picsum.photos/seed/empty/200/200"
              mode="aspectFit"
            />
            <Text className="block text-gray-400 text-base">暂无直播</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {lives.map((live) => {
              const badge = getStatusBadge(live.status);
              return (
                <View key={live.id} onClick={() => handleLiveClick(live.id)}>
                  <Card className="overflow-hidden">
                    <View className="relative">
                      <Image
                        className="w-full h-48"
                        src={live.cover}
                        mode="aspectFill"
                      />
                      {/* 状态标签 */}
                      <View className={`absolute top-3 left-3 px-2 py-1 rounded ${badge.color}`}>
                        <View className="flex flex-row items-center gap-1">
                          {live.status === 'live' && (
                            <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                          <Text className="text-white text-xs font-medium">{badge.label}</Text>
                        </View>
                      </View>
                      {/* 人数 */}
                      {live.status === 'live' && (
                        <View className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-50 rounded">
                          <View className="flex flex-row items-center gap-1">
                            <Users size={12} color="#FFFFFF" />
                            <Text className="text-white text-xs">{live.viewers}</Text>
                          </View>
                        </View>
                      )}
                      {/* 播放按钮（回放） */}
                      {live.status === 'replay' && (
                        <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <View className="w-14 h-14 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <Play size={28} color="#FF6B35" className="ml-1" />
                          </View>
                        </View>
                      )}
                    </View>
                    <CardContent className="p-4">
                      <Text className="block text-base font-semibold text-gray-800 mb-2">
                        {live.title}
                      </Text>
                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={live.teacherAvatar} />
                          </Avatar>
                          <Text className="block text-sm text-gray-600 ml-2">{live.teacher}</Text>
                        </View>
                        <View className="flex flex-row items-center">
                          <Clock size={14} color="#9CA3AF" />
                          <Text className="block text-sm text-gray-500 ml-1">{live.startTime}</Text>
                        </View>
                      </View>
                      {live.courseName && (
                        <View className="mt-3 pt-3 border-t border-gray-100 flex flex-row items-center justify-between">
                          <Text className="block text-sm text-gray-500">关联课程: {live.courseName}</Text>
                          {live.price && (
                            <Text className="block text-sm text-orange-500 font-medium">
                              ¥{live.price}
                            </Text>
                          )}
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LivePage;
