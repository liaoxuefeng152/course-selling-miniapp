import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import {
  Heart,
  Share2,
  Users,
  MessageSquare,
  Mic,
  ArrowLeft,
  EllipsisVertical,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  likes: number;
  isFollowed: boolean;
  description: string;
}

// 评论类型定义
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

// 关联课程类型定义
interface Course {
  id: number;
  title: string;
  cover: string;
  price: number;
  originalPrice?: number;
}

const LiveDetailPage = () => {
  const router = useRouter();
  const { id } = router.params;

  const [live, setLive] = useState<Live | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmittingMic, setIsSubmittingMic] = useState(false);

  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    fetchLiveDetail();
    fetchComments();
  }, [id]);

  const fetchLiveDetail = async () => {
    try {
      // 模拟数据
      const mockLive: Live = {
        id: Number(id) || 1,
        title: '抖音直播带货实战分享',
        cover: 'https://picsum.photos/seed/live-detail/400/300',
        teacher: '刘老师',
        teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
        startTime: '2024-01-15 20:00',
        status: 'live',
        viewers: 2341,
        likes: 15678,
        isFollowed: false,
        description:
          '本次直播将分享抖音直播带货的核心技巧，包括选品策略、话术设计、流量获取等内容，帮助新手快速上手直播带货。',
      };

      setLive(mockLive);
      setLikeCount(mockLive.likes);
    } catch (error) {
      console.error('获取直播详情失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    }
  };

  const fetchComments = async () => {
    try {
      // 模拟数据
      const mockComments: Comment[] = [
        {
          id: '1',
          userId: 'u001',
          userName: '小明',
          userAvatar: 'https://i.pravatar.cc/100?img=1',
          content: '老师讲得太好了，学到了很多！',
          createdAt: '20:15',
        },
        {
          id: '2',
          userId: 'u002',
          userName: '小红',
          userAvatar: 'https://i.pravatar.cc/100?img=2',
          content: '请问新手刚开始做直播需要注意什么？',
          createdAt: '20:18',
        },
        {
          id: '3',
          userId: 'u003',
          userName: '张三',
          userAvatar: 'https://i.pravatar.cc/100?img=3',
          content: '这个技巧太实用了，感谢老师分享',
          createdAt: '20:20',
        },
        {
          id: '4',
          userId: 'u004',
          userName: '李四',
          userAvatar: 'https://i.pravatar.cc/100?img=4',
          content: '我想了解一下选品的具体策略',
          createdAt: '20:22',
        },
        {
          id: '5',
          userId: 'u005',
          userName: '王五',
          userAvatar: 'https://i.pravatar.cc/100?img=5',
          content: '老师可以再讲一下流量获取的方法吗',
          createdAt: '20:25',
        },
      ];

      setComments(mockComments);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  // 关联课程数据
  const relatedCourses: Course[] = [
    {
      id: 1,
      title: '抖音带货必修课',
      cover: 'https://picsum.photos/seed/course1/200/200',
      price: 199,
      originalPrice: 399,
    },
    {
      id: 2,
      title: '直播话术精讲',
      cover: 'https://picsum.photos/seed/course2/200/200',
      price: 99,
      originalPrice: 199,
    },
  ];

  const handleFollow = () => {
    if (!live) return;

    setLive({
      ...live,
      isFollowed: !live.isFollowed,
    });

    Taro.showToast({
      title: live.isFollowed ? '已取消关注' : '关注成功',
      icon: 'success',
    });
  };

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (!isLiked) {
      Taro.vibrateShort();
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim()) {
      Taro.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current',
      userName: '我',
      userAvatar: 'https://i.pravatar.cc/100?img=100',
      content: commentText,
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    setComments([...comments, newComment]);
    setCommentText('');

    // 滚动到底部
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    Taro.showToast({ title: '发送成功', icon: 'success' });
  };

  const handleMicRequest = () => {
    if (isSubmittingMic) return;

    setIsSubmittingMic(true);

    Taro.showModal({
      title: '申请连麦',
      content: '确定要申请与讲师连麦吗？讲师将通过后将通知您。',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '连麦申请已发送',
            icon: 'success',
          });
        }
        setIsSubmittingMic(false);
      },
      fail: () => {
        setIsSubmittingMic(false);
      },
    });
  };

  const handleBuyCourse = (courseId: number) => {
    const course = relatedCourses.find((c) => c.id === courseId);
    if (!course) return;

    Taro.navigateTo({
      url: `/pages/order/confirm?courseId=${courseId}&price=${course.price}`,
    });
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  if (!live) {
    return (
      <View className="flex items-center justify-center h-screen bg-gray-50">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    );
  }

  const isLive = live.status === 'live';
  const isUpcoming = live.status === 'upcoming';

  return (
    <View className="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航栏 */}
      <View
        style={{
          position: 'fixed',
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
          <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </Button>
          <Text className="text-white text-sm font-medium ml-2 line-clamp-1" style={{ maxWidth: '200px' }}>
            {live.title}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-3">
          <View className="flex flex-row items-center bg-black bg-opacity-30 rounded-full px-2 py-1">
            <Users size={14} color="#FFFFFF" />
            <Text className="text-white text-xs ml-1">{live.viewers}</Text>
          </View>

          <Button variant="ghost" size="icon" className="text-white">
            <EllipsisVertical size={24} color="#FFFFFF" />
          </Button>
        </View>
      </View>

      {/* 直播画面区域 */}
      <View className="relative bg-black">
        {/* 占位视频区域 */}
        <View
          style={{
            width: '100%',
            height: 'calc(100vw * 9 / 16)',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLive && (
            <View className="flex flex-col items-center">
              <Image
                className="w-full h-full"
                src={live.cover}
                mode="aspectFill"
              />
              <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded">
                <View className="flex flex-row items-center gap-1">
                  <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <Text className="text-white text-xs font-medium">直播中</Text>
                </View>
              </View>
            </View>
          )}

          {isUpcoming && (
            <View className="flex flex-col items-center">
              <Image
                className="w-full h-full opacity-50"
                src={live.cover}
                mode="aspectFill"
              />
              <View className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <Badge variant="secondary" className="bg-amber-500 text-white mb-2 px-3 py-1">
                  即将开始
                </Badge>
                <Text className="text-white text-lg font-medium">{live.startTime}</Text>
              </View>
            </View>
          )}

          {!isLive && !isUpcoming && (
            <View className="flex flex-col items-center">
              <Image
                className="w-full h-full"
                src={live.cover}
                mode="aspectFill"
              />
              <View className="absolute top-3 left-3 bg-gray-600 px-2 py-1 rounded">
                <Text className="text-white text-xs font-medium">回放</Text>
              </View>
            </View>
          )}
        </View>

        {/* 点赞按钮 */}
        <View className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white bg-opacity-20 rounded-full p-3"
            onClick={handleLike}
          >
            <Heart
              size={32}
              color={isLiked ? '#FF6B35' : '#FFFFFF'}
              filled={isLiked}
            />
          </Button>
          <Text className="text-white text-xs text-center mt-1">{likeCount}</Text>
        </View>
      </View>

      {/* 讲师信息 */}
      <View className="bg-white px-4 py-3">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage src={live.teacherAvatar} />
            </Avatar>
            <View className="ml-3 flex-1">
              <Text className="block text-sm font-medium text-gray-800">{live.teacher}</Text>
              <Text className="block text-xs text-gray-500 line-clamp-1 mt-1">
                {live.description}
              </Text>
            </View>
          </View>

          <View className="flex flex-row gap-2">
            <Button
              variant={live.isFollowed ? 'outline' : 'default'}
              size="sm"
              className={
                live.isFollowed
                  ? 'border-orange-500 text-orange-500'
                  : 'bg-orange-500 text-white'
              }
              onClick={handleFollow}
            >
              {live.isFollowed ? '已关注' : '关注'}
            </Button>
            <Button variant="outline" size="icon" className="border-gray-300" onClick={handleShare}>
              <Share2 size={18} color="#9CA3AF" />
            </Button>
          </View>
        </View>
      </View>

      {/* 功能切换 */}
      <View className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="comments" className="flex-1">
              评论 ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex-1">
              课程 ({relatedCourses.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* 评论区域 */}
      {activeTab === 'comments' && (
        <ScrollView scrollY ref={scrollViewRef} className="px-4 py-4" style={{ height: 'calc(100vh - 400px)' }}>
          <View className="flex flex-col gap-3">
            {comments.map((comment) => (
              <View key={comment.id} className="flex flex-row items-start">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={comment.userAvatar} />
                </Avatar>
                <View className="ml-3 flex-1">
                  <View className="flex flex-row items-center mb-1">
                    <Text className="text-sm font-medium text-gray-800">{comment.userName}</Text>
                    <Text className="text-xs text-gray-400 ml-2">{comment.createdAt}</Text>
                  </View>
                  <Text className="text-sm text-gray-600">{comment.content}</Text>
                </View>
              </View>
            ))}

            {comments.length === 0 && (
              <View className="flex flex-col items-center justify-center py-10">
                <MessageSquare size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-2">暂无评论</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* 课程区域 */}
      {activeTab === 'courses' && (
        <ScrollView scrollY className="px-4 py-4" style={{ height: 'calc(100vh - 400px)' }}>
          <View className="flex flex-col gap-3">
            {relatedCourses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-3">
                  <View className="flex flex-row">
                    <Image
                      className="w-20 h-20 rounded-lg"
                      src={course.cover}
                      mode="aspectFill"
                    />
                    <View className="ml-3 flex-1 flex flex-col justify-between">
                      <View>
                        <Text className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                          {course.title}
                        </Text>
                        <View className="flex flex-row items-baseline">
                          <Text className="text-lg font-bold text-orange-500">
                            ¥{course.price}
                          </Text>
                          {course.originalPrice && course.originalPrice > course.price && (
                            <Text className="text-sm text-gray-400 line-through ml-2">
                              ¥{course.originalPrice}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-orange-500 text-white w-full mt-2"
                        onClick={() => handleBuyCourse(course.id)}
                      >
                        立即购买
                      </Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 底部互动栏 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e5e5',
          padding: '12px',
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          zIndex: 100,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <MessageSquare size={16} color="#9CA3AF" />
          <Input
            className="ml-2"
            placeholder="说点什么..."
            value={commentText}
            onInput={(e) => setCommentText(e.detail.value)}
          />
        </View>

        {isLive && (
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-500"
            onClick={handleMicRequest}
            disabled={isSubmittingMic}
          >
            <Mic size={16} color="#8B5CF6" className="mr-1" />
            连麦
          </Button>
        )}

        <Button
          variant="default"
          size="sm"
          className="bg-orange-500 text-white"
          onClick={handleSendComment}
        >
          发送
        </Button>
      </View>
    </View>
  );
};

export default LiveDetailPage;
