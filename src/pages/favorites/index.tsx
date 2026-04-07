import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Heart } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import './index.css';

interface Favorite {
  id: number;
  courseId: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  price: number;
  originalPrice: number;
  rating: number;
  students: number;
  type: 'video' | 'audio' | 'text' | 'live';
  hasDiscount: boolean;
  discountPrice?: number;
  collectedAt: string;
}

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([
    {
      id: 1,
      courseId: 1,
      title: '短视频剪辑实战课：从入门到精通',
      cover: 'https://picsum.photos/seed/fav1/400/300',
      teacher: '张老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
      price: 299,
      originalPrice: 599,
      rating: 4.8,
      students: 1234,
      type: 'video',
      hasDiscount: true,
      discountPrice: 299,
      collectedAt: '2024-01-15',
    },
    {
      id: 2,
      courseId: 2,
      title: '职场沟通技巧提升训练营',
      cover: 'https://picsum.photos/seed/fav2/400/300',
      teacher: '李老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
      price: 199,
      originalPrice: 399,
      rating: 4.9,
      students: 856,
      type: 'video',
      hasDiscount: false,
      collectedAt: '2024-01-14',
    },
    {
      id: 3,
      courseId: 3,
      title: 'Python数据分析入门到实战',
      cover: 'https://picsum.photos/seed/fav3/400/300',
      teacher: '王老师',
      teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
      price: 399,
      originalPrice: 799,
      rating: 4.7,
      students: 2341,
      type: 'video',
      hasDiscount: true,
      discountPrice: 399,
      collectedAt: '2024-01-12',
    },
  ]);

  const handleCourseClick = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const handleRemove = (id: number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要取消收藏吗？',
      success: (res) => {
        if (res.confirm) {
          setFavorites((prev) => prev.filter((f) => f.id !== id));
          Taro.showToast({ title: '已取消收藏', icon: 'success' });
        }
      },
    });
  };

  const getCourseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: '视频课',
      audio: '音频课',
      text: '图文课',
      live: '直播课',
    };
    return labels[type] || '课程';
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <ScrollView scrollY className="flex-1 px-4 py-4">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="block text-sm text-gray-500">共 {favorites.length} 个收藏</Text>
        </View>

        {favorites.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Heart size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无收藏</Text>
            <Button className="mt-4 bg-orange-500 text-white" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
              去逛逛
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {favorites.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row" onClick={() => handleCourseClick(item.courseId)}>
                    <View className="relative">
                      <Avatar className="w-24 h-24 rounded-lg overflow-hidden">
                        <AvatarImage src={item.cover} />
                      </Avatar>
                      <View className="absolute top-1 left-1">
                        <Badge variant="secondary" className="bg-orange-500 text-white text-xs px-1 py-0">
                          {getCourseTypeLabel(item.type)}
                        </Badge>
                      </View>
                    </View>

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
                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-baseline">
                          <Text className="block text-base font-bold text-orange-500">
                            ¥{item.discountPrice || item.price}
                          </Text>
                          {item.originalPrice > item.price && (
                            <Text className="block text-xs text-gray-400 line-through ml-1">
                              ¥{item.originalPrice}
                            </Text>
                          )}
                        </View>
                        <Text className="block text-xs text-gray-400">{item.students}人学习</Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <Text className="block text-xs text-gray-400">
                      收藏于 {item.collectedAt}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-200 text-gray-500"
                      onClick={() => handleRemove(item.id)}
                    >
                      取消收藏
                    </Button>
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

export default FavoritesPage;
