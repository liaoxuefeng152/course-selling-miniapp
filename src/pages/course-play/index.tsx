import { View, Text, ScrollView, Video } from '@tarojs/components';
import { useState, useEffect, useRef } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Maximize2,
  CircleCheck,
  Circle,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 章节类型定义
interface Lesson {
  id: number;
  title: string;
  duration: string;
  isFree: boolean;
  isCompleted: boolean;
  type: 'video' | 'audio' | 'text';
  contentUrl?: string;
}

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
  chapters: Chapter[];
}

const CoursePlayPage = () => {
  const router = useRouter();
  const { id, lessonId } = router.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef<any>(null);

  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (lessonId) {
      navigateToLesson(Number(lessonId));
    }
  }, [lessonId, course]);

  const fetchCourseData = async () => {
    try {
      // 模拟数据
      const mockCourse: Course = {
        id: Number(id) || 1,
        title: '短视频剪辑实战课：从入门到精通',
        cover: 'https://picsum.photos/seed/course1/400/300',
        teacher: '张老师',
        chapters: [
          {
            id: 1,
            title: '第一章：剪辑基础入门',
            lessons: [
              {
                id: 1,
                title: '1.1 剪辑软件安装与配置',
                duration: '15:30',
                isFree: true,
                isCompleted: true,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
              {
                id: 2,
                title: '1.2 界面介绍与基础操作',
                duration: '20:45',
                isFree: false,
                isCompleted: true,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
              {
                id: 3,
                title: '1.3 时间线与轨道管理',
                duration: '18:20',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
            ],
          },
          {
            id: 2,
            title: '第二章：剪辑技巧进阶',
            lessons: [
              {
                id: 4,
                title: '2.1 转场效果应用',
                duration: '22:10',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
              {
                id: 5,
                title: '2.2 音频处理与配乐',
                duration: '25:00',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
              {
                id: 6,
                title: '2.3 字幕添加与样式',
                duration: '19:30',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
            ],
          },
          {
            id: 3,
            title: '第三章：特效与调色',
            lessons: [
              {
                id: 7,
                title: '3.1 基础滤镜应用',
                duration: '16:45',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              },
              {
                id: 8,
                title: '3.2 色彩校正技巧',
                duration: '21:15',
                isFree: false,
                isCompleted: false,
                type: 'video',
                contentUrl: 'https://www.w3schools.com/html/movie.mp4',
              },
            ],
          },
        ],
      };

      setCourse(mockCourse);

      // 设置默认播放第一节课
      if (!lessonId && mockCourse.chapters.length > 0) {
        setCurrentLesson(mockCourse.chapters[0].lessons[0]);
        setCurrentChapterIndex(0);
        setCurrentLessonIndex(0);
      }
    } catch (error) {
      console.error('获取课程数据失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    }
  };

  const navigateToLesson = (targetLessonId: number) => {
    if (!course) return;

    for (let cIdx = 0; cIdx < course.chapters.length; cIdx++) {
      const chapter = course.chapters[cIdx];
      const lIdx = chapter.lessons.findIndex((l) => l.id === targetLessonId);
      if (lIdx !== -1) {
        setCurrentChapterIndex(cIdx);
        setCurrentLessonIndex(lIdx);
        setCurrentLesson(chapter.lessons[lIdx]);
        setProgress(0);
        setIsPlaying(false);
        return;
      }
    }
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

  const handlePrevLesson = () => {
    if (!course) return;

    // 如果当前章节有上一节课
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentLesson(course.chapters[currentChapterIndex].lessons[currentLessonIndex - 1]);
      setProgress(0);
      setIsPlaying(false);
    }
    // 如果当前章节是第一节课，尝试切换到上一章的最后一节课
    else if (currentChapterIndex > 0) {
      const prevChapter = course.chapters[currentChapterIndex - 1];
      const lastLessonIndex = prevChapter.lessons.length - 1;
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentLessonIndex(lastLessonIndex);
      setCurrentLesson(prevChapter.lessons[lastLessonIndex]);
      setProgress(0);
      setIsPlaying(false);
    } else {
      Taro.showToast({ title: '已经是第一节课了', icon: 'none' });
    }
  };

  const handleNextLesson = () => {
    if (!course) return;

    const currentChapter = course.chapters[currentChapterIndex];

    // 如果当前章节还有下一节课
    if (currentLessonIndex < currentChapter.lessons.length - 1) {
      // 标记当前节课为已完成
      const updatedCourse = { ...course };
      updatedCourse.chapters[currentChapterIndex].lessons[currentLessonIndex].isCompleted = true;
      setCourse(updatedCourse);

      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentLesson(currentChapter.lessons[currentLessonIndex + 1]);
      setProgress(0);
      setIsPlaying(false);
    }
    // 如果当前章节是最后一节课，尝试切换到下一章的第一节课
    else if (currentChapterIndex < course.chapters.length - 1) {
      // 标记当前节课为已完成
      const updatedCourse = { ...course };
      updatedCourse.chapters[currentChapterIndex].lessons[currentLessonIndex].isCompleted = true;
      setCourse(updatedCourse);

      const nextChapter = course.chapters[currentChapterIndex + 1];
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentLessonIndex(0);
      setCurrentLesson(nextChapter.lessons[0]);
      setProgress(0);
      setIsPlaying(false);
    } else {
      Taro.showToast({ title: '已经是最后一节课了', icon: 'success' });
    }
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedOptions(false);
    if (videoRef.current) {
      videoRef.current.playbackRate(rate);
    }
  };

  const handleProgressChange = (value: number) => {
    setProgress(value);
    if (videoRef.current) {
      const seekTime = (value / 100) * duration;
      videoRef.current.seek(seekTime);
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullScreen({
        direction: 90,
      });
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

  if (!course || !currentLesson) {
    return (
      <View className="flex items-center justify-center h-screen bg-gray-50">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    );
  }

  // 计算总体进度
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const completedLessons = course.chapters.reduce(
    (sum, ch) => sum + ch.lessons.filter((l) => l.isCompleted).length,
    0
  );
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <View className="h-screen flex flex-col bg-gray-50">
      {/* 视频播放区域 */}
      <View className="relative bg-black">
        <Video
          id={`video-${currentLesson.id}`}
          ref={videoRef}
          src={currentLesson.contentUrl || ''}
          className="w-full"
          style={{ height: 'calc(100vw * 9 / 16)' }}
          controls={false}
          autoplay={false}
          loop={false}
          muted={false}
          playBtnPosition="center"
          enablePlayGesture
          showCenterPlayBtn
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            // 自动播放下一节
            handleNextLesson();
          }}
        />

        {/* 播放控制层 */}
        <View className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent p-4">
          {/* 课程标题 */}
          <View className="flex-1" />

          {/* 进度条 */}
          <View className="mb-3">
            <View
              className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden cursor-pointer"
              onTouchStart={(e) => {
                const touch = (e as any).touches[0];
                const percent = (touch.x / 375) * 100; // 假设屏幕宽度为375
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
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={() => Taro.navigateBack()}
              >
                <View style={{ transform: 'rotate(180deg)' }}>
                  <SkipForward size={24} color="#FFFFFF" />
                </View>
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
                onClick={handleReplay}
              >
                <RotateCcw size={20} color="#FFFFFF" />
              </Button>
            </View>

            <View className="flex flex-row items-center gap-4">
              {/* 倍速选择 */}
              <View className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30"
                  onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                >
                  <Text className="text-xs font-medium">{playbackRate}x</Text>
                </Button>

                {showSpeedOptions && (
                  <View className="absolute bottom-10 right-0 bg-black bg-opacity-80 rounded-lg p-2 min-w-[80px]">
                    <ScrollView scrollY className="max-h-48">
                      {playbackRates.map((rate) => (
                        <View
                          key={rate}
                          className={`py-2 px-3 rounded mb-1 ${playbackRate === rate ? 'bg-orange-500' : ''}`}
                          onClick={() => handleSpeedChange(rate)}
                        >
                          <Text
                            className={`text-xs text-center ${playbackRate === rate ? 'text-white' : 'text-gray-300'}`}
                          >
                            {rate}x
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white hover:bg-opacity-20"
                onClick={handleFullScreen}
              >
                <Maximize2 size={20} color="#FFFFFF" />
              </Button>
            </View>
          </View>
        </View>
      </View>

      {/* 章节列表 */}
      <ScrollView scrollY className="flex-1">
        <View className="p-4">
          {/* 课程信息 */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-1">
                {course.title}
              </Text>
              <View className="flex flex-row items-center justify-between">
                <Text className="block text-sm text-gray-500">讲师: {course.teacher}</Text>
                <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                  学习进度 {overallProgress.toFixed(0)}%
                </Badge>
              </View>
            </CardContent>
          </Card>

          {/* 章节列表 */}
          <View className="flex flex-col gap-3">
            {course.chapters.map((chapter, cIndex) => (
              <Card
                key={chapter.id}
                className={`${
                  cIndex === currentChapterIndex ? 'border-orange-500 border-2' : ''
                }`}
              >
                <CardContent className="p-4">
                  <Text className="block text-sm font-medium text-gray-800 mb-3">
                    {chapter.title}
                  </Text>
                  <View className="flex flex-col gap-2">
                    {chapter.lessons.map((lesson) => (
                      <View
                        key={lesson.id}
                        className={`flex flex-row items-center p-3 rounded-lg cursor-pointer ${
                          currentLesson.id === lesson.id ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                        }`}
                        onClick={() => navigateToLesson(lesson.id)}
                      >
                        <View className="flex-shrink-0 mr-3">
                          {lesson.isCompleted ? (
                            <CircleCheck size={20} color="#10B981" />
                          ) : (
                            <Circle size={20} color="#9CA3AF" />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text
                            className={`text-sm ${
                              currentLesson.id === lesson.id ? 'text-orange-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {lesson.title}
                          </Text>
                        </View>
                        <View className="flex flex-row items-center gap-2 flex-shrink-0">
                          {lesson.isFree && (
                            <Badge variant="secondary" className="bg-green-100 text-green-600 text-xs">
                              免费
                            </Badge>
                          )}
                          <Text className="text-xs text-gray-400">{lesson.duration}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
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
        <Button
          variant="outline"
          className="flex-1 border-gray-300 text-gray-600"
          onClick={handlePrevLesson}
        >
          <SkipBack size={18} color="#4B5563" className="mr-2" />
          上一节
        </Button>
        <Button
          variant="default"
          className="flex-1 bg-orange-500 text-white"
          onClick={handleNextLesson}
        >
          下一节
          <SkipForward size={18} color="#FFFFFF" className="ml-2" />
        </Button>
      </View>
    </View>
  );
};

export default CoursePlayPage;
