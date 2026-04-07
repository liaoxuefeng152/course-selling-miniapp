import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Search, ArrowUpDown, LayoutList, LayoutGrid } from 'lucide-react-taro';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

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

const CourseListPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [sortType, setSortType] = useState<'default' | 'hot' | 'new' | 'price-asc' | 'price-desc'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { key: 'default', label: '综合排序' },
    { key: 'hot', label: '热门优先' },
    { key: 'new', label: '最新上架' },
    { key: 'price-asc', label: '价格从低到高' },
    { key: 'price-desc', label: '价格从高到低' },
  ];

  useEffect(() => {
    const { keyword, categoryId: cid, sort } = router.params;
    if (keyword) setSearchValue(keyword);
    if (cid) setCategoryId(Number(cid));
    if (sort) setSortType(sort as typeof sortType);
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [sortType, categoryId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // 模拟数据
      const mockCourses: Course[] = [
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
        },
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
        {
          id: 6,
          title: '新媒体运营从0到1',
          cover: 'https://picsum.photos/seed/course6/400/300',
          teacher: '刘老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher6/100/100',
          price: 299,
          originalPrice: 599,
          students: 1890,
          rating: 4.5,
          type: 'video',
          tags: ['运营', '新媒体'],
        },
        {
          id: 7,
          title: '英语口语提升精品课',
          cover: 'https://picsum.photos/seed/course7/400/300',
          teacher: 'Emily',
          teacherAvatar: 'https://picsum.photos/seed/teacher7/100/100',
          price: 499,
          originalPrice: 999,
          students: 1234,
          rating: 4.9,
          type: 'audio',
          tags: ['英语', '口语'],
        },
        {
          id: 8,
          title: '投资理财入门必修课',
          cover: 'https://picsum.photos/seed/course8/400/300',
          teacher: '陈老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher8/100/100',
          price: 399,
          originalPrice: 799,
          students: 3456,
          rating: 4.6,
          type: 'video',
          tags: ['理财', '投资'],
        },
      ];

      // 根据排序类型排序
      let sorted = [...mockCourses];
      switch (sortType) {
        case 'hot':
          sorted = sorted.sort((a, b) => b.students - a.students);
          break;
        case 'new':
          sorted = sorted.sort((a, b) => b.id - a.id);
          break;
        case 'price-asc':
          sorted = sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-desc':
          sorted = sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
      }

      // 根据分类筛选
      if (categoryId) {
        sorted = sorted.filter((_, index) => index % 2 === categoryId % 2);
      }

      setCourses(sorted);
    } catch (error) {
      console.error('获取课程列表失败:', error);
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

  const getCourseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      video: '视频',
      audio: '音频',
      text: '图文',
      live: '直播',
    };
    return labels[type] || '课程';
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部搜索区域 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-10">
        <View className="flex flex-row items-center gap-2">
          <View
            className="flex-1 bg-gray-100 rounded-xl px-3 py-2 flex flex-row items-center"
            onClick={() => {
              if (searchValue) handleSearch();
            }}
          >
            <Search size={18} color="#9CA3AF" />
            <View className="flex-1">
            <Input
              className="w-full text-sm bg-transparent"
              placeholder="搜索课程"
              placeholderClass="text-gray-400"
              value={searchValue}
              onInput={(e) => setSearchValue(e.detail.value)}
              onConfirm={handleSearch}
            />
          </View>
          </View>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
          >
            <ArrowUpDown size={20} color="#6B7280" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <LayoutList size={20} color="#6B7280" />
            ) : (
              <LayoutGrid size={20} color="#FF6B35" />
            )}
          </Button>
        </View>

        {/* 排序下拉菜单 */}
        {showSortDropdown && (
          <View className="absolute top-full left-0 right-0 bg-white shadow-lg z-20 border-t border-gray-100">
            {sortOptions.map((option) => (
              <View
                key={option.key}
                className={`px-4 py-3 flex flex-row items-center justify-between ${
                  sortType === option.key ? 'bg-orange-50' : ''
                }`}
                onClick={() => {
                  setSortType(option.key as typeof sortType);
                  setShowSortDropdown(false);
                }}
              >
                <Text
                  className={`block text-sm ${
                    sortType === option.key ? 'text-orange-500 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </Text>
                {sortType === option.key && (
                  <Text className="block text-xs text-orange-500">✓</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 分类标签 */}
      <View className="bg-white px-4 py-2 border-b border-gray-100">
        <View className="flex flex-row items-center">
          <Text className="block text-sm text-gray-500 mr-2">分类:</Text>
          <ScrollView scrollX className="flex-1">
            <View className="flex flex-row gap-2">
              <Badge
                variant={categoryId === null ? 'default' : 'outline'}
                className={categoryId === null ? 'bg-orange-500 text-white' : ''}
                onClick={() => setCategoryId(null)}
              >
                全部
              </Badge>
              <Badge
                variant={categoryId === 1 ? 'default' : 'outline'}
                className={categoryId === 1 ? 'bg-orange-500 text-white' : ''}
                onClick={() => setCategoryId(1)}
              >
                技能培训
              </Badge>
              <Badge
                variant={categoryId === 2 ? 'default' : 'outline'}
                className={categoryId === 2 ? 'bg-orange-500 text-white' : ''}
                onClick={() => setCategoryId(2)}
              >
                职场提升
              </Badge>
              <Badge
                variant={categoryId === 3 ? 'default' : 'outline'}
                className={categoryId === 3 ? 'bg-orange-500 text-white' : ''}
                onClick={() => setCategoryId(3)}
              >
                兴趣爱好
              </Badge>
              <Badge
                variant={categoryId === 4 ? 'default' : 'outline'}
                className={categoryId === 4 ? 'bg-orange-500 text-white' : ''}
                onClick={() => setCategoryId(4)}
              >
                考证考编
              </Badge>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* 结果统计 */}
      <View className="px-4 py-2">
        <Text className="block text-sm text-gray-500">
          共 {courses.length} 个课程
        </Text>
      </View>

      {/* 课程列表 */}
      <ScrollView scrollY className="flex-1 px-4">
        {loading ? (
          <View className="flex flex-col gap-4 py-4">
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="bg-white rounded-xl overflow-hidden">
                <View className="h-40 bg-gray-200 animate-pulse" />
                <View className="p-3">
                  <View className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                  <View className="h-3 bg-gray-200 rounded w-1/2" />
                </View>
              </View>
            ))}
          </View>
        ) : courses.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Text className="block text-gray-400 text-base">未找到相关课程</Text>
          </View>
        ) : viewMode === 'grid' ? (
          <View className="grid grid-cols-2 gap-3 py-4">
            {courses.map((course) => (
              <View
                key={course.id}
                className="bg-white rounded-xl overflow-hidden"
                onClick={() => handleCourseClick(course.id)}
              >
                <View className="relative">
                  <Image
                    className="w-full h-28"
                    src={course.cover}
                    mode="aspectFill"
                  />
                  <View className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-orange-500 bg-opacity-90 text-white text-xs">
                      {getCourseTypeLabel(course.type)}
                    </Badge>
                  </View>
                  {course.hasDiscount && (
                    <View className="absolute top-2 right-2 px-1 py-1 bg-red-500 rounded text-xs text-white">
                      优惠
                    </View>
                  )}
                </View>
                <View className="p-2">
                  <Text className="block text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    {course.title}
                  </Text>
                  <View className="flex flex-row items-center mb-1">
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={course.teacherAvatar} />
                    </Avatar>
                    <Text className="block text-xs text-gray-500 ml-1">{course.teacher}</Text>
                  </View>
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-baseline">
                      <Text className="block text-sm font-bold text-orange-500">
                        ¥{course.discountPrice || course.price}
                      </Text>
                      {course.originalPrice > course.price && (
                        <Text className="block text-xs text-gray-400 line-through ml-1">
                          ¥{course.originalPrice}
                        </Text>
                      )}
                    </View>
                    <Text className="block text-xs text-gray-400">{course.students}人</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex flex-col gap-3 py-4">
            {courses.map((course) => (
              <View
                key={course.id}
                className="bg-white rounded-xl overflow-hidden"
                onClick={() => handleCourseClick(course.id)}
              >
                <View className="flex flex-row">
                  <View className="relative">
                    <Image
                      className="w-28 h-28"
                      src={course.cover}
                      mode="aspectFill"
                    />
                    <View className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-orange-500 bg-opacity-90 text-white text-xs">
                        {getCourseTypeLabel(course.type)}
                      </Badge>
                    </View>
                  </View>
                  <View className="flex-1 p-3 flex flex-col justify-between">
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
                          ¥{course.discountPrice || course.price}
                        </Text>
                        {course.originalPrice > course.price && (
                          <Text className="block text-xs text-gray-400 line-through ml-1">
                            ¥{course.originalPrice}
                          </Text>
                        )}
                      </View>
                      <View className="flex flex-row items-center">
                        <Text className="text-xs text-gray-400 mr-1">👁</Text>
                        <Text className="block text-xs text-gray-400">{course.students}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CourseListPage;
