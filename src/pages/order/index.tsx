import { View, Text, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { Package, Star } from 'lucide-react-taro';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNo: string;
  courseTitle: string;
  courseCover: string;
  teacher: string;
  price: number;
  originalPrice: number;
  status: 'pending' | 'paid' | 'completed' | 'refunding' | 'refunded' | 'cancelled';
  createdAt: string;
  payMethod?: 'wechat' | 'alipay';
  paidAt?: string;
  hasReviewed?: boolean;
}

const OrderPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundDescription, setRefundDescription] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  useEffect(() => {
    const { status } = router.params;
    if (status) {
      setActiveTab(status);
    }
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      // 模拟数据
      const mockOrders: Order[] = [
        {
          id: 'order_001',
          orderNo: 'ORD20240115001',
          courseTitle: '短视频剪辑实战课：从入门到精通',
          courseCover: 'https://picsum.photos/seed/order1/400/300',
          teacher: '张老师',
          price: 299,
          originalPrice: 599,
          status: 'paid',
          createdAt: '2024-01-15 10:25:00',
          payMethod: 'wechat',
          paidAt: '2024-01-15 10:30:00',
          hasReviewed: false,
        },
        {
          id: 'order_002',
          orderNo: 'ORD20240114002',
          courseTitle: '职场沟通技巧提升训练营',
          courseCover: 'https://picsum.photos/seed/order2/400/300',
          teacher: '李老师',
          price: 199,
          originalPrice: 399,
          status: 'completed',
          createdAt: '2024-01-14 15:15:00',
          payMethod: 'alipay',
          paidAt: '2024-01-14 15:20:00',
          hasReviewed: false,
        },
        {
          id: 'order_003',
          orderNo: 'ORD20240118003',
          courseTitle: 'Python数据分析入门到实战',
          courseCover: 'https://picsum.photos/seed/order3/400/300',
          teacher: '王老师',
          price: 399,
          originalPrice: 799,
          status: 'pending',
          createdAt: '2024-01-18 09:00:00',
        },
        {
          id: 'order_004',
          orderNo: 'ORD20240112004',
          courseTitle: 'Photoshop设计基础',
          courseCover: 'https://picsum.photos/seed/order4/400/300',
          teacher: '赵老师',
          price: 159,
          originalPrice: 299,
          status: 'completed',
          createdAt: '2024-01-12 11:00:00',
          payMethod: 'wechat',
          paidAt: '2024-01-12 11:05:00',
          hasReviewed: true,
        },
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('获取订单失败:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; className: string }> = {
      pending: { text: '待付款', className: 'bg-orange-500 text-white' },
      paid: { text: '已购买', className: 'bg-blue-500 text-white' },
      completed: { text: '已完成', className: 'bg-green-500 text-white' },
      refunding: { text: '退款中', className: 'bg-yellow-500 text-white' },
      refunded: { text: '已退款', className: 'bg-gray-500 text-white' },
      cancelled: { text: '已取消', className: 'bg-gray-500 text-white' },
    };
    return labels[status] || { text: '未知', className: 'bg-gray-500 text-white' };
  };

  const getPayMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      wechat: '微信支付',
      alipay: '支付宝',
    };
    return method ? labels[method] : '-';
  };

  const handlePay = (_orderId: string) => {
    Taro.showToast({ title: '跳转到支付', icon: 'none' });
  };

  const handleCancel = (orderId: string) => {
    Taro.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
          );
          Taro.showToast({ title: '订单已取消', icon: 'success' });
        }
      },
    });
  };

  const handleCourseClick = (courseId: string) => {
    Taro.navigateTo({
      url: `/pages/course/index?id=${courseId}`,
    });
  };

  const handleRefund = (order: Order) => {
    setCurrentOrder(order);
    setRefundReason('');
    setRefundDescription('');
    setShowRefundDialog(true);
  };

  const handleRefundSubmit = () => {
    if (!refundReason) {
      Taro.showToast({ title: '请选择退款原因', icon: 'none' });
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === currentOrder?.id ? { ...o, status: 'refunding' as const } : o
      )
    );
    setShowRefundDialog(false);
    Taro.showToast({ title: '退款申请已提交', icon: 'success' });
  };

  const handleReview = (order: Order) => {
    setCurrentOrder(order);
    setReviewRating(5);
    setReviewContent('');
    setShowReviewDialog(true);
  };

  const handleReviewSubmit = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === currentOrder?.id ? { ...o, hasReviewed: true } : o
      )
    );
    setShowReviewDialog(false);
    Taro.showToast({ title: '评价提交成功', icon: 'success' });
  };

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : activeTab === 'review'
      ? orders.filter((o) => o.status === 'completed' && !o.hasReviewed)
      : orders.filter((o) => o.status === activeTab);

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <View className="bg-white sticky top-0 z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">待付款</TabsTrigger>
            <TabsTrigger value="paid" className="flex-1">已购买</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">已完成</TabsTrigger>
            <TabsTrigger value="review" className="flex-1">待评价</TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Package size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无订单</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusLabel(order.status);
              return (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="block text-xs text-gray-500">
                        订单号: {order.orderNo}
                      </Text>
                      <Badge variant="secondary" className={statusInfo.className}>
                        {statusInfo.text}
                      </Badge>
                    </View>

                    <View
                      className="flex flex-row mb-3"
                      onClick={() => handleCourseClick(order.id)}
                    >
                      <Avatar className="w-20 h-20 rounded-lg overflow-hidden">
                        <AvatarImage src={order.courseCover} />
                      </Avatar>
                      <View className="flex-1 ml-3">
                        <Text className="block text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                          {order.courseTitle}
                        </Text>
                        <Text className="block text-xs text-gray-500">讲师: {order.teacher}</Text>
                      </View>
                    </View>

                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="block text-sm text-gray-500">
                        下单时间: {order.createdAt}
                      </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex flex-row items-baseline">
                        <Text className="block text-lg font-bold text-orange-500">
                          ¥{order.price}
                        </Text>
                        {order.originalPrice > order.price && (
                          <Text className="block text-sm text-gray-400 line-through ml-2">
                            ¥{order.originalPrice}
                          </Text>
                        )}
                      </View>

                      {order.status === 'pending' && (
                        <View className="flex flex-row gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-600"
                            onClick={() => handleCancel(order.id)}
                          >
                            取消
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-orange-500 text-white"
                            onClick={() => handlePay(order.id)}
                          >
                            去支付
                          </Button>
                        </View>
                      )}

                      {order.status === 'paid' && (
                        <View className="flex flex-row gap-2">
                          <Text className="block text-xs text-gray-500 mr-2 flex items-center">
                            {getPayMethodLabel(order.payMethod)} | {order.paidAt}
                          </Text>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-500"
                            onClick={() => handleRefund(order)}
                          >
                            申请退款
                          </Button>
                        </View>
                      )}

                      {order.status === 'completed' && !order.hasReviewed && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-orange-500 text-white"
                          onClick={() => handleReview(order)}
                        >
                          去评价
                        </Button>
                      )}

                      {order.status === 'completed' && order.hasReviewed && (
                        <View className="flex flex-row items-center gap-1 text-yellow-500">
                          <Star size={16} filled color="#F59E0B" />
                          <Text className="block text-sm text-yellow-600">已评价</Text>
                        </View>
                      )}

                      {order.status === 'refunding' && (
                        <Text className="block text-xs text-yellow-500">退款审核中...</Text>
                      )}

                      {order.status === 'refunded' && (
                        <Text className="block text-xs text-gray-500">已退款</Text>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* 退款申请弹窗 */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申请退款</DialogTitle>
          </DialogHeader>
          <View className="space-y-4 mt-4">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">退款原因</Text>
              <View className="flex flex-col gap-2">
                {['课程内容不符', '个人原因', '重复购买', '其他原因'].map((reason, index) => (
                  <View
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      refundReason === reason
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setRefundReason(reason)}
                  >
                    <Text className="block text-sm">{reason}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">退款说明（选填）</Text>
              <View className="bg-gray-50 rounded-lg p-3 min-h-20">
                <Text className="block text-sm text-gray-800">{refundDescription || '请输入退款说明'}</Text>
              </View>
            </View>

            <View className="bg-orange-50 rounded-lg p-3">
              <Text className="block text-sm text-orange-600">
                退款金额将原路退回，预计 1-3 个工作日到账
              </Text>
            </View>

            <View className="flex flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRefundDialog(false)}
              >
                取消
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-orange-500 text-white"
                onClick={handleRefundSubmit}
              >
                提交申请
              </Button>
            </View>
          </View>
        </DialogContent>
      </Dialog>

      {/* 评价弹窗 */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>评价课程</DialogTitle>
          </DialogHeader>
          <View className="space-y-4 mt-4">
            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程评分</Text>
              <View className="flex flex-row gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    color={star <= reviewRating ? '#F59E0B' : '#D1D5DB'}
                    filled={star <= reviewRating}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-700 mb-2">评价内容</Text>
              <View className="bg-gray-50 rounded-lg p-3 min-h-24">
                <Text className="block text-sm text-gray-800">{reviewContent || '请输入评价内容...'}</Text>
              </View>
            </View>

            <View className="flex flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowReviewDialog(false)}
              >
                取消
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-orange-500 text-white"
                onClick={handleReviewSubmit}
              >
                提交评价
              </Button>
            </View>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default OrderPage;
