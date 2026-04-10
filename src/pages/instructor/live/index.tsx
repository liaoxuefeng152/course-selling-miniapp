import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Plus, Trash2, Play, Users, Calendar, Pencil } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Network } from '@/network';

// 直播类型定义
interface Live {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'replay' | 'cancelled' | 'draft';
  platforms: string[];
  viewers: number;
  conversion: number;
  createdAt: string;
}

const InstructorLivePage = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusOptions = [
    { key: 'all', label: '全部' },
    { key: 'upcoming', label: '预约中' },
    { key: 'live', label: '直播中' },
    { key: 'replay', label: '已结束' },
    { key: 'draft', label: '草稿' },
  ];

  useEffect(() => {
    fetchLives();
  }, [statusFilter]);

  const fetchLives = async () => {
    setLoading(true);
    try {
      const res = await Network.request({
        url: '/api/live',
        method: 'GET',
        data: {
          status: statusFilter === 'all' ? undefined : statusFilter,
          keyword: searchValue || undefined,
        },
      });

      if (res.data?.code === 200) {
        setLives(res.data.data?.list || []);
      }
    } catch (error) {
      console.error('获取直播列表失败:', error);
      // 使用模拟数据
      const mockLives: Live[] = [
        {
          id: 1,
          title: '抖音直播带货实战分享',
          cover: 'https://picsum.photos/seed/live1/400/300',
          teacher: '张老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
          startTime: '2024-01-20 20:00',
          status: 'upcoming',
          platforms: ['douyin'],
          viewers: 0,
          conversion: 0,
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          title: '职场沟通技巧提升',
          cover: 'https://picsum.photos/seed/live2/400/300',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
          startTime: '2024-01-18 20:00',
          status: 'live',
          platforms: ['douyin', 'wechat'],
          viewers: 1234,
          conversion: 156,
          createdAt: '2024-01-10',
        },
        {
          id: 3,
          title: '短视频剪辑入门',
          cover: 'https://picsum.photos/seed/live3/400/300',
          teacher: '王老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
          startTime: '2024-01-10 20:00',
          status: 'replay',
          platforms: ['douyin'],
          viewers: 5678,
          conversion: 890,
          createdAt: '2024-01-05',
        },
      ];
      setLives(mockLives);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLive = () => {
    Taro.navigateTo({
      url: '/pages/instructor/live/edit/index',
    });
  };

  const handleEditLive = (liveId: number) => {
    Taro.navigateTo({
      url: `/pages/instructor/live/edit/index?id=${liveId}`,
    });
  };

  const handleDeleteLive = (liveId: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除此直播吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await Network.request({
              url: `/api/live/${liveId}`,
              method: 'DELETE',
            });

            Taro.showToast({
              title: '删除成功',
              icon: 'success',
            });

            fetchLives();
          } catch (error) {
            console.error('删除直播失败:', error);
            Taro.showToast({
              title: '删除失败',
              icon: 'none',
            });
          }
        }
      },
    });
  };

  const handleStartLive = (liveId: number) => {
    Taro.navigateTo({
      url: `/pages/instructor/live/dashboard/index?id=${liveId}`,
    });
  };

  const handleReplayManage = () => {
    Taro.showToast({
      title: '回放管理功能开发中',
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

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部操作栏 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-10">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-gray-800">直播管理</Text>
          <Button
            className="bg-orange-500 text-white"
            onClick={handleCreateLive}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="ml-1">创建直播</Text>
          </Button>
        </View>

        {/* 搜索框 */}
        <View className="mb-3">
          <Input
            className="w-full bg-gray-100"
            placeholder="搜索直播主题"
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
            onConfirm={fetchLives}
          />
        </View>

        {/* 状态筛选 */}
        <ScrollView scrollX className="flex-row gap-2">
          {statusOptions.map((option) => (
            <Badge
              key={option.key}
              variant={statusFilter === option.key ? 'default' : 'outline'}
              className={
                statusFilter === option.key
                  ? 'bg-orange-500 text-white px-4 py-1'
                  : 'px-4 py-1'
              }
              onClick={() => setStatusFilter(option.key)}
            >
              {option.label}
            </Badge>
          ))}
        </ScrollView>
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
                      {live.status === 'upcoming' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditLive(live.id)}
                        >
                          <Pencil size={14} color="#6B7280" />
                          <Text className="ml-1">编辑</Text>
                        </Button>
                      )}
                      {live.status === 'draft' && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditLive(live.id)}
                        >
                          <Pencil size={14} color="#6B7280" />
                          <Text className="ml-1">继续编辑</Text>
                        </Button>
                      )}
                      {live.status === 'replay' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleReplayManage()}
                        >
                          回放管理
                        </Button>
                      )}
                      {(live.status === 'upcoming' || live.status === 'draft') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-shrink-0"
                          onClick={() => handleDeleteLive(live.id)}
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </Button>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InstructorLivePage;
