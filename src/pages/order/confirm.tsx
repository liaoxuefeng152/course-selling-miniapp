import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { Check } from 'lucide-react-taro';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Network } from '@/network';

type PaymentMethod = 'wechat' | 'alipay';

const OrderConfirmPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('wechat');
  const [loading, setLoading] = useState(false);

  // 模拟课程数据
  const course = {
    id: '1',
    title: '短视频剪辑实战课：从入门到精通',
    cover: 'https://picsum.photos/seed/confirm/400/300',
    teacher: '张老师',
    teacherAvatar: 'https://i.pravatar.cc/100?img=68',
    originalPrice: 599,
    discountPrice: 299,
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. 调用后端接口创建订单并获取支付参数
      console.log('请求支付接口:', {
        courseId: course.id,
        paymentMethod: selectedPayment,
        amount: course.discountPrice,
      });

      const res = await Network.request({
        url: '/api/orders/create',
        method: 'POST',
        data: {
          courseId: course.id,
          paymentMethod: selectedPayment,
          amount: course.discountPrice,
        },
      });

      console.log('创建订单响应:', res.data);

      // 2. 检查响应
      if (res.data?.code === 200 && res.data?.data) {
        const { orderId, paymentParams } = res.data.data;

        // 3. 调用微信支付（小程序端）
        if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
          await Taro.requestPayment({
            timeStamp: paymentParams.timeStamp,
            nonceStr: paymentParams.nonceStr,
            package: paymentParams.package,
            signType: paymentParams.signType || 'MD5',
            paySign: paymentParams.paySign,
            success: () => {
              console.log('支付成功');
              Taro.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
              });

              // 延迟跳转到订单列表
              setTimeout(() => {
                Taro.redirectTo({
                  url: `/pages/order/index?status=paid&orderId=${orderId}`,
                });
              }, 2000);
            },
            fail: (err) => {
              console.error('支付失败:', err);
              if (err.errMsg.includes('requestPayment:fail cancel')) {
                Taro.showToast({
                  title: '取消支付',
                  icon: 'none',
                });
              } else {
                Taro.showToast({
                  title: '支付失败',
                  icon: 'none',
                });
              }
            },
          });
        } else {
          // H5 端显示模拟支付
          Taro.showModal({
            title: '支付确认',
            content: `订单金额：¥${course.discountPrice}\n支付方式：${selectedPayment === 'wechat' ? '微信支付' : '支付宝'}\n\n确定要支付吗？`,
            success: (modalRes) => {
              if (modalRes.confirm) {
                Taro.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 2000,
                });
                setTimeout(() => {
                  Taro.redirectTo({
                    url: `/pages/order/index?status=paid&orderId=${orderId}`,
                  });
                }, 2000);
              }
            },
          });
        }
      } else {
        throw new Error(res.data?.msg || '创建订单失败');
      }
    } catch (error: any) {
      console.error('支付流程错误:', error);

      // 判断是否是网络错误或后端未实现
      if (error.message?.includes('Network') || error.message?.includes('404')) {
        // 模拟支付成功（开发环境）
        Taro.showModal({
          title: '开发环境提示',
          content: '后端接口未实现，是否模拟支付成功？',
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
              });
              setTimeout(() => {
                Taro.redirectTo({
                  url: '/pages/order/index?status=paid',
                });
              }, 2000);
            }
          },
        });
      } else {
        Taro.showToast({
          title: error.message || '支付失败，请重试',
          icon: 'none',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      <ScrollView scrollY className="flex-1">
        {/* 倒计时提示 */}
        <View className="bg-orange-500 px-4 py-3">
          <View className="flex flex-row items-center justify-center">
            <Text className="block text-white text-sm">
              订单将在 29:59 后自动取消，请尽快完成支付
            </Text>
          </View>
        </View>

        {/* 订单信息卡片 */}
        <View className="px-4 py-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex flex-row">
                <Avatar className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <AvatarImage src={course.cover} />
                </Avatar>
                <View className="flex-1 ml-3">
                  <Text className="block text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                    {course.title}
                  </Text>
                  <View className="flex flex-row items-center mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={course.teacherAvatar} />
                    </Avatar>
                    <Text className="block text-xs text-gray-500 ml-1">{course.teacher}</Text>
                  </View>
                  <View className="flex flex-row items-baseline">
                    <Text className="block text-lg font-bold text-orange-500">
                      ¥{course.discountPrice}
                    </Text>
                    <Text className="block text-sm text-gray-400 line-through ml-2">
                      ¥{course.originalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 支付方式 */}
        <View className="px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-800 mb-3">支付方式</Text>
              <View
                className="flex flex-row items-center justify-between py-3 border-b border-gray-100"
                onClick={() => handlePaymentSelect('wechat')}
              >
                <View className="flex flex-row items-center">
                  <View className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Text className="block text-white text-xs font-bold">微</Text>
                  </View>
                  <Text className="block text-sm text-gray-800 ml-3">微信支付</Text>
                </View>
                {selectedPayment === 'wechat' && (
                  <View className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <Check size={12} color="#FF6B35" />
                  </View>
                )}
              </View>
              <View
                className="flex flex-row items-center justify-between py-3"
                onClick={() => handlePaymentSelect('alipay')}
              >
                <View className="flex flex-row items-center">
                  <View className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Text className="block text-white text-xs font-bold">支</Text>
                  </View>
                  <Text className="block text-sm text-gray-800 ml-3">支付宝</Text>
                </View>
                {selectedPayment === 'alipay' && (
                  <View className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <Check size={12} color="#FF6B35" />
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 订单详情 */}
        <View className="px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <Text className="block text-sm font-medium text-gray-800 mb-3">订单详情</Text>
              <View className="flex flex-row justify-between py-2 border-b border-gray-100">
                <Text className="block text-sm text-gray-500">订单编号</Text>
                <Text className="block text-sm text-gray-800">ORD20240115001</Text>
              </View>
              <View className="flex flex-row justify-between py-2 border-b border-gray-100">
                <Text className="block text-sm text-gray-500">下单时间</Text>
                <Text className="block text-sm text-gray-800">2024-01-15 10:25:00</Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text className="block text-sm text-gray-500">课程类型</Text>
                <Text className="block text-sm text-gray-800">视频课程</Text>
              </View>
            </CardContent>
          </Card>
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
        <View className="flex flex-row items-center flex-1">
          <Text className="block text-sm text-gray-500">实付款：</Text>
          <Text className="block text-2xl font-bold text-orange-500">¥{course.discountPrice}</Text>
        </View>
        <Button
          className="bg-orange-500 text-white px-8"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? '支付中...' : '立即支付'}
        </Button>
      </View>
    </View>
  );
};

export default OrderConfirmPage;
