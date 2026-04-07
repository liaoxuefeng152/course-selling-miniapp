import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Search, Clock, ChevronRight, Play } from 'lucide-react-taro';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import './index.css';

// 课程类型定义
interface Course {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  price: number;
  originalPrice: number;
  students: number;
  rating: number;
  type: 'video' | 'audio' | 'text' | 'live';
  tags: string[];
  hasDiscount?: boolean;
  discountPrice?: number;
}

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
}

// 分类定义
interface Category {
  id: number;
  name: string;
  icon: string;
}

const IndexPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [upcomingLives, setUpcomingLives] = useState<Live[]>([]);
  const [categories] = useState<Category[]>([
    { id: 1, name: '技能培训', icon: '💼' },
    { id: 2, name: '职场提升', icon: '📈' },
    { id: 3, name: '兴趣爱好', icon: '🎨' },
    { id: 4, name: '考证考编', icon: '📚' },
    { id: 5, name: '亲子教育', icon: '👨‍👩‍👧' },
    { id: 6, name: '美食烹饪', icon: '🍳' },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟数据 - 实际开发中应调用后端接口
      const mockFeatured: Course[] = [
        {
          id: 1,
          title: '短视频剪辑实战课：从入门到精通',
          cover: 'https://picsum.photos/seed/course1/400/300',
          teacher: '张老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
          price: 299,
          originalPrice: 599,
          students: 1234,
          rating: 4.8,
          type: 'video',
          tags: ['热门', '实战'],
          hasDiscount: true,
          discountPrice: 299,
        },
        {
          id: 2,
          title: '职场沟通技巧提升训练营',
          cover: 'https://picsum.photos/seed/course2/400/300',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
          price: 199,
          originalPrice: 399,
          students: 856,
          rating: 4.9,
          type: 'video',
          tags: ['畅销', '职场'],
        },
        {
          id: 3,
          title: 'Python数据分析入门到实战',
          cover: 'https://picsum.photos/seed/course3/400/300',
          teacher: '王老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher3/100/100',
          price: 399,
          originalPrice: 799,
          students: 2341,
          rating: 4.7,
          type: 'video',
          tags: ['编程', '数据'],
          hasDiscount: true,
          discountPrice: 399,
        },
      ];

      const mockPopular: Course[] = [
        {
          id: 4,
          title: '摄影入门：手机拍摄技巧',
          cover: 'https://picsum.photos/seed/course4/400/300',
          teacher: '陈老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher4/100/100',
          price: 99,
          originalPrice: 199,
          students: 5678,
          rating: 4.6,
          type: 'video',
          tags: ['摄影'],
        },
        {
          id: 5,
          title: '瑜伽塑形：在家练出好身材',
          cover: 'https://picsum.photos/seed/course5/400/300',
          teacher: '赵老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher5/100/100',
          price: 159,
          originalPrice: 299,
          students: 3421,
          rating: 4.8,
          type: 'video',
          tags: ['健身', '瑜伽'],
        },
      ];

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
        },
        {
          id: 2,
          title: '2024年考研备考规划指导',
          cover: 'https://picsum.photos/seed/live2/400/300',
          teacher: '周老师',
          teacherAvatar: 'https://picsum.photos/seed/liveTeacher2/100/100',
          startTime: '正在直播',
          status: 'live',
          viewers: 1234,
        },
      ];

      setFeaturedCourses(mockFeatured);
      setPopularCourses(mockPopular);
      setUpcomingLives(mockLives);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      Taro.navigateTo({
        url: `/pages/course-list/index?keyword=${encodeURIComponent(searchValue)}`,
      });
    }
  };

  const handleCourseClick = (courseId: number) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    Taro.navigateTo({
      url: `/pages/course-list/index?categoryId=${categoryId}&name=${encodeURIComponent(categoryName)}`,
    });
  };

  const handleLiveClick = (liveId: number) => {
    Taro.navigateTo({
      url: `/pages/live-detail/index?id=${liveId}`,
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

  const getLiveStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      upcoming: '预约',
      live: '直播中',
      replay: '回放',
    };
    return labels[status] || '';
  };

  const getLiveStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-amber-500',
      live: 'bg-red-500',
      replay: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部搜索区域 */}
      <View className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-4 pb-6">
        <Text className="block text-white text-xl font-bold mb-4">多平台卖课</Text>
        <View className="bg-white rounded-xl px-4 py-3 flex flex-row items-center">
          <Search size={20} color="#9CA3AF" />
          <View className="flex-1 ml-2">
            <Input
              className="w-full text-base bg-transparent"
              placeholder="搜索感兴趣的课程"
              placeholderClass="text-gray-400"
              value={searchValue}
              onInput={(e) => setSearchValue(e.detail.value)}
              onConfirm={handleSearch}
            />
          </View>
        </View>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* 分类导航 */}
        <View className="bg-white px-4 py-4">
          <View className="grid grid-cols-5 gap-4">
            {categories.map((cat) => (
              <View
                key={cat.id}
                className="flex flex-col items-center"
                onClick={() => handleCategoryClick(cat.id, cat.name)}
              >
                <View className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-1">
                  <Text className="text-2xl">{cat.icon}</Text>
                </View>
                <Text className="block text-xs text-gray-600 text-center">{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 直播预告 */}
        {upcomingLives.length > 0 && (
          <View className="mt-3 px-4">
            <View className="flex flex-row justify-between items-center mb-3">
              <View className="flex flex-row items-center">
                <View className="w-1 h-5 bg-orange-500 rounded-full mr-2" />
                <Text className="block text-lg font-semibold text-gray-800">直播预告</Text>
              </View>
              <View
                className="flex flex-row items-center"
                onClick={() => Taro.switchTab({ url: '/pages/live/index' })}
              >
                <Text className="block text-sm text-gray-400 mr-1">查看更多</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </View>
            <ScrollView scrollX className="flex-row gap-3">
              {upcomingLives.map((live) => (
                <View
                  key={live.id}
                  className="w-64 flex-shrink-0"
                  onClick={() => handleLiveClick(live.id)}
                >
                  <Card className="overflow-hidden">
                    <View className="relative">
                      <Image
                        className="w-full h-36"
                        src={live.cover}
                        mode="aspectFill"
                      />
                      <View className={`absolute top-2 left-2 px-2 py-1 rounded text-xs text-white ${getLiveStatusColor(live.status)}`}>
                        <View className="flex flex-row items-center gap-1">
                          {live.status === 'live' && (
                            <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                          <Text className="text-white text-xs">{getLiveStatusLabel(live.status)}</Text>
                        </View>
                      </View>
                      {live.status === 'live' && (
                        <View className="absolute top-2 right-2 px-2 py-1 rounded bg-black bg-opacity-50">
                          <Text className="text-white text-xs">{live.viewers}人在看</Text>
                        </View>
                      )}
                    </View>
                    <CardContent className="p-3">
                      <Text className="block text-sm font-medium text-gray-800 mb-2 truncate">
                        {live.title}
                      </Text>
                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={live.teacherAvatar} />
                          </Avatar>
                          <Text className="block text-xs text-gray-500 ml-2">{live.teacher}</Text>
                        </View>
                        <Text className="block text-xs text-orange-500">{live.startTime}</Text>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 热门推荐 */}
        <View className="mt-6 px-4">
          <View className="flex flex-row justify-between items-center mb-3">
            <View className="flex flex-row items-center">
              <View className="w-5 h-5 mr-2 flex items-center justify-center">
                <Text className="text-orange-500 text-lg">🔥</Text>
              </View>
              <Text className="block text-lg font-semibold text-gray-800">热门推荐</Text>
            </View>
            <View
              className="flex flex-row items-center"
              onClick={() => Taro.navigateTo({ url: '/pages/course-list/index?sort=hot' })}
            >
              <Text className="block text-sm text-gray-400 mr-1">查看更多</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </View>

          {loading ? (
            <View className="flex flex-row gap-3">
              {[1, 2, 3].map((i) => (
                <View key={i} className="w-48 flex-shrink-0">
                  <Skeleton className="w-full h-28 rounded-xl mb-2" />
                  <Skeleton className="w-full h-4 rounded mb-1" />
                  <Skeleton className="w-2/3 h-4 rounded" />
                </View>
              ))}
            </View>
          ) : (
            <ScrollView scrollX className="flex-row gap-3">
              {featuredCourses.map((course) => (
                <View
                  key={course.id}
                  className="w-48 flex-shrink-0"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <Card className="overflow-hidden">
                    <View className="relative">
                      <Image
                        className="w-full h-28"
                        src={course.cover}
                        mode="aspectFill"
                      />
                      <View className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-orange-500 text-white text-xs">
                          {getCourseTypeLabel(course.type)}
                        </Badge>
                      </View>
                      {course.hasDiscount && (
                        <View className="absolute top-2 right-2 px-1 py-1 bg-red-500 rounded text-xs text-white">
                          限时优惠
                        </View>
                      )}
                    </View>
                    <CardContent className="p-3">
                      <Text className="block text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                        {course.title}
                      </Text>
                      <View className="flex flex-row items-center mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={course.teacherAvatar} />
                        </Avatar>
                        <Text className="block text-xs text-gray-500 ml-1">{course.teacher}</Text>
                      </View>
                      <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-baseline">
                          <Text className="block text-base font-bold text-orange-500">
                            ¥{course.price}
                          </Text>
                          {course.originalPrice > course.price && (
                            <Text className="block text-xs text-gray-400 line-through ml-1">
                              ¥{course.originalPrice}
                            </Text>
                          )}
                        </View>
                        <Text className="block text-xs text-gray-400">
                          {course.students}人学习
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* 最新课程 */}
        <View className="mt-6 px-4 mb-4">
          <View className="flex flex-row justify-between items-center mb-3">
            <View className="flex flex-row items-center">
              <Clock size={20} color="#FF6B35" />
              <Text className="block text-lg font-semibold text-gray-800 ml-2">最新课程</Text>
            </View>
            <View
              className="flex flex-row items-center"
              onClick={() => Taro.navigateTo({ url: '/pages/course-list/index?sort=new' })}
            >
              <Text className="block text-sm text-gray-400 mr-1">查看更多</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </View>

          <View className="flex flex-col gap-3">
            {popularCourses.map((course) => (
              <View
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
              >
                <Card className="flex flex-row overflow-hidden">
                  <Image
                    className="w-28 h-28"
                    src={course.cover}
                    mode="aspectFill"
                  />
                  <CardContent className="flex-1 p-3 flex flex-col justify-between">
                    <View>
                      <Text className="block text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                        {course.title}
                      </Text>
                      <View className="flex flex-row items-center mb-1">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={course.teacherAvatar} />
                        </Avatar>
                        <Text className="block text-xs text-gray-500 ml-1">{course.teacher}</Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center justify-between">
                      <View className="flex flex-row items-baseline">
                        <Text className="block text-base font-bold text-orange-500">
                          ¥{course.price}
                        </Text>
                        {course.originalPrice > course.price && (
                          <Text className="block text-xs text-gray-400 line-through ml-1">
                            ¥{course.originalPrice}
                          </Text>
                        )}
                      </View>
                      <View className="flex flex-row items-center">
                        <Play size={12} color="#9CA3AF" />
                        <Text className="block text-xs text-gray-400 ml-1">
                          {course.students}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default IndexPage;
