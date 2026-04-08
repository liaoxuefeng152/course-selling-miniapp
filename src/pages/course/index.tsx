import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import {
  Play,
  Users,
  Star,
  Share,
  Heart,
  Shield,
  Clock,
  BookOpen,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Ticket,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

// 课时类型定义
interface Lesson {
  id: number;
  title: string;
  duration: string;
  isFree: boolean;
  isCompleted: boolean;
}

// 优惠券类型定义
interface Coupon {
  id: string;
  title: string;
  type: 'discount' | 'cash';
  value: number;
  minAmount: number;
  validUntil: string;
  description: string;
}

// 课程章节类型定义
interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

// 课程类型定义
interface Course {
  id: number;
  title: string;
  cover: string;
  teacher: string;
  teacherAvatar: string;
  teacherIntro: string;
  price: number;
  originalPrice: number;
  students: number;
  rating: number;
  reviews: number;
  type: 'video' | 'audio' | 'text' | 'live';
  tags: string[];
  description: string;
  chapters: Chapter[];
  hasDiscount: boolean;
  discountPrice?: number;
}

const CoursePage = () => {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([1]);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 可用优惠券列表
  const availableCoupons: Coupon[] = [
    {
      id: 'coupon_001',
      title: '新人专享券',
      type: 'cash',
      value: 50,
      minAmount: 199,
      validUntil: '2024-12-31',
      description: '限首次购买使用',
    },
    {
      id: 'coupon_002',
      title: '限时折扣券',
      type: 'discount',
      value: 20,
      minAmount: 100,
      validUntil: '2024-02-28',
      description: '全场课程通用',
    },
    {
      id: 'coupon_003',
      title: '满减券',
      type: 'cash',
      value: 30,
      minAmount: 299,
      validUntil: '2024-03-15',
      description: '满299减30',
    },
  ];

  useEffect(() => {
    fetchCourseDetail();
  }, []);

  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const courseId = router.params.id || '1';
      
      // 模拟课程数据
      const mockCourse: Course = {
        id: Number(courseId),
        title: '短视频剪辑实战课：从入门到精通',
        cover: 'https://picsum.photos/seed/course-detail/800/500',
        teacher: '张老师',
        teacherAvatar: 'https://picsum.photos/seed/teacher-detail/100/100',
        teacherIntro: '资深短视频运营专家，拥有10年影视制作经验，擅长短视频内容策划与剪辑技巧。已帮助超过10000名学员掌握短视频技能。',
        price: 299,
        originalPrice: 599,
        students: 1234,
        rating: 4.8,
        reviews: 456,
        type: 'video',
        tags: ['热门', '实战', '剪辑'],
        description: `这门课程将帮助你从零开始掌握短视频剪辑技能：

【课程特色】
1. 实战导向：每节课都有实际案例，手把手教你操作
2. 体系完整：从基础到进阶，循序渐进
3. 工具全面：涵盖剪映、PR等主流剪辑软件
4. 变现指导：分享短视频变现的各种途径

【你将学到】
- 短视频剪辑的基本操作
- 热门特效与转场技巧
- 音频处理与背景音乐选择
- 字幕制作与封面设计
- 短视频运营与变现策略

【适合人群】
- 想学习短视频剪辑的零基础学员
- 想提升剪辑技能的自媒体创作者
- 想通过短视频创业的人群`,
        hasDiscount: true,
        discountPrice: 299,
        chapters: [
          {
            id: 1,
            title: '第一章：剪辑基础入门',
            lessons: [
              { id: 1, title: '1.1 认识短视频剪辑', duration: '15:30', isFree: true, isCompleted: true },
              { id: 2, title: '1.2 剪辑软件安装与设置', duration: '12:45', isFree: true, isCompleted: false },
              { id: 3, title: '1.3 素材导入与整理', duration: '18:20', isFree: false, isCompleted: false },
              { id: 4, title: '1.4 时间线操作基础', duration: '20:15', isFree: false, isCompleted: false },
            ],
          },
          {
            id: 2,
            title: '第二章：剪辑技巧进阶',
            lessons: [
              { id: 5, title: '2.1 剪切与分割技巧', duration: '16:30', isFree: false, isCompleted: false },
              { id: 6, title: '2.2 关键帧动画', duration: '22:15', isFree: false, isCompleted: false },
              { id: 7, title: '2.3 转场效果应用', duration: '25:40', isFree: false, isCompleted: false },
              { id: 8, title: '2.4 特效添加技巧', duration: '28:30', isFree: false, isCompleted: false },
            ],
          },
          {
            id: 3,
            title: '第三章：音频处理',
            lessons: [
              { id: 9, title: '3.1 背景音乐选择', duration: '14:20', isFree: false, isCompleted: false },
              { id: 10, title: '3.2 音效添加技巧', duration: '16:45', isFree: false, isCompleted: false },
              { id: 11, title: '3.3 语音录制与处理', duration: '20:30', isFree: false, isCompleted: false },
            ],
          },
          {
            id: 4,
            title: '第四章：字幕与封面',
            lessons: [
              { id: 12, title: '4.1 字幕制作教程', duration: '18:00', isFree: false, isCompleted: false },
              { id: 13, title: '4.2 封面设计技巧', duration: '22:30', isFree: false, isCompleted: false },
              { id: 14, title: '4.3 作品导出设置', duration: '12:15', isFree: false, isCompleted: false },
            ],
          },
        ],
      };

      setCourse(mockCourse);
    } catch (error) {
      console.error('获取课程详情失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handlePlayFreeLesson = (lesson: Lesson) => {
    Taro.navigateTo({
      url: `/pages/course-play/index?courseId=${course?.id}&lessonId=${lesson.id}`,
    });
  };

  const handleLockedLessonClick = () => {
    Taro.showModal({
      title: '提示',
      content: '该章节需要购买课程后才能观看',
      confirmText: '立即购买',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          handleBuy();
        }
      },
    });
  };

  const handleBuy = () => {
    if (!course) return;

    const finalPrice = calculateFinalPrice();
    const couponId = selectedCoupon?.id || '';

    Taro.navigateTo({
      url: `/pages/order/confirm?courseId=${course.id}&price=${finalPrice}&couponId=${couponId}`,
    });
  };

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '收藏成功',
      icon: 'success',
    });
  };

  const handleShowCoupons = () => {
    setShowCouponDialog(true);
  };

  const handleSelectCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
    setShowCouponDialog(false);

    if (coupon) {
      Taro.showToast({
        title: `已选择：${coupon.title}`,
        icon: 'success',
      });
    }
  };

  const calculateFinalPrice = () => {
    if (!course) return 0;

    let price = course.discountPrice || course.price;

    if (selectedCoupon) {
      if (selectedCoupon.type === 'cash') {
        // 现金券：直接减去金额
        price = Math.max(0, price - selectedCoupon.value);
      } else if (selectedCoupon.type === 'discount') {
        // 折扣券：按比例减价
        price = price * ((100 - selectedCoupon.value) / 100);
      }
    }

    return Math.round(price * 100) / 100; // 保留两位小数
  };

  const getAvailableCoupons = () => {
    if (!course) return [];

    const price = course.discountPrice || course.price;
    return availableCoupons.filter((coupon) => price >= coupon.minAmount);
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

  const displayedChapters = showAllChapters
    ? course?.chapters || []
    : course?.chapters.slice(0, 2) || [];

  if (loading || !course) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      <ScrollView scrollY className="flex-1">
        {/* 课程封面 */}
        <View className="relative">
          <Image
            className="w-full h-56"
            src={course.cover}
            mode="aspectFill"
          />
          <View className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <View className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play size={32} color="#FF6B35" className="ml-1" />
            </View>
          </View>
          <View className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-orange-500 text-white">
              {getCourseTypeLabel(course.type)}
            </Badge>
          </View>
        </View>

        {/* 课程基本信息 */}
        <View className="bg-white px-4 py-4">
          <Text className="block text-lg font-semibold text-gray-800 mb-2">
            {course.title}
          </Text>
          <View className="flex flex-row items-center mb-3">
            {course.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="mr-2 text-xs">
                {tag}
              </Badge>
            ))}
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-baseline">
              <Text className="block text-2xl font-bold text-orange-500">
                ¥{course.discountPrice || course.price}
              </Text>
              {course.originalPrice > course.price && (
                <Text className="block text-base text-gray-400 line-through ml-2">
                  ¥{course.originalPrice}
                </Text>
              )}
            </View>
            <View className="flex flex-row items-center">
              <View className="flex flex-row items-center mr-4">
                <Users size={14} color="#9CA3AF" />
                <Text className="block text-sm text-gray-500 ml-1">{course.students}人学习</Text>
              </View>
              <View className="flex flex-row items-center">
                <Star size={14} color="#F59E0B" />
                <Text className="block text-sm text-gray-500 ml-1">
                  {course.rating} ({course.reviews}条评价)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 讲师信息 */}
        <View className="bg-white mt-3 px-4 py-4">
          <View className="flex flex-row items-center">
            <Avatar className="w-12 h-12">
              <AvatarImage src={course.teacherAvatar} />
            </Avatar>
            <View className="ml-3 flex-1">
              <Text className="block text-base font-medium text-gray-800">{course.teacher}</Text>
              <Text className="block text-sm text-gray-500">金牌讲师</Text>
            </View>
            <Button variant="outline" size="sm" className="border-orange-500 text-orange-500">
              关注
            </Button>
          </View>
        </View>

        {/* Tab切换 */}
        <View className="bg-white mt-3 sticky top-0 z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="intro" className="flex-1">课程介绍</TabsTrigger>
              <TabsTrigger value="chapter" className="flex-1">目录</TabsTrigger>
              <TabsTrigger value="review" className="flex-1">评价</TabsTrigger>
            </TabsList>
          </Tabs>
        </View>

        {/* Tab内容 */}
        <View className="px-4 py-4">
          {activeTab === 'intro' && (
            <View>
              {/* 课程介绍 */}
              <View className="mb-4">
                <Text className="block text-base font-semibold text-gray-800 mb-2">课程介绍</Text>
                <Text className="block text-sm text-gray-600 whitespace-pre-line">
                  {course.description}
                </Text>
              </View>

              {/* 服务保障 */}
              <View className="mt-4">
                <Text className="block text-base font-semibold text-gray-800 mb-2">服务保障</Text>
                <View className="flex flex-row flex-wrap gap-3">
                  <View className="flex flex-row items-center">
                    <Shield size={16} color="#10B981" />
                    <Text className="block text-xs text-gray-600 ml-1">内容正版</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <Clock size={16} color="#10B981" />
                    <Text className="block text-xs text-gray-600 ml-1">永久有效</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <BookOpen size={16} color="#10B981" />
                    <Text className="block text-xs text-gray-600 ml-1">配套资料</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'chapter' && (
            <View>
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="block text-base font-semibold text-gray-800">
                  课程目录 ({course.chapters.length}章 {course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)}节)
                </Text>
              </View>

              {displayedChapters.map((chapter) => (
                <View key={chapter.id} className="mb-3">
                  <Card
                    className="overflow-hidden"
                    onClick={() => toggleChapter(chapter.id)}
                  >
                    <CardContent className="p-3 flex flex-row items-center justify-between">
                      <Text className="block text-sm font-medium text-gray-800 flex-1">
                        {chapter.title}
                      </Text>
                      {expandedChapters.includes(chapter.id) ? (
                        <ChevronUp size={16} color="#9CA3AF" />
                      ) : (
                        <ChevronDown size={16} color="#9CA3AF" />
                      )}
                    </CardContent>
                  </Card>

                  {expandedChapters.includes(chapter.id) && (
                    <View className="mt-1 bg-white rounded-lg">
                      {chapter.lessons.map((lesson, index) => (
                        <View key={lesson.id}>
                          <View className="flex flex-row items-center px-4 py-3">
                            <View className="flex-1 flex flex-row items-center">
                              <Text className="block text-sm text-gray-700 mr-3">
                                {lesson.title}
                              </Text>
                              {lesson.isFree && (
                                <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                                  试看
                                </Badge>
                              )}
                            </View>
                            <Text className="block text-xs text-gray-400 mr-3">
                              {lesson.duration}
                            </Text>
                            {lesson.isCompleted ? (
                              <CheckCheck size={16} color="#10B981" />
                            ) : lesson.isFree ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-500 text-orange-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayFreeLesson(lesson);
                                }}
                              >
                                播放
                              </Button>
                            ) : (
                              <View
                                className="w-4 h-4 flex items-center justify-center cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLockedLessonClick();
                                }}
                              >
                                <Text className="text-gray-400 text-xs">🔒</Text>
                              </View>
                            )}
                          </View>
                          {index < chapter.lessons.length - 1 && <Separator />}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {course.chapters.length > 2 && (
                <View className="mt-3 flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="border-gray-200 text-gray-600"
                    onClick={() => setShowAllChapters(!showAllChapters)}
                  >
                    {showAllChapters ? '收起' : `展开全部${course.chapters.length}章`}
                  </Button>
                </View>
              )}
            </View>
          )}

          {activeTab === 'review' && (
            <View className="flex flex-col items-center py-8">
              <Star size={48} color="#D1D5DB" />
              <Text className="block text-gray-400 mt-4">暂无评价</Text>
              <Text className="block text-sm text-gray-400 mt-1">购买后即可评价</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex flex-row items-center"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
      >
        <View className="flex flex-row items-center">
          <View
            className="flex flex-col items-center mr-4"
            onClick={handleShare}
          >
            <Share size={22} color="#6B7280" />
            <Text className="block text-xs text-gray-500 mt-1">分享</Text>
          </View>
          <View
            className="flex flex-col items-center"
            onClick={handleFavorite}
          >
            <Heart size={22} color={isFavorite ? '#EF4444' : '#6B7280'} />
            <Text className="block text-xs text-gray-500 mt-1">收藏</Text>
          </View>
        </View>
        <View className="flex-1 ml-4 flex flex-col gap-2">
          {/* 优惠券选择 */}
          {getAvailableCoupons().length > 0 && (
            <View
              className="flex flex-row items-center justify-between bg-orange-50 px-3 py-2 rounded-lg"
              onClick={handleShowCoupons}
            >
              <View className="flex flex-row items-center">
                <Ticket size={16} color="#FF6B35" />
                <Text className="block text-xs text-gray-600 ml-2">
                  {selectedCoupon ? selectedCoupon.title : '选择优惠券'}
                </Text>
                {selectedCoupon && (
                  <Badge variant="secondary" className="bg-orange-500 text-white ml-2">
                    已选
                  </Badge>
                )}
              </View>
              <Text className="block text-xs text-orange-500">
                {getAvailableCoupons().length}张可用
              </Text>
            </View>
          )}

          {/* 购买按钮 */}
          <View className="flex flex-row gap-2">
            {selectedCoupon && (
              <Text className="text-sm text-gray-400 line-through mt-2">
                ¥{course.discountPrice || course.price}
              </Text>
            )}
            <Button
              variant="outline"
              className="flex-1 border-orange-500 text-orange-500"
              onClick={handleBuy}
            >
              ¥{calculateFinalPrice()} 立即购买
            </Button>
          </View>
        </View>
      </View>

      {/* 优惠券选择弹窗 */}
      <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
        <DialogContent>
          <DialogTitle>选择优惠券</DialogTitle>
          <ScrollView scrollY className="max-h-80 mt-4">
            <View className="flex flex-col gap-3">
              {/* 不使用优惠券选项 */}
              <Card
                className={`overflow-hidden cursor-pointer ${
                  selectedCoupon === null ? 'border-2 border-orange-500' : ''
                }`}
                onClick={() => handleSelectCoupon(null)}
              >
                <CardContent className="p-4">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center">
                      <Text className="block text-sm font-medium text-gray-800">
                        不使用优惠券
                      </Text>
                    </View>
                    {selectedCoupon === null && (
                      <Badge variant="secondary" className="bg-orange-500 text-white">
                        已选
                      </Badge>
                    )}
                  </View>
                </CardContent>
              </Card>

              {/* 优惠券列表 */}
              {getAvailableCoupons().map((coupon) => (
                <Card
                  key={coupon.id}
                  className={`overflow-hidden cursor-pointer ${
                    selectedCoupon?.id === coupon.id ? 'border-2 border-orange-500' : ''
                  }`}
                  onClick={() => handleSelectCoupon(coupon)}
                >
                  <CardContent className="p-4">
                    <View className="flex flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex flex-row items-center mb-1">
                          <Text className="block text-sm font-medium text-gray-800">
                            {coupon.title}
                          </Text>
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-600 ml-2"
                          >
                            {coupon.type === 'cash'
                              ? `¥${coupon.value}`
                              : `${coupon.value}折`}
                          </Badge>
                        </View>
                        <Text className="block text-xs text-gray-500">
                          满¥{coupon.minAmount}可用
                        </Text>
                        <Text className="block text-xs text-gray-400 mt-1">
                          有效期至：{coupon.validUntil}
                        </Text>
                      </View>
                      {selectedCoupon?.id === coupon.id && (
                        <Badge variant="secondary" className="bg-orange-500 text-white">
                          已选
                        </Badge>
                      )}
                    </View>
                  </CardContent>
                </Card>
              ))}

              {getAvailableCoupons().length === 0 && (
                <View className="flex flex-col items-center py-8">
                  <Ticket size={48} color="#D1D5DB" />
                  <Text className="block text-gray-400 mt-2">暂无可用优惠券</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default CoursePage;
