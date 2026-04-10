import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import {
  Video as VideoIcon,
  Users,
  X,
  Send,
  ShoppingBag,
  Gift,
  Phone,
  CircleDot,
} from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Network } from '@/network';

interface LiveDashboardData {
  live: {
    id: number;
    title: string;
    cover: string;
    status: 'live' | 'ended';
    viewers: number;
    duration: number;
    platforms: string[];
  };
  comments: Array<{
    id: number;
    user: string;
    avatar: string;
    content: string;
    time: string;
  }>;
  requests: Array<{
    id: number;
    user: string;
    avatar: string;
  }>;
  mountedCourses: Array<{
    id: number;
    title: string;
    price: number;
    cover: string;
  }>;
  coupons: Array<{
    id: number;
    title: string;
    value: number;
  }>;
}

const InstructorLiveDashboardPage = () => {
  const router = useRouter();
  const { id } = router.params;

  const [dashboardData, setDashboardData] = useState<LiveDashboardData | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showCouponSelector, setShowCouponSelector] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const fetchDashboardData = async () => {
    try {
      const res = await Network.request({
        url: `/api/live/${id}/dashboard`,
        method: 'GET',
      });

      if (res.data?.code === 200) {
        setDashboardData(res.data.data);
      }
    } catch (error) {
      console.error('获取中控台数据失败:', error);
      // 使用模拟数据
      const mockData: LiveDashboardData = {
        live: {
          id: Number(id),
          title: '抖音直播带货实战分享',
          cover: 'https://picsum.photos/seed/live1/400/300',
          status: 'live',
          viewers: 1234,
          duration: 1800,
          platforms: ['douyin', 'wechat'],
        },
        comments: [
          {
            id: 1,
            user: '学员A',
            avatar: 'https://picsum.photos/seed/user1/100/100',
            content: '老师讲得太好了！',
            time: '10:23:45',
          },
          {
            id: 2,
            user: '学员B',
            avatar: 'https://picsum.photos/seed/user2/100/100',
            content: '什么时候讲直播话术？',
            time: '10:24:12',
          },
        ],
        requests: [
          {
            id: 1,
            user: '学员C',
            avatar: 'https://picsum.photos/seed/user3/100/100',
          },
        ],
        mountedCourses: [
          {
            id: 1,
            title: '短视频剪辑实战课',
            price: 299,
            cover: 'https://picsum.photos/seed/course1/200/200',
          },
          {
            id: 2,
            title: '直播话术精讲',
            price: 199,
            cover: 'https://picsum.photos/seed/course2/200/200',
          },
        ],
        coupons: [
          {
            id: 1,
            title: '新用户优惠',
            value: 50,
          },
          {
            id: 2,
            title: '满300减50',
            value: 50,
          },
        ],
      };
      setDashboardData(mockData);
    }
  };

  const handleEndLive = () => {
    Taro.showModal({
      title: '确认结束直播',
      content: '结束后将无法恢复，确定要结束直播吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await Network.request({
              url: `/api/live/${id}/end`,
              method: 'POST',
            });

            Taro.showToast({
              title: '直播已结束',
              icon: 'success',
            });

            setTimeout(() => {
              Taro.navigateBack();
            }, 1500);
          } catch (error) {
            console.error('结束直播失败:', error);
            Taro.showToast({
              title: '结束失败',
              icon: 'none',
            });
          }
        }
      },
    });
  };

  const handleSendComment = () => {
    if (!commentInput.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      user: '讲师',
      avatar: 'https://picsum.photos/seed/teacher/100/100',
      content: commentInput,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setDashboardData({
      ...dashboardData!,
      comments: [...dashboardData!.comments, newComment],
    });
    setCommentInput('');

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  const handleApproveRequest = (requestId: number) => {
    setDashboardData({
      ...dashboardData!,
      requests: dashboardData!.requests.filter((r) => r.id !== requestId),
    });

    Taro.showToast({
      title: '已同意连麦',
      icon: 'success',
    });
  };

  const handleRejectRequest = (requestId: number) => {
    setDashboardData({
      ...dashboardData!,
      requests: dashboardData!.requests.filter((r) => r.id !== requestId),
    });

    Taro.showToast({
      title: '已拒绝连麦',
      icon: 'success',
    });
  };

  const handleSendCoupon = (couponId: number) => {
    const coupon = dashboardData!.coupons.find((c) => c.id === couponId);
    if (coupon) {
      const newComment = {
        id: Date.now(),
        user: '系统',
        avatar: 'https://picsum.photos/seed/system/100/100',
        content: `🎁 讲师发放了【${coupon.title}】优惠券，立减${coupon.value}元！`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };

      setDashboardData({
        ...dashboardData!,
        comments: [...dashboardData!.comments, newComment],
      });

      setShowCouponSelector(false);

      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  };

  const handleRemoveMountedCourse = (courseId: number) => {
    setDashboardData({
      ...dashboardData!,
      mountedCourses: dashboardData!.mountedCourses.filter((c) => c.id !== courseId),
    });

    Taro.showToast({
      title: '课程已移除',
      icon: 'success',
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!dashboardData) {
    return (
      <View className="flex items-center justify-center h-screen bg-gray-900">
        <Text className="text-white">加载中...</Text>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-gray-900">
      {/* 顶部状态栏 */}
      <View
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '12px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View className="flex flex-row items-center">
          <CircleDot size={12} color="#22C55E" />
          <Text className="text-white text-sm ml-2">直播中</Text>
        </View>
        <View className="flex flex-row items-center">
          <View className="flex flex-row items-center mr-3">
            <Users size={16} color="#FFFFFF" />
            <Text className="text-white text-sm ml-1">{dashboardData.live.viewers}</Text>
          </View>
          <View className="flex flex-row items-center mr-3">
            <VideoIcon size={16} color="#FFFFFF" />
            <Text className="text-white text-sm ml-1">{formatDuration(dashboardData.live.duration)}</Text>
          </View>
          <Button
            size="sm"
            className="bg-red-500 text-white"
            onClick={handleEndLive}
          >
            结束直播
          </Button>
        </View>
      </View>

      {/* 直播画面 */}
      <View className="relative bg-black" style={{ height: '56.25vw' }}>
        <Image
          className="w-full h-full"
          src={dashboardData.live.cover}
          mode="aspectFill"
        />
        <View className="absolute bottom-3 left-3 px-2 py-1 bg-black bg-opacity-50 rounded">
          <Text className="text-white text-xs">
            {dashboardData.live.platforms.join('、').replace('douyin', '抖音').replace('wechat', '视频号')}
          </Text>
        </View>
      </View>

      {/* 主内容区 */}
      <View className="flex flex-row" style={{ minHeight: 'calc(100vh - 56.25vw - 60px)' }}>
        {/* 左侧：互动区域 */}
        <View className="flex-1 flex flex-col" style={{ width: '60%' }}>
          {/* 连麦申请 */}
          {dashboardData.requests.length > 0 && (
            <Card className="m-2">
              <CardContent className="p-3">
                <Text className="text-white text-sm font-medium mb-2">连麦申请 ({dashboardData.requests.length})</Text>
                <ScrollView scrollY className="flex-1" style={{ maxHeight: '120px' }}>
                  <View className="flex flex-col gap-2">
                    {dashboardData.requests.map((request) => (
                      <View
                        key={request.id}
                        className="bg-gray-800 rounded-lg p-2 flex flex-row items-center justify-between"
                      >
                        <View className="flex flex-row items-center">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={request.avatar} />
                          </Avatar>
                          <Text className="text-white text-sm ml-2">{request.user}</Text>
                        </View>
                        <View className="flex flex-row gap-2">
                          <Button size="sm" className="bg-green-500 text-white px-3" onClick={() => handleApproveRequest(request.id)}>
                            <Phone size={12} color="#FFFFFF" />
                            <Text className="ml-1">同意</Text>
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 px-3" onClick={() => handleRejectRequest(request.id)}>
                            <X size={12} color="#EF4444" />
                            <Text className="ml-1">拒绝</Text>
                          </Button>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </CardContent>
            </Card>
          )}

          {/* 评论区域 */}
          <Card className="flex-1 m-2">
            <CardContent className="p-3">
              <Text className="text-white text-sm font-medium mb-2">实时评论</Text>
              <ScrollView scrollY ref={scrollViewRef} className="flex-1" style={{ maxHeight: '200px' }}>
                <View className="flex flex-col gap-2">
                  {dashboardData.comments.map((comment) => (
                    <View key={comment.id} className="flex flex-row items-start">
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={comment.avatar} />
                      </Avatar>
                      <View className="ml-2 flex-1">
                        <View className="flex flex-row items-center mb-1">
                          <Text className="text-white text-xs font-medium">{comment.user}</Text>
                          <Text className="text-gray-400 text-xs ml-2">{comment.time}</Text>
                        </View>
                        <Text className="text-gray-300 text-sm">{comment.content}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View className="mt-2 flex flex-row gap-2">
                <View className="flex-1">
                  <Input
                    className="bg-gray-800 text-white"
                    placeholder="输入评论"
                    value={commentInput}
                    onInput={(e) => setCommentInput(e.detail.value)}
                    placeholderClass="text-gray-400"
                  />
                </View>
                <Button size="sm" className="bg-orange-500" onClick={handleSendComment}>
                  <Send size={16} color="#FFFFFF" />
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 右侧：课程挂载区域 */}
        <View className="flex-1 p-2" style={{ width: '40%' }}>
          <Card className="h-full">
            <CardContent className="p-3">
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="text-white text-sm font-medium">挂载课程</Text>
                <Button size="sm" onClick={() => setShowCouponSelector(true)}>
                  <Gift size={14} color="#FFFFFF" />
                  <Text className="ml-1 text-white">发券</Text>
                </Button>
              </View>

              {dashboardData.mountedCourses.length === 0 ? (
                <View className="text-center py-8">
                  <ShoppingBag size={32} color="#6B7280" />
                  <Text className="text-gray-400 text-sm mt-2">暂无挂载课程</Text>
                </View>
              ) : (
                <ScrollView scrollY className="flex-1" style={{ maxHeight: 'calc(100vh - 56.25vw - 150px)' }}>
                  <View className="flex flex-col gap-3">
                    {dashboardData.mountedCourses.map((course) => (
                      <View key={course.id} className="bg-gray-800 rounded-lg p-2">
                        <Image
                          className="w-full h-20 rounded-lg mb-2"
                          src={course.cover}
                          mode="aspectFill"
                        />
                        <Text className="text-white text-xs line-clamp-2 mb-1">{course.title}</Text>
                        <View className="flex flex-row items-center justify-between">
                          <Text className="text-orange-500 font-bold text-sm">¥{course.price}</Text>
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveMountedCourse(course.id)}>
                            <X size={14} color="#EF4444" />
                          </Button>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </CardContent>
          </Card>
        </View>
      </View>

      {/* 优惠券选择弹窗 */}
      {showCouponSelector && (
        <View className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-4/5 max-w-md">
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold">选择优惠券</Text>
                <Button size="icon" variant="ghost" onClick={() => setShowCouponSelector(false)}>
                  <X size={24} color="#6B7280" />
                </Button>
              </View>
              <ScrollView scrollY className="flex-1" style={{ maxHeight: '300px' }}>
                <View className="flex flex-col gap-2">
                  {dashboardData.coupons.map((coupon) => (
                    <View
                      key={coupon.id}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-3"
                      onClick={() => handleSendCoupon(coupon.id)}
                    >
                      <Text className="text-orange-600 font-medium">{coupon.title}</Text>
                      <Text className="text-orange-500 text-sm mt-1">立减{coupon.value}元</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </CardContent>
          </Card>
        </View>
      )}
    </View>
  );
};

export default InstructorLiveDashboardPage;
