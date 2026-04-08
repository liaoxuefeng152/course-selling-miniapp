import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { BookOpen, Clock, TrendingUp, Award } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// 学习课程类型定义
interface LearningCourse {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastStudyTime: string;
  status: 'learning' | 'completed';
}

const StudyPage = () => {
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalHours: 0,
    completedCourses: 0,
    streakDays: 0,
  });

  // 默认图片
  const defaultCover = 'https://picsum.photos/seed/default-course/400/300';

  const handleImageError = (e: any) => {
    e.target.src = defaultCover;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 模拟数据
      const mockCourses: LearningCourse[] = [
        {
          id: 1,
          title: '短视频剪辑实战课：从入门到精通',
          cover: 'https://picsum.photos/seed/study1/400/300',
          teacher: '张老师',
          progress: 65,
          totalLessons: 20,
          completedLessons: 13,
          lastStudyTime: '2024-01-18 15:30',
          status: 'learning',
        },
        {
          id: 2,
          title: '职场沟通技巧提升训练营',
          cover: 'https://picsum.photos/seed/study2/400/300',
          teacher: '李老师',
          progress: 100,
          totalLessons: 15,
          completedLessons: 15,
          lastStudyTime: '2024-01-15 20:00',
          status: 'completed',
        },
        {
          id: 3,
          title: 'Python数据分析入门到实战',
          cover: 'https://picsum.photos/seed/study3/400/300',
          teacher: '王老师',
          progress: 30,
          totalLessons: 25,
          completedLessons: 8,
          lastStudyTime: '2024-01-17 10:00',
          status: 'learning',
        },
        {
          id: 4,
          title: '摄影入门：手机拍摄技巧',
          cover: 'https://picsum.photos/seed/study4/400/300',
          teacher: '陈老师',
          progress: 0,
          totalLessons: 12,
          completedLessons: 0,
          lastStudyTime: '',
          status: 'learning',
        },
      ];

      setCourses(mockCourses);
      setStats({
        totalCourses: 4,
        totalHours: 36.5,
        completedCourses: 1,
        streakDays: 7,
      });
    } catch (error) {
      console.error('获取学习数据失败:', error);
    } finally {
    }
  };

  const handleCourseClick = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course-play/index?courseId=${courseId}`,
    });
  };

  const handleContinueStudy = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course-play/index?courseId=${courseId}`,
    });
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部标题 */}
      <View className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-4 pb-6">
        <View className="flex flex-row items-center mb-4">
          <BookOpen size={24} color="#FFFFFF" />
          <Text className="block text-xl font-bold text-white ml-2">我的学习</Text>
        </View>

        {/* 学习统计 */}
        <View className="flex flex-row justify-between bg-white bg-opacity-20 rounded-xl p-4">
          <View className="flex flex-col items-center flex-1">
            <Text className="block text-2xl font-bold text-white">{stats.totalCourses}</Text>
            <Text className="block text-xs text-white text-opacity-80">在学课程</Text>
          </View>
          <View className="w-px bg-white bg-opacity-30" />
          <View className="flex flex-col items-center flex-1">
            <Text className="block text-2xl font-bold text-white">{stats.totalHours}</Text>
            <Text className="block text-xs text-white text-opacity-80">学习时长(h)</Text>
          </View>
          <View className="w-px bg-white bg-opacity-30" />
          <View className="flex flex-col items-center flex-1">
            <Text className="block text-2xl font-bold text-white">{stats.completedCourses}</Text>
            <Text className="block text-xs text-white text-opacity-80">已完成</Text>
          </View>
          <View className="w-px bg-white bg-opacity-30" />
          <View className="flex flex-col items-center flex-1">
            <View className="flex flex-row items-center">
              <TrendingUp size={16} color="#FFFFFF" />
              <Text className="block text-2xl font-bold text-white ml-1">{stats.streakDays}</Text>
            </View>
            <Text className="block text-xs text-white text-opacity-80">连续学习</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {/* 正在学习 */}
        <View className="mb-6">
          <View className="flex flex-row items-center mb-3">
            <Clock size={20} color="#FF6B35" />
            <Text className="block text-lg font-semibold text-gray-800 ml-2">继续学习</Text>
          </View>

          <View className="flex flex-col gap-4">
            {courses
              .filter((c) => c.status === 'learning')
              .map((course) => (
                <View key={course.id} onClick={() => handleCourseClick(course.id)}>
                  <Card className="overflow-hidden">
                    <View className="flex flex-row">
                      <Image
                        className="w-24 h-24"
                        src={course.cover || defaultCover}
                        mode="aspectFill"
                        onError={handleImageError}
                      />
                      <CardContent className="flex-1 p-3 flex flex-col justify-between">
                        <View>
                          <Text className="block text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                            {course.title}
                          </Text>
                          <Text className="block text-xs text-gray-500">讲师: {course.teacher}</Text>
                        </View>
                        <View className="flex flex-row items-center justify-between">
                          <View className="flex-1 mr-3">
                            <View className="flex flex-row justify-between mb-1">
                              <Text className="block text-xs text-gray-500">
                                {course.completedLessons}/{course.totalLessons}节
                              </Text>
                              <Text className="block text-xs text-orange-500">{course.progress}%</Text>
                            </View>
                            <Progress value={course.progress} className="h-2" />
                          </View>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-orange-500 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinueStudy(course.id);
                            }}
                          >
                            继续
                          </Button>
                        </View>
                      </CardContent>
                    </View>
                  </Card>
                </View>
              ))}
          </View>
        </View>

        {/* 已完成课程 */}
        <View>
          <View className="flex flex-row items-center mb-3">
            <Award size={20} color="#10B981" />
            <Text className="block text-lg font-semibold text-gray-800 ml-2">已完成</Text>
          </View>

          <View className="flex flex-col gap-4">
            {courses
              .filter((c) => c.status === 'completed')
              .map((course) => (
                <View key={course.id} onClick={() => handleCourseClick(course.id)}>
                  <Card className="overflow-hidden">
                    <View className="flex flex-row">
                      <View className="relative w-24 h-24">
                        <Image
                          className="w-full h-full"
                          src={course.cover || defaultCover}
                          mode="aspectFill"
                          onError={handleImageError}
                        />
                        <View className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            已完成
                          </Badge>
                        </View>
                      </View>
                      <CardContent className="flex-1 p-3 flex flex-col justify-between">
                        <View>
                          <Text className="block text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                            {course.title}
                          </Text>
                          <Text className="block text-xs text-gray-500">讲师: {course.teacher}</Text>
                        </View>
                        <View className="flex flex-row items-center justify-between">
                          <Text className="block text-xs text-gray-400">
                            学习时长: {course.totalLessons}节
                          </Text>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-500 text-orange-500"
                          >
                            复习
                          </Button>
                        </View>
                      </CardContent>
                    </View>
                  </Card>
                </View>
              ))}
          </View>
        </View>

        {/* 空状态 */}
        {courses.filter((c) => c.status === 'learning').length === 0 && (
          <View className="flex flex-col items-center justify-center py-20">
            <BookOpen size={64} color="#D1D5DB" />
            <Text className="block text-base text-gray-400 mb-2 mt-4">还没有在学课程</Text>
            <Text className="block text-sm text-gray-400 mb-4">去首页发现感兴趣的课程吧</Text>
            <Button
              variant="default"
              className="bg-orange-500 text-white"
              onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
            >
              浏览课程
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default StudyPage;
