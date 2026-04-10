import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Play, Users, Calendar } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface Live {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'live' | 'replay' | 'cancelled' | 'draft';
  platforms: string[];
  viewers?: number;
  conversion?: number;
}

const InstructorLivePage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLives();
  }, [activeTab]);

  const loadLives = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockLives: Live[] = [
        {
          id: 1,
          title: '如何快速掌握Excel高级技巧',
          cover: 'https://picsum.photos/seed/live1/400/200',
          teacher: '张老师',
          teacherAvatar: 'https://picsum.photos/seed/t1/100/100',
          startTime: '2024-04-10 19:00',
          endTime: '2024-04-10 21:00',
          status: 'live',
          platforms: ['douyin', 'wechat'],
          viewers: 1258,
          conversion: 45,
        },
        {
          id: 2,
          title: 'Python数据分析入门',
          cover: 'https://picsum.photos/seed/live2/400/200',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/t2/100/100',
          startTime: '2024-04-11 20:00',
          status: 'upcoming',
          platforms: ['douyin'],
          viewers: 0,
          conversion: 0,
        },
        {
          id: 3,
          title: '营销实战分享会',
          cover: 'https://picsum.photos/seed/live3/400/200',
          teacher: '王老师',
          teacherAvatar: 'https://picsum.photos/seed/t3/100/100',
          startTime: '2024-04-09 15:00',
          endTime: '2024-04-09 17:00',
          status: 'replay',
          platforms: ['wechat'],
          viewers: 856,
          conversion: 32,
        },
      ];

      // 根据标签筛选
      const filteredLives =
        activeTab === 'all'
          ? mockLives
          : mockLives.filter((live) => live.status === activeTab);

      setLives(filteredLives);
    } catch (error) {
      console.error('加载直播列表失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartLive = (liveId: number) => {
    Taro.navigateTo({
      url: `/pages/instructor/live/dashboard/index?id=${liveId}`,
    });
  };

  const handleViewDetail = () => {
    Taro.showToast({
      title: '请前往PC端查看详情',
      icon: 'none',
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      upcoming: { label: '预约中', color: 'bg-amber-500' },
      live: { label: '直播中', color: 'bg-red-500' },
      replay: { label: '已结束', color: 'bg-gray-500' },
      cancelled: { label: '已取消', color: 'bg-gray-400' },
      draft: { label: '草稿', color: 'bg-blue-500' },
    };
    return config[status] || { label: '', color: 'bg-gray-500' };
  };

  const getPlatformIcons = (platforms: string[]) => {
    return platforms.join('、').replace('douyin', '抖音').replace('wechat', '视频号');
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'upcoming', label: '预约中' },
    { key: 'live', label: '直播中' },
    { key: 'replay', label: '已结束' },
  ];

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center">
          <View onClick={() => Taro.navigateBack()}>
            <Calendar size={24} color="#374151" />
          </View>
          <Text className="block text-lg font-semibold text-gray-800 ml-4">我的直播</Text>
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
        {loading ? (
          <View className="grid grid-cols-1 gap-4">
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
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无直播</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {lives.map((live) => {
              const badge = getStatusBadge(live.status);
              return (
                <Card key={live.id} className="overflow-hidden">
                  <View className="relative">
                    <Image
                      className="w-full h-48"
                      src={live.cover}
                      mode="aspectFill"
                    />
                    <View className={`absolute top-3 left-3 px-2 py-1 rounded ${badge.color}`}>
                      <View className="flex flex-row items-center gap-1">
                        {live.status === 'live' && (
                          <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                        <Text className="text-white text-xs font-medium">{badge.label}</Text>
                      </View>
                    </View>
                    {live.status === 'live' && (
                      <View className="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-50 rounded">
                        <View className="flex flex-row items-center gap-1">
                          <Users size={12} color="#FFFFFF" />
                          <Text className="text-white text-xs">{live.viewers}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <CardContent className="p-4">
                    <Text className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                      {live.title}
                    </Text>
                    <View className="flex flex-row items-center mb-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={live.teacherAvatar} />
                      </Avatar>
                      <Text className="text-xs text-gray-500 ml-2">{live.teacher}</Text>
                      <Text className="text-xs text-gray-400 ml-auto">
                        {live.startTime}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="text-xs text-gray-500">
                        {getPlatformIcons(live.platforms)}
                      </Text>
                      {live.status === 'replay' && (
                        <Text className="text-xs text-orange-500">
                          转化 {live.conversion} 人
                        </Text>
                      )}
                    </View>
                    <View className="flex flex-row gap-2">
                      {live.status === 'live' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-red-500 text-white"
                          onClick={() => handleStartLive(live.id)}
                        >
                          <Play size={14} color="#FFFFFF" />
                          <Text className="ml-1">进入中控台</Text>
                        </Button>
                      )}
                      {live.status !== 'live' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetail()}
                        >
                          查看详情
                        </Button>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}

        {/* 创建直播提示 */}
        {activeTab === 'all' && !loading && (
          <View className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <Text className="text-sm text-orange-800">
              创建新直播请在PC端操作，点击右上角&ldquo;前往PC端&rdquo;按钮
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InstructorLivePage;
