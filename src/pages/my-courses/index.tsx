import { View, Text, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { BookOpen, Play, Clock } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: string;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  price: number;
  originalPrice: number;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  purchaseTime: string;
}

const MyCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      // 模拟数据：已购买的课程
      const mockCourses: Course[] = [
        {
          id: 'course_001',
          title: '短视频剪辑实战课：从入门到精通',
          cover: 'https://picsum.photos/seed/mycourse1/400/300',
          teacher: '张老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
          price: 299,
          originalPrice: 599,
          progress: 65,
          totalLessons: 20,
          completedLessons: 13,
          purchaseTime: '2024-01-15 10:30:00',
        },
        {
          id: 'course_002',
          title: '职场沟通技巧提升训练营',
          cover: 'https://picsum.photos/seed/mycourse2/400/300',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
          price: 199,
          originalPrice: 399,
          progress: 30,
          totalLessons: 15,
          completedLessons: 5,
          purchaseTime: '2024-01-10 15:20:00',
        },
        {
          id: 'course_003',
          title: 'Python数据分析入门到实战',
          cover: 'https://picsum.photos/seed/mycourse3/400/300',
          teacher: '王老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
          price: 399,
          originalPrice: 799,
          progress: 100,
          totalLessons: 25,
          completedLessons: 25,
          purchaseTime: '2024-01-05 09:00:00',
        },
        {
          id: 'course_004',
          title: 'Photoshop设计基础',
          cover: 'https://picsum.photos/seed/mycourse4/400/300',
          teacher: '赵老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher4/100/100',
          price: 159,
          originalPrice: 299,
          progress: 0,
          totalLessons: 12,
          completedLessons: 0,
          purchaseTime: '2024-01-20 14:30:00',
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error('获取我的课程失败:', error);
    }
  };

  const handleCourseClick = (courseId: string) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const handleContinueLearning = (courseId: string) => {
    Taro.navigateTo({
      url: `/pages/course-play/index?courseId=${courseId}`,
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300';
    if (progress === 100) return 'bg-green-500';
    return 'bg-orange-500';
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <Text className="block text-lg font-semibold text-gray-800">我的课程</Text>
        <Text className="block text-sm text-gray-500 mt-1">
          共 {courses.length} 门课程，{courses.filter(c => c.progress === 100).length} 门已完成
        </Text>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {courses.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <BookOpen size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无已购买课程</Text>
            <Button
              variant="outline"
              className="mt-4 border-orange-300 text-orange-500"
              onClick={() => Taro.switchTab({ url: '/pages/index/index' })}
            >
              去逛逛
            </Button>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <View
                    className="relative"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <View className="relative w-full h-48">
                      <View
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${course.cover})` }}
                      />
                      <View className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30" />
                      <View className="absolute top-2 right-2">
                        {course.progress === 100 ? (
                          <View className="bg-green-500 px-3 py-1 rounded-full">
                            <Text className="text-xs text-white font-medium">已完成</Text>
                          </View>
                        ) : course.progress > 0 ? (
                          <View className="bg-orange-500 px-3 py-1 rounded-full">
                            <Text className="text-xs text-white font-medium">学习中</Text>
                          </View>
                        ) : (
                          <View className="bg-gray-500 px-3 py-1 rounded-full">
                            <Text className="text-xs text-white font-medium">未开始</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="block text-base font-semibold text-gray-800 line-clamp-2 mb-2">
                      {course.title}
                    </Text>

                    <View className="flex flex-row items-center mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={course.teacherAvatar} />
                      </Avatar>
                      <Text className="block text-sm text-gray-600 ml-2">{course.teacher}</Text>
                    </View>

                    <View className="flex flex-row items-center justify-between text-xs text-gray-500 mb-3">
                      <View className="flex flex-row items-center">
                        <Clock size={14} color="#6B7280" />
                        <Text className="ml-1">{course.purchaseTime}</Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <Play size={14} color="#6B7280" />
                        <Text className="ml-1">
                          {course.completedLessons}/{course.totalLessons} 课时
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3">
                      <View className="flex flex-row justify-between text-xs text-gray-600 mb-1">
                        <Text>学习进度</Text>
                        <Text className="font-medium">{course.progress}%</Text>
                      </View>
                      <Progress value={course.progress} className={`h-2 ${getProgressColor(course.progress)}`} />
                    </View>

                    <View className="flex flex-row items-center justify-between">
                      <View className="flex flex-row items-baseline">
                        <Text className="text-lg font-bold text-orange-500">
                          ¥{course.price}
                        </Text>
                        {course.originalPrice > course.price && (
                          <Text className="text-sm text-gray-400 line-through ml-2">
                            ¥{course.originalPrice}
                          </Text>
                        )}
                      </View>

                      {course.progress === 100 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-600"
                          onClick={() => handleCourseClick(course.id)}
                        >
                          回顾
                        </Button>
                      ) : course.progress > 0 ? (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-orange-500 text-white"
                          onClick={() => handleContinueLearning(course.id)}
                        >
                          继续学习
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-orange-500 text-white"
                          onClick={() => handleContinueLearning(course.id)}
                        >
                          开始学习
                        </Button>
                      )}
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

export default MyCoursesPage;
