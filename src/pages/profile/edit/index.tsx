import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Camera } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const EditProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    nickname: '学员用户',
    avatar: 'https://picsum.photos/seed/avatar/200/200',
    phone: '138****8888',
    email: 'user@example.com',
    bio: '热爱学习，不断进步',
  });

  const [loading, setLoading] = useState(false);

  const handleChooseAvatar = () => {
    console.log('点击了更换头像按钮');

    // 检测平台环境
    const env = Taro.getEnv();
    const isMiniApp = env === Taro.ENV_TYPE.WEAPP || env === Taro.ENV_TYPE.TT;

    if (isMiniApp) {
      // 小程序环境：使用 chooseImage
      Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('选择图片成功:', res);
          const tempFilePath = res.tempFilePaths[0];
          setUserInfo((prev) => ({ ...prev, avatar: tempFilePath }));
          Taro.showToast({ title: '选择成功', icon: 'success' });
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          Taro.showToast({
            title: '选择图片失败，请重试',
            icon: 'none'
          });
        },
      });
    } else {
      // H5 环境：提示用户
      Taro.showModal({
        title: '提示',
        content: 'H5 环境下更换头像功能受限，是否使用随机头像？',
        success: (modalRes) => {
          if (modalRes.confirm) {
            // 生成随机头像
            const randomAvatar = `https://picsum.photos/seed/${Date.now()}/200/200`;
            setUserInfo((prev) => ({ ...prev, avatar: randomAvatar }));
            Taro.showToast({ title: '已更换随机头像', icon: 'success' });
          }
        },
      });
    }
  };

  const handleSave = () => {
    if (!userInfo.nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    setLoading(true);

    // 模拟保存
    setTimeout(() => {
      setLoading(false);
      Taro.showToast({ title: '保存成功', icon: 'success' });
      
      // 保存到本地存储
      try {
        Taro.setStorageSync('userInfo', userInfo);
      } catch (e) {
        console.error('保存失败:', e);
      }

      setTimeout(() => {
        Taro.navigateBack();
      }, 1000);
    }, 1000);
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      <ScrollView scrollY className="flex-1">
        {/* 头像编辑 */}
        <Card className="mx-4 mt-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between">
              <Text className="block text-sm text-gray-600">头像</Text>
              <View className="flex flex-row items-center" onClick={handleChooseAvatar} catchMove>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userInfo.avatar} />
                </Avatar>
                <View className="ml-3 flex flex-col items-center">
                  <Camera size={20} color="#FF6B35" />
                  <Text className="block text-xs text-gray-500 mt-1">更换头像</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="mx-4 mt-4">
          <CardContent className="p-4">
            <View className="flex flex-col gap-4">
              <View>
                <Text className="block text-sm text-gray-600 mb-2">昵称</Text>
                <Input
                  className="w-full"
                  placeholder="请输入昵称"
                  value={userInfo.nickname}
                  onInput={(e) => setUserInfo((prev) => ({ ...prev, nickname: e.detail.value }))}
                  maxlength={20}
                />
              </View>

              <View>
                <Text className="block text-sm text-gray-600 mb-2">手机号</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Text className="block text-sm text-gray-800">{userInfo.phone}</Text>
                </View>
              </View>

              <View>
                <Text className="block text-sm text-gray-600 mb-2">邮箱</Text>
                <Input
                  className="w-full"
                  placeholder="请输入邮箱"
                  value={userInfo.email}
                  onInput={(e) => setUserInfo((prev) => ({ ...prev, email: e.detail.value }))}
                  maxlength={50}
                />
              </View>

              <View>
                <Text className="block text-sm text-gray-600 mb-2">个人简介</Text>
                <Input
                  className="w-full"
                  placeholder="介绍一下自己..."
                  value={userInfo.bio}
                  onInput={(e) => setUserInfo((prev) => ({ ...prev, bio: e.detail.value }))}
                  maxlength={100}
                />
                <Text className="block text-xs text-gray-400 text-right mt-1">
                  {userInfo.bio.length}/100
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        <View className="mx-4 mt-4 px-4 py-3 bg-orange-50 rounded-xl">
          <Text className="block text-xs text-orange-600">
            • 头像建议使用正方形图片，大小不超过 2MB
          </Text>
          <Text className="block text-xs text-orange-600 mt-1">
            • 昵称长度 2-20 个字符
          </Text>
          <Text className="block text-xs text-orange-600 mt-1">
            • 修改后所有数据将实时更新
          </Text>
        </View>
      </ScrollView>

      {/* 底部保存按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8">
        <Button
          className="w-full bg-orange-500 text-white"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? '保存中...' : '保存修改'}
        </Button>
      </View>
    </View>
  );
};

export default EditProfilePage;
