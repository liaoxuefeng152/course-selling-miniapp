import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import {
  Phone,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageCircleCheck,
  CircleQuestionMark,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  expanded: boolean;
}

const HelpPage = () => {
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'other'>('suggestion');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [contact, setContact] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const [faqs] = useState<FAQ[]>([
    {
      id: 1,
      question: '如何购买课程？',
      answer: '您可以在课程列表页选择感兴趣的课程，进入课程详情页后点击"立即购买"按钮，完成支付即可开始学习。',
      expanded: true,
    },
    {
      id: 2,
      question: '课程购买后可以退款吗？',
      answer: '课程购买后7天内，如学习进度未超过30%，可申请全额退款；超过30%后不支持退款。特殊情况可联系客服处理。',
      expanded: false,
    },
    {
      id: 3,
      question: '如何设置课程提醒？',
      answer: '进入课程详情页，点击"提醒"按钮，设置开播提醒时间即可。我们会在课程开始前通知您。',
      expanded: false,
    },
    {
      id: 4,
      question: '视频无法播放怎么办？',
      answer: '请尝试以下方法：1. 刷新页面或重启APP；2. 清除缓存后重试；3. 检查网络连接是否正常；4. 更新至最新版本APP。如仍无法解决，请联系客服。',
      expanded: false,
    },
    {
      id: 5,
      question: '如何联系客服？',
      answer: '您可以通过以下方式联系我们：1. 在APP内提交反馈；2. 拨打客服热线：400-xxx-xxxx；3. 发送邮件至 support@example.com',
      expanded: false,
    },
  ]);

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) {
      Taro.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }
    if (!contact.trim()) {
      Taro.showToast({ title: '请输入联系方式', icon: 'none' });
      return;
    }
    
    Taro.showToast({ title: '反馈已提交，感谢您的建议！', icon: 'success' });
    setFeedbackContent('');
    setContact('');
  };

  const contactMethods = [
    { icon: <Phone size={20} color="#10B981" />, label: '客服热线', value: '400-xxx-xxxx', action: '拨打' },
    { icon: <Mail size={20} color="#3B82F6" />, label: '邮箱', value: 'support@example.com', action: '发送' },
    { icon: <MessageCircleCheck size={20} color="#8B5CF6" />, label: '微信客服', value: '在线客服', action: '联系' },
  ];

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <ScrollView scrollY className="flex-1">
        {/* 常见问题 */}
        <View className="px-4 py-4">
          <View className="flex flex-row items-center mb-4">
            <CircleQuestionMark size={20} color="#FF6B35" />
            <Text className="block text-base font-semibold text-gray-800 ml-2">常见问题</Text>
          </View>

          <View className="flex flex-col gap-2">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <View
                  className="p-4"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <View className="flex flex-row items-center justify-between">
                    <Text className="block text-sm font-medium text-gray-800 flex-1">
                      {faq.question}
                    </Text>
                    {expandedId === faq.id ? (
                      <ChevronUp size={16} color="#9CA3AF" />
                    ) : (
                      <ChevronDown size={16} color="#9CA3AF" />
                    )}
                  </View>
                  {expandedId === faq.id && (
                    <Text className="block text-sm text-gray-600 mt-2">
                      {faq.answer}
                    </Text>
                  )}
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* 联系方式 */}
        <View className="px-4 pb-4">
          <View className="flex flex-row items-center mb-4">
            <Phone size={20} color="#FF6B35" />
            <Text className="block text-base font-semibold text-gray-800 ml-2">联系我们</Text>
          </View>

          <Card>
            <CardContent className="p-4">
              <View className="flex flex-col gap-3">
                {contactMethods.map((item, index) => (
                  <View key={index} className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center">
                      {item.icon}
                      <View className="ml-3">
                        <Text className="block text-sm text-gray-500">{item.label}</Text>
                        <Text className="block text-sm text-gray-800">{item.value}</Text>
                      </View>
                    </View>
                    <View className="px-3 py-1 bg-orange-100 rounded">
                      <Text className="block text-xs text-orange-500">{item.action}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 意见反馈 */}
        <View className="px-4 pb-4">
          <View className="flex flex-row items-center mb-4">
            <FileText size={20} color="#FF6B35" />
            <Text className="block text-base font-semibold text-gray-800 ml-2">意见反馈</Text>
          </View>

          <Card>
            <CardContent className="p-4">
              <Text className="block text-sm text-gray-600 mb-2">反馈类型</Text>
              <View className="flex flex-row gap-2 mb-4">
                {[
                  { key: 'suggestion', label: '功能建议' },
                  { key: 'bug', label: '问题反馈' },
                  { key: 'other', label: '其他' },
                ].map((item) => (
                  <View
                    key={item.key}
                    className={`px-3 py-1 rounded-full ${
                      feedbackType === item.key
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setFeedbackType(item.key as typeof feedbackType)}
                  >
                    <Text className={`block text-xs ${feedbackType === item.key ? 'text-white' : 'text-gray-600'}`}>
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>

              <Text className="block text-sm text-gray-600 mb-2">反馈内容</Text>
              <View className="bg-gray-50 rounded-xl p-3 mb-4">
                <Textarea
                  style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
                  placeholder="请详细描述您的问题或建议..."
                  maxlength={500}
                  value={feedbackContent}
                  onInput={(e) => setFeedbackContent(e.detail.value)}
                />
              </View>
              <Text className="block text-xs text-gray-400 text-right mb-4">
                {feedbackContent.length}/500
              </Text>

              <Text className="block text-sm text-gray-600 mb-2">联系方式</Text>
              <View
                className="bg-gray-50 rounded-xl px-3 py-3 mb-4"
                onClick={() => {
                  Taro.showToast({ title: '请输入联系方式', icon: 'none' });
                }}
              >
                <Text className={`block text-sm ${contact ? 'text-gray-800' : 'text-gray-400'}`}>
                  {contact || '手机号/邮箱/微信号（选填）'}
                </Text>
              </View>

              <Button
                className="w-full bg-orange-500 text-white"
                onClick={handleSubmitFeedback}
              >
                提交反馈
              </Button>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpPage;
