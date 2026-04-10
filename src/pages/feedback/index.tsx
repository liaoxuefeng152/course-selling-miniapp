import { View, Text, ScrollView, Image } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Upload, X, CircleCheck } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Network } from '@/network';

const FeedbackPage = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const feedbackTypes = [
    { key: 'bug', label: '功能异常' },
    { key: 'suggest', label: '功能建议' },
    { key: 'course', label: '课程问题' },
    { key: 'other', label: '其他问题' },
  ];

  const handleTypeSelect = (type: string) => {
    setFeedbackType(type);
  };

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 3 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths]);
      },
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!feedbackType) {
      Taro.showToast({
        title: '请选择反馈类型',
        icon: 'none',
      });
      return;
    }

    if (!content.trim()) {
      Taro.showToast({
        title: '请输入反馈内容',
        icon: 'none',
      });
      return;
    }

    setLoading(true);
    try {
      await Network.request({
        url: '/api/feedback',
        method: 'POST',
        data: {
          type: feedbackType,
          content,
          images,
          contact,
        },
      });

      Taro.showToast({
        title: '提交成功',
        icon: 'success',
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('提交失败:', error);
      Taro.showToast({
        title: '提交失败',
        icon: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <View className="bg-white px-4 py-4">
        <Text className="text-xl font-bold text-gray-800">意见反馈</Text>
        <Text className="text-sm text-gray-500 mt-1">
          我们非常重视您的反馈，帮助我们做得更好
        </Text>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {/* 反馈类型 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">反馈类型</Text>
            <View className="flex flex-row flex-wrap gap-2">
              {feedbackTypes.map((type) => (
                <View
                  key={type.key}
                  className={`px-4 py-2 rounded-full border ${
                    feedbackType === type.key
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleTypeSelect(type.key)}
                >
                  <Text
                    className={`text-sm ${
                      feedbackType === type.key ? 'text-orange-500 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 反馈内容 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">反馈内容</Text>
            <View className="bg-gray-100 rounded-xl p-3">
              <textarea
                className="w-full bg-transparent text-sm text-gray-800 resize-none"
                style={{ minHeight: '150px' }}
                placeholder="请详细描述您遇到的问题或建议..."
                value={content}
                onInput={(e) => setContent((e.target as any).value)}
                maxLength={500}
              />
            </View>
            <Text className="text-xs text-gray-400 text-right mt-1">{content.length}/500</Text>
          </CardContent>
        </Card>

        {/* 图片上传 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">
              上传图片（最多3张）
            </Text>
            <View className="flex flex-row gap-2">
              {images.map((img, index) => (
                <View key={index} className="relative w-24 h-24">
                  <Image
                    className="w-full h-full rounded-lg"
                    src={img}
                    mode="aspectFill"
                  />
                  <View
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </View>
                </View>
              ))}
              {images.length < 3 && (
                <View
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50"
                  onClick={handleChooseImage}
                >
                  <Upload size={24} color="#9CA3AF" />
                  <Text className="text-xs text-gray-400 mt-1">上传图片</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* 联系方式 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-800 mb-3">联系方式（选填）</Text>
            <Input
              className="w-full"
              placeholder="手机号或邮箱，方便我们联系您"
              value={contact}
              onInput={(e) => setContact(e.detail.value)}
            />
          </CardContent>
        </Card>

        {/* 温馨提示 */}
        <Card className="mb-20">
          <CardContent className="p-4">
            <View className="flex flex-row items-start">
              <CircleCheck size={20} color="#FF6B35" />
              <View className="ml-2 flex-1">
                <Text className="text-sm font-medium text-gray-800">温馨提示</Text>
                <Text className="text-xs text-gray-500 mt-1 leading-relaxed">
                  1. 我们会在1-3个工作日内处理您的反馈{'\n'}
                  2. 如果是功能异常，请详细描述操作步骤{'\n'}
                  3. 上传相关截图可以帮助我们更快定位问题
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* 底部提交按钮 */}
      <View
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e5e5',
          padding: '12px',
        }}
      >
        <Button
          className="w-full bg-orange-500 text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '提交中...' : '提交反馈'}
        </Button>
      </View>
    </View>
  );
};

export default FeedbackPage;
