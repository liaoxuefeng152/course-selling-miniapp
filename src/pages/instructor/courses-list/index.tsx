import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, BookOpen, Users, Play } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';

interface Course {
  id: number;
  title: string;
  cover: string;
  type: 'video' | 'audio' | 'live';
  price: number;
  studentCount: number;
  lessonCount: number;
  status: 'published' | 'draft' | 'offline';
  publishedAt: string;
}

const InstructorCoursesListPage = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [courses, setCourses] = useState<Course[]>([]);

  useState(() => {
    // 模拟数据
    const mockCourses: Course[] = [
      {
        id: 1,
        title: 'Python数据分析入门',
        cover: 'https://picsum.photos/seed/course1/400/200',
        type: 'video',
        price: 199,
        studentCount: 1256,
        lessonCount: 24,
        status: 'published',
        publishedAt: '2024-03-15',
      },
      {
        id: 2,
        title: 'Excel高级技巧实战',
        cover: 'https://picsum.photos/seed/course2/400/200',
        type: 'video',
        price: 149,
        studentCount: 856,
        lessonCount: 18,
        status: 'published',
        publishedAt: '2024-03-20',
      },
      {
        id: 3,
        title: 'Java基础教程',
        cover: 'https://picsum.photos/seed/course3/400/200',
        type: 'video',
        price: 299,
        studentCount: 432,
        lessonCount: 32,
        status: 'published',
        publishedAt: '2024-04-01',
      },
      {
        id: 4,
        title: '营销策略分享',
        cover: 'https://picsum.photos/seed/course4/400/200',
        type: 'audio',
        price: 99,
        studentCount: 267,
        lessonCount: 12,
        status: 'draft',
        publishedAt: '',
      },
      {
        id: 5,
        title: '职场沟通技巧',
        cover: 'https://picsum.photos/seed/course5/400/200',
        type: 'video',
        price: 129,
        studentCount: 189,
        lessonCount: 16,
        status: 'offline',
        publishedAt: '2024-02-28',
      },
    ];

    const filteredCourses =
      activeTab === 'all'
        ? mockCourses
        : mockCourses.filter((c) => c.status === activeTab);
    setCourses(filteredCourses);
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: '视频课',
      audio: '音频课',
      live: '直播课',
    };
    return labels[type] || '其他';
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      published: { label: '已上架', color: 'bg-green-500' },
      draft: { label: '草稿', color: 'bg-gray-500' },
      offline: { label: '已下架', color: 'bg-red-500' },
    };
    return config[status] || { label: '', color: 'bg-gray-500' };
  };

  const handleCourseClick = () => {
    Taro.showActionSheet({
      itemList: ['查看详情（前往PC端）', '查看学员列表（前往PC端）'],
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

  const tabs = [
    { key: 'published', label: '已上架' },
    { key: 'draft', label: '草稿' },
    { key: 'offline', label: '已下架' },
  ];

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center">
          <View onClick={() => Taro.navigateBack()}>
            <ArrowLeft size={24} color="#374151" />
          </View>
          <Text className="block text-lg font-semibold text-gray-800 ml-4">我的课程</Text>
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
        {courses.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <BookOpen size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无课程</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {courses.map((course) => {
              const badge = getStatusBadge(course.status);
              return (
                <Card
                  key={course.id}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => handleCourseClick()}
                >
                  <View className="relative">
                    <Image
                      className="w-full h-44"
                      src={course.cover}
                      mode="aspectFill"
                    />
                    <View className={`absolute top-3 left-3 px-2 py-1 rounded ${badge.color}`}>
                      <Text className="text-white text-xs font-medium">{badge.label}</Text>
                    </View>
                    <View className="absolute top-3 right-3 px-2 py-1 bg-black bg-opacity-50 rounded">
                      <Text className="text-white text-xs">{getTypeLabel(course.type)}</Text>
                    </View>
                  </View>
                  <CardContent className="p-4">
                    <Text className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
                      {course.title}
                    </Text>
                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="text-lg font-bold text-orange-500">
                        ¥{course.price}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {course.publishedAt || '未发布'}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center text-xs text-gray-500">
                      <View className="flex flex-row items-center mr-4">
                        <Users size={14} color="#9CA3AF" />
                        <Text className="ml-1">{course.studentCount} 人学习</Text>
                      </View>
                      <View className="flex flex-row items-center">
                        <Play size={14} color="#9CA3AF" />
                        <Text className="ml-1">{course.lessonCount} 节课</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}

        {/* 提示信息 */}
        {courses.length > 0 && (
          <View className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <Text className="text-sm text-orange-800">
              课程编辑、上架、下架等操作请在PC端完成
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default InstructorCoursesListPage;
