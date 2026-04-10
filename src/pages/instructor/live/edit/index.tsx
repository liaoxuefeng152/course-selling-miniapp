import { View, Text, Image, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Calendar, Clock, Upload, Plus, X } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from '@/network';

interface Course {
  id: number;
  title: string;
  price: number;
  cover: string;
}

const InstructorLiveEditPage = () => {
  const router = useRouter();
  const { id } = router.params;
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['douyin']);
  const [startTime, setStartTime] = useState('');
  const [remindEnabled, setRemindEnabled] = useState(true);
  const [saveReplay, setSaveReplay] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchLiveDetail();
    }
    fetchAvailableCourses();
  }, [id]);

  const fetchLiveDetail = async () => {
    try {
      const res = await Network.request({
        url: `/api/live/${id}`,
        method: 'GET',
      });

      if (res.data?.code === 200 && res.data?.data) {
        const live = res.data.data;
        setTitle(live.title);
        setDescription(live.description || '');
        setCover(live.cover || '');
        setPlatforms(live.platforms || ['douyin']);
        setStartTime(live.startTime || '');
        setSelectedCourses(live.courses || []);
      }
    } catch (error) {
      console.error('获取直播详情失败:', error);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const res = await Network.request({
        url: '/api/courses',
        method: 'GET',
        data: { status: 'published' },
      });

      if (res.data?.code === 200) {
        setAvailableCourses(res.data.data?.list || []);
      }
    } catch (error) {
      console.error('获取课程列表失败:', error);
    }
  };

  const handleCoverUpload = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        setCover(tempFilePath);
      },
    });
  };

  const handlePlatformToggle = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleTimeChange = () => {
    Taro.showModal({
      title: '提示',
      content: '请在PC端创建直播来设置精确时间',
      showCancel: false,
    });
  };

  const handleAddCourse = (course: Course) => {
    if (selectedCourses.some((c) => c.id === course.id)) {
      Taro.showToast({
        title: '课程已添加',
        icon: 'none',
      });
      return;
    }

    if (selectedCourses.length >= 5) {
      Taro.showToast({
        title: '最多挂载5个课程',
        icon: 'none',
      });
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
    setShowCourseSelector(false);
  };

  const handleRemoveCourse = (courseId: number) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入直播主题', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      const res = await Network.request({
        url: isEdit ? `/api/live/${id}` : '/api/live',
        method: isEdit ? 'PUT' : 'POST',
        data: {
          title,
          description,
          cover,
          platforms,
          startTime,
          remindEnabled,
          saveReplay,
          courses: selectedCourses,
          status: 'draft',
        },
      });

      if (res.data?.code === 200) {
        Taro.showToast({
          title: '保存成功',
          icon: 'success',
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      }
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入直播主题', icon: 'none' });
      return;
    }

    if (!cover) {
      Taro.showToast({ title: '请上传直播封面', icon: 'none' });
      return;
    }

    if (platforms.length === 0) {
      Taro.showToast({ title: '请选择直播平台', icon: 'none' });
      return;
    }

    if (!startTime) {
      Taro.showToast({ title: '请设置直播时间', icon: 'none' });
      return;
    }

    setLoading(true);
    try {
      const res = await Network.request({
        url: isEdit ? `/api/live/${id}` : '/api/live',
        method: isEdit ? 'PUT' : 'POST',
        data: {
          title,
          description,
          cover,
          platforms,
          startTime,
          remindEnabled,
          saveReplay,
          courses: selectedCourses,
          status: 'upcoming',
        },
      });

      if (res.data?.code === 200) {
        Taro.showToast({
          title: '提交成功，审核中',
          icon: 'success',
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('提交失败:', error);
      Taro.showToast({ title: '提交失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      <ScrollView scrollY className="flex-1">
        {/* 直播主题 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播主题</Text>
            <Input
              className="w-full"
              placeholder="请输入直播主题"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              maxlength={50}
            />
          </CardContent>
        </Card>

        {/* 直播封面 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播封面</Text>
            <View
              className="relative bg-gray-100 rounded-xl overflow-hidden"
              style={{ height: '200px' }}
              onClick={handleCoverUpload}
            >
              {cover ? (
                <Image
                  className="w-full h-full"
                  src={cover}
                  mode="aspectFill"
                />
              ) : (
                <View className="flex flex-col items-center justify-center h-full">
                  <Upload size={40} color="#9CA3AF" />
                  <Text className="text-gray-400 text-sm mt-2">点击上传封面</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* 直播平台 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播平台</Text>
            <View className="flex flex-row gap-3">
              <Button
                variant={platforms.includes('douyin') ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handlePlatformToggle('douyin')}
              >
                <Text className={platforms.includes('douyin') ? 'text-white' : 'text-gray-700'}>
                  抖音
                </Text>
              </Button>
              <Button
                variant={platforms.includes('wechat') ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => handlePlatformToggle('wechat')}
              >
                <Text className={platforms.includes('wechat') ? 'text-white' : 'text-gray-700'}>
                  视频号
                </Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 直播时间 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播时间</Text>
            <View
              className="bg-gray-100 rounded-xl px-4 py-3 flex flex-row items-center"
              onClick={handleTimeChange}
            >
              <Calendar size={20} color="#FF6B35" />
              <Text className="flex-1 ml-3 text-sm">
                {startTime || '请选择直播时间'}
              </Text>
              <Clock size={20} color="#9CA3AF" />
            </View>
          </CardContent>
        </Card>

        {/* 直播简介 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播简介</Text>
            <Textarea
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm"
              placeholder="请输入直播简介，介绍直播亮点和推荐课程"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
              style={{ minHeight: '100px' }}
            />
          </CardContent>
        </Card>

        {/* 挂载课程 */}
        <Card className="m-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-3">
              <Text className="block text-sm font-medium text-gray-800">挂载课程</Text>
              {selectedCourses.length < 5 && (
                <Button
                  size="sm"
                  onClick={() => setShowCourseSelector(true)}
                >
                  <Plus size={14} color="#FFFFFF" />
                  <Text className="ml-1">添加</Text>
                </Button>
              )}
            </View>

            {selectedCourses.length === 0 ? (
              <View className="text-center py-8">
                <Text className="text-gray-400 text-sm">暂无挂载课程</Text>
              </View>
            ) : (
              <View className="flex flex-col gap-3">
                {selectedCourses.map((course) => (
                  <View
                    key={course.id}
                    className="bg-gray-50 rounded-xl p-3 flex flex-row items-center"
                  >
                    <Image
                      className="w-16 h-16 rounded-lg"
                      src={course.cover}
                      mode="aspectFill"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                        {course.title}
                      </Text>
                      <Text className="text-orange-500 font-bold text-sm">
                        ¥{course.price}
                      </Text>
                    </View>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveCourse(course.id)}
                    >
                      <X size={18} color="#EF4444" />
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

        {/* 直播设置 */}
        <Card className="m-4 mb-20">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">直播设置</Text>
            <View className="flex flex-col gap-4">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-sm text-gray-700">开启预约提醒</Text>
                <Button
                  size="sm"
                  variant={remindEnabled ? 'default' : 'outline'}
                  className={
                    remindEnabled ? 'bg-orange-500' : 'border-gray-300'
                  }
                  onClick={() => setRemindEnabled(!remindEnabled)}
                >
                  {remindEnabled ? '已开启' : '已关闭'}
                </Button>
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-sm text-gray-700">保存直播回放</Text>
                <Button
                  size="sm"
                  variant={saveReplay ? 'default' : 'outline'}
                  className={
                    saveReplay ? 'bg-orange-500' : 'border-gray-300'
                  }
                  onClick={() => setSaveReplay(!saveReplay)}
                >
                  {saveReplay ? '已开启' : '已关闭'}
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* 课程选择弹窗 */}
      {showCourseSelector && (
        <View className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <View className="bg-white rounded-t-3xl w-full max-h-[70vh]">
            <View className="p-4 border-b border-gray-200 flex flex-row items-center justify-between">
              <Text className="text-lg font-semibold">选择挂载课程</Text>
              <Button size="icon" variant="ghost" onClick={() => setShowCourseSelector(false)}>
                <X size={24} color="#6B7280" />
              </Button>
            </View>
            <ScrollView scrollY className="flex-1 p-4 max-h-[60vh]">
              <View className="flex flex-col gap-3">
                {availableCourses.map((course) => (
                  <View
                    key={course.id}
                    className="bg-gray-50 rounded-xl p-3 flex flex-row items-center"
                    onClick={() => handleAddCourse(course)}
                  >
                    <Image
                      className="w-16 h-16 rounded-lg"
                      src={course.cover}
                      mode="aspectFill"
                    />
                    <View className="flex-1 ml-3">
                      <Text className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                        {course.title}
                      </Text>
                      <Text className="text-orange-500 font-bold text-sm">
                        ¥{course.price}
                      </Text>
                    </View>
                    {selectedCourses.some((c) => c.id === course.id) && (
                      <Badge className="bg-green-500 text-white">已添加</Badge>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

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
          className="flex-1"
          onClick={handleSaveDraft}
          disabled={loading}
        >
          保存草稿
        </Button>
        <Button
          className="flex-1 bg-orange-500 text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          提交审核
        </Button>
      </View>
    </View>
  );
};

export default InstructorLiveEditPage;
