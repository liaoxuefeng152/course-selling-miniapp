import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Star } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import './index.css';

interface Review {
  id: number;
  courseId: number;
  courseTitle: string;
  courseCover: string;
  rating: number;
  content: string;
  createdAt: string;
  replay?: string;
  replayAt?: string;
}

const ReviewsPage = () => {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      courseId: 1,
      courseTitle: '短视频剪辑实战课：从入门到精通',
      courseCover: 'https://picsum.photos/seed/rev1/400/300',
      rating: 5,
      content: '课程内容非常实用，老师讲得很清楚，已经学会了基础剪辑技巧，推荐！',
      createdAt: '2024-01-15',
      replay: '感谢您的认可，祝学习愉快！',
      replayAt: '2024-01-16',
    },
    {
      id: 2,
      courseId: 2,
      courseTitle: '职场沟通技巧提升训练营',
      courseCover: 'https://picsum.photos/seed/rev2/400/300',
      rating: 4,
      content: '课程很实用，学到了很多沟通技巧，对工作帮助很大。',
      createdAt: '2024-01-12',
    },
  ]);

  const renderStars = (rating: number) => {
    return (
      <View className="flex flex-row">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            color={i <= rating ? '#F59E0B' : '#E5E7EB'}
          />
        ))}
      </View>
    );
  };

  const handleEdit = (_reviewId: number) => {
    Taro.showToast({ title: '跳转到编辑评价', icon: 'none' });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <ScrollView scrollY className="flex-1 px-4 py-4">
        <View className="flex flex-row items-center justify-between mb-4">
          <Text className="block text-sm text-gray-500">共 {reviews.length} 条评价</Text>
        </View>

        {reviews.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Star size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无评价</Text>
            <Button className="mt-4 bg-orange-500 text-white" onClick={() => Taro.switchTab({ url: '/pages/study/index' })}>
              去学习
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row items-center mb-3">
                    <Avatar className="w-16 h-16 rounded-lg overflow-hidden">
                      <AvatarImage src={review.courseCover} />
                    </Avatar>
                    <View className="flex-1 ml-3">
                      <Text className="block text-sm font-medium text-gray-800 line-clamp-1 mb-1">
                        {review.courseTitle}
                      </Text>
                      {renderStars(review.rating)}
                    </View>
                  </View>

                  <Text className="block text-sm text-gray-600 mb-3">
                    {review.content}
                  </Text>

                  <View className="flex flex-row items-center justify-between">
                    <Text className="block text-xs text-gray-400">
                      评价于 {review.createdAt}
                    </Text>
                    <View className="flex flex-row items-center" onClick={() => handleEdit(review.id)}>
                      <Star size={14} color="#FF6B35" />
                      <Text className="block text-sm text-orange-500 ml-1">编辑</Text>
                    </View>
                  </View>

                  {review.replay && (
                    <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <View className="flex flex-row items-center mb-1">
                        <Text className="block text-xs text-orange-500 font-medium">讲师回复</Text>
                        <Text className="block text-xs text-gray-400 ml-2">{review.replayAt}</Text>
                      </View>
                      <Text className="block text-sm text-gray-600">{review.replay}</Text>
                    </View>
                  )}
                </CardContent>
              </Card>
            ))}
          </View>
        )}

        <View className="mt-6 p-4 bg-orange-50 rounded-xl">
          <Text className="block text-sm text-gray-600 text-center">
            评价优质课程可获得积分奖励哦～
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewsPage;
