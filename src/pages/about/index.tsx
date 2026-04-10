import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {
  Mail,
  Phone,
  Globe,
  Shield,
  FileText,
  ChevronRight,
  Users,
  Heart,
} from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
  const version = '1.0.0';

  const contactItems = [
    {
      icon: <Mail size={20} color="#FF6B35" />,
      label: '邮箱',
      value: 'support@example.com',
      action: () => {
        Taro.setClipboardData({
          data: 'support@example.com',
          success: () => {
            Taro.showToast({ title: '已复制', icon: 'success' });
          },
        });
      },
    },
    {
      icon: <Phone size={20} color="#FF6B35" />,
      label: '电话',
      value: '400-123-4567',
      action: () => {
        Taro.makePhoneCall({
          phoneNumber: '400-123-4567',
        });
      },
    },
    {
      icon: <Globe size={20} color="#FF6B35" />,
      label: '官网',
      value: 'www.example.com',
      action: () => {
        Taro.setClipboardData({
          data: 'https://www.example.com',
          success: () => {
            Taro.showToast({ title: '链接已复制', icon: 'success' });
          },
        });
      },
    },
  ];

  const menuItems = [
    {
      icon: <Shield size={20} color="#6B7280" />,
      label: '用户协议',
      path: '/pages/about/agreement',
    },
    {
      icon: <FileText size={20} color="#6B7280" />,
      label: '隐私政策',
      path: '/pages/about/privacy',
    },
    {
      icon: <Users size={20} color="#6B7280" />,
      label: '关于我们',
      path: '/pages/about/company',
    },
  ];

  const handleMenuClick = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none',
    });
  };

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部品牌区域 */}
      <View className="bg-gradient-to-br from-orange-500 to-orange-400 px-4 py-12 text-center">
        <View className="mx-auto mb-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
          <View className="text-4xl">📚</View>
        </View>
        <Text className="text-2xl font-bold text-white mb-2">在线课堂</Text>
        <Text className="text-white text-opacity-90 text-sm">专业的在线学习平台</Text>
        <Text className="text-white text-opacity-70 text-xs mt-2">版本 {version}</Text>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-6">
        {/* 平台简介 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">关于平台</Text>
            <Text className="text-sm text-gray-600 leading-relaxed">
              在线课堂是一个专注于提供优质在线教育服务的平台，汇聚了各行各业的优秀讲师，
              为学员提供视频课、音频课、图文课、直播课等多种形式的课程内容。
              我们致力于让学习变得更加便捷、高效、有趣。
            </Text>
          </CardContent>
        </Card>

        {/* 联系我们 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">联系我们</Text>
            <View className="flex flex-col gap-4">
              {contactItems.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  onClick={item.action}
                >
                  <View className="flex flex-row items-center">
                    {item.icon}
                    <Text className="text-sm text-gray-700 ml-3">{item.label}</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <Text className="text-sm text-gray-500 mr-2">{item.value}</Text>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 功能菜单 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">更多信息</Text>
            <View className="flex flex-col">
              {menuItems.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  onClick={() => handleMenuClick()}
                >
                  <View className="flex flex-row items-center">
                    {item.icon}
                    <Text className="text-sm text-gray-700 ml-3">{item.label}</Text>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 致谢 */}
        <Card className="mb-4">
          <CardContent className="p-4 text-center">
            <Heart size={32} color="#FF6B35" />
            <Text className="text-sm text-gray-600 mt-3 leading-relaxed">
              感谢您选择在线课堂，我们将持续努力，
              为您提供更好的学习体验。
            </Text>
          </CardContent>
        </Card>

        {/* 版权信息 */}
        <View className="text-center py-6">
          <Text className="text-xs text-gray-400">
            © 2024 在线课堂 版权所有
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutPage;
