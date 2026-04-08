import { View, Text, Image, ScrollView, Video } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import {
  Heart,
  Share2,
  Users,
  MessageSquare,
  Mic,
  ArrowLeft,
  EllipsisVertical,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
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
  isReserved: boolean;
  description: string;
  videoUrl?: string; // 回放视频地址
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // 图片加载失败状态
  const [coverLoadError, setCoverLoadError] = useState(false);
  const [teacherAvatarLoadError, setTeacherAvatarLoadError] = useState(false);

  const scrollViewRef = useRef<any>(null);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    // 重置图片加载状态
    setCoverLoadError(false);
    setTeacherAvatarLoadError(false);
    fetchLiveDetail();
    fetchComments();
  }, [id]);

  const fetchLiveDetail = async () => {
    try {
      // 根据 id 模拟不同状态的直播
      const liveId = Number(id) || 1;
      let mockLive: Live;

      if (liveId === 1) {
        // 即将开始的直播
        mockLive = {
          id: 1,
          title: '抖音直播带货实战分享',
          cover: 'https://picsum.photos/seed/live-upcoming/400/300',
          teacher: '刘老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100',
          startTime: '今晚 20:00',
          status: 'upcoming',
          viewers: 0,
          likes: 0,
          isFollowed: false,
          isReserved: false,
          description:
            '本次直播将分享抖音直播带货的核心技巧，包括选品策略、话术设计、流量获取等内容，帮助新手快速上手直播带货。',
        };
      } else if (liveId === 4) {
        // 回放直播
        mockLive = {
          id: 4,
          title: '职场沟通技巧提升训练营',
          cover: 'https://picsum.photos/seed/live-replay/400/300',
          teacher: '李老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher4/100/100',
          startTime: '2024-01-15 20:00',
          status: 'replay',
          viewers: 5678,
          likes: 12345,
          isFollowed: false,
          isReserved: false,
          description:
            '本次直播分享了职场沟通的核心技巧，包括向上沟通、平级沟通、向下沟通等方面的内容。',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        };
      } else {
        // 正在直播
        mockLive = {
          id: 2,
          title: '2024年考研备考规划指导',
          cover: 'https://picsum.photos/seed/live-detail/400/300',
          teacher: '周老师',
          teacherAvatar: 'https://picsum.photos/seed/teacher2/100/100',
          startTime: '正在直播',
          status: 'live',
          viewers: 2341,
          likes: 15678,
          isFollowed: false,
          isReserved: false,
          description:
            '本次直播将指导2024年考研的备考规划，包括科目复习、时间安排、心态调整等内容。',
        };
      }

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
    // 检测是否在小程序环境
    const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP;

    if (isWeapp) {
      // 小程序环境：使用分享面板
      Taro.showShareMenu({
        withShareTicket: true,
        showShareItems: ['shareAppMessage', 'shareTimeline'],
      });
    } else {
      // H5环境：复制链接
      Taro.setClipboardData({
        data: `${window.location.origin}/pages/live-detail/index?id=${live?.id}`,
        success: () => {
          Taro.showToast({
            title: '链接已复制，可分享给好友',
            icon: 'success',
          });
        },
        fail: () => {
          Taro.showToast({
            title: '复制失败',
            icon: 'none',
          });
        },
      });
    }
  };

  // 添加分享配置（小程序）
  useShareAppMessage(() => {
    if (!live) return {};
    return {
      title: live.title,
      path: `/pages/live-detail/index?id=${live.id}`,
      imageUrl: live.cover,
    };
  });

  useShareTimeline(() => {
    if (!live) return {};
    return {
      title: live.title,
      imageUrl: live.cover,
    };
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (!isLiked) {
      Taro.vibrateShort();
    }
  };

  const handleReserve = () => {
    if (!live) return;

    setLive({
      ...live,
      isReserved: !live.isReserved,
    });

    Taro.showToast({
      title: live.isReserved ? '已取消预约' : '预约成功，开播前将提醒您',
      icon: 'success',
    });
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
      setProgress(0);
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const handleTimeUpdate = (e: any) => {
    const { currentTime: time, duration: dur } = e.detail;
    setCurrentTime(time);
    setDuration(dur);
    if (dur > 0) {
      setProgress((time / dur) * 100);
    }
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);
    if (videoRef.current) {
      const seekTime = (value / 100) * duration;
      videoRef.current.seek(seekTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  const isReplay = live.status === 'replay';

  return (
    <View className={`min-h-screen bg-gray-50 ${!isUpcoming ? 'pb-32' : ''}`}>
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
      <View className="relative bg-black w-full" style={{ height: '56.25vw' }}>
        {/* 直播中 */}
        {isLive && (
          <View className="w-full h-full relative">
            <Image
              className="w-full h-full"
              src={coverLoadError ? 'https://via.placeholder.com/800x450/FF6B35/FFFFFF?text=Live' : live.cover}
              mode="aspectFill"
              onError={() => setCoverLoadError(true)}
            />
            <View className="absolute top-3 left-3 bg-red-500 px-2 py-1 rounded">
              <View className="flex flex-row items-center gap-1">
                <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <Text className="text-white text-xs font-medium">直播中</Text>
              </View>
            </View>
          </View>
        )}

        {/* 即将开始 */}
        {isUpcoming && (
          <View className="w-full h-full relative">
            <Image
              className="w-full h-full opacity-50"
              src={coverLoadError ? 'https://via.placeholder.com/800x450/FF6B35/FFFFFF?text=Upcoming' : live.cover}
              mode="aspectFill"
              onError={() => setCoverLoadError(true)}
            />
            <View className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
              <Badge variant="secondary" className="bg-amber-500 text-white mb-2 px-3 py-1">
                即将开始
              </Badge>
              <Text className="text-white text-lg font-medium mb-4">{live.startTime}</Text>
              <Button
                variant={live.isReserved ? 'outline' : 'default'}
                className={
                  live.isReserved
                    ? 'border-green-500 text-green-500 px-8'
                    : 'bg-orange-500 text-white px-8'
                }
                onClick={handleReserve}
              >
                {live.isReserved ? '已预约' : '立即预约'}
              </Button>
            </View>
          </View>
        )}

        {/* 回放 */}
        {isReplay && (
          <View className="w-full h-full relative">
            <Video
              id={`video-${live.id}`}
              ref={videoRef}
              src={live.videoUrl || ''}
              className="w-full h-full"
              controls={false}
              autoplay={false}
              loop={false}
              muted={false}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <View className="absolute top-3 left-3 bg-gray-600 px-2 py-1 rounded">
              <Text className="text-white text-xs font-medium">回放</Text>
            </View>

            {/* 回放控制层 */}
            <View className="absolute inset-0 flex flex-col justify-end p-4" style={{ zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 100%)' }}>
              {/* 进度条 */}
              <View className="mb-3">
                <View
                  className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden cursor-pointer"
                  onTouchStart={(e) => {
                    const touch = (e as any).touches[0];
                    const percent = (touch.x / 375) * 100;
                    handleProgressChange(Math.min(100, Math.max(0, percent)));
                  }}
                >
                  <View
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </View>
                <View className="flex flex-row justify-between mt-1">
                  <Text className="text-white text-xs">{formatTime(currentTime)}</Text>
                  <Text className="text-white text-xs">{formatTime(duration)}</Text>
                </View>
              </View>

              {/* 控制按钮 */}
              <View className="flex flex-row items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={handleReplay}
                >
                  <RotateCcw size={20} color="#FFFFFF" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={32} color="#FFFFFF" />
                  ) : (
                    <Play size={32} color="#FFFFFF" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.requestFullScreen({
                        direction: 90,
                      });
                    }
                  }}
                >
                  <Maximize2 size={20} color="#FFFFFF" />
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* 点赞按钮（仅直播中显示） */}
        {isLive && (
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
        )}
      </View>

      {/* 讲师信息 */}
      <View className="bg-white px-4 py-3">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={teacherAvatarLoadError ? '' : live.teacherAvatar}
                onError={() => setTeacherAvatarLoadError(true)}
              />
            </Avatar>
            <View className="ml-3 flex-1">
              <Text className="block text-sm font-medium text-gray-800">{live.teacher}</Text>
              <Text className="block text-xs text-gray-500 line-clamp-1 mt-1">
                {live.description}
              </Text>
            </View>
          </View>

          <View className="flex flex-row gap-2">
            {/* 预约按钮（仅即将开始时显示） */}
            {isUpcoming && (
              <Button
                variant={live.isReserved ? 'outline' : 'default'}
                size="sm"
                className={
                  live.isReserved
                    ? 'border-green-500 text-green-500'
                    : 'bg-orange-500 text-white'
                }
                onClick={handleReserve}
              >
                {live.isReserved ? '已预约' : '预约'}
              </Button>
            )}

            {/* 关注按钮（直播中和回放时显示） */}
            {!isUpcoming && (
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
            )}

            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 flex flex-row items-center gap-1"
              onClick={handleShare}
            >
              <Share2 size={16} color="#9CA3AF" />
              <Text className="text-gray-500 text-xs">分享</Text>
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
                  <AvatarImage src={comment.userAvatar} onError={() => {}} />
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
                      onError={() => {}}
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

      {/* 底部互动栏（仅在直播中和回放时显示） */}
      {!isUpcoming && (
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
      )}
    </View>
  );
};

export default LiveDetailPage;
