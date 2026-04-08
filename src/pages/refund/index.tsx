import { View, Text, ScrollView } from '@tarojs/components';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { RotateCcw, Clock, CircleCheck, X } from 'lucide-react-taro';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface RefundRecord {
  id: string;
  orderNo: string;
  courseTitle: string;
  courseCover: string;
  teacher: string;
  refundAmount: number;
  status: 'refunding' | 'refunded' | 'rejected';
  refundReason: string;
  refundDescription?: string;
  refundReasonLabel: string;
  createdAt: string;
  processedAt?: string;
}

const RefundPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);

  useEffect(() => {
    fetchRefunds();
  }, [activeTab]);

  const fetchRefunds = async () => {
    try {
      // 模拟数据
      const mockRefunds: RefundRecord[] = [
        {
          id: 'refund_001',
          orderNo: 'ORD20240115001',
          courseTitle: '短视频剪辑实战课：从入门到精通',
          courseCover: 'https://picsum.photos/seed/refund1/400/300',
          teacher: '张老师',
          refundAmount: 299,
          status: 'refunding',
          refundReason: 'personal',
          refundReasonLabel: '个人原因',
          refundDescription: '课程内容不适合我',
          createdAt: '2024-01-20 10:00:00',
        },
        {
          id: 'refund_002',
          orderNo: 'ORD20240110002',
          courseTitle: 'Excel数据分析实战',
          courseCover: 'https://picsum.photos/seed/refund2/400/300',
          teacher: '王老师',
          refundAmount: 199,
          status: 'refunded',
          refundReason: 'content_mismatch',
          refundReasonLabel: '课程内容不符',
          refundDescription: '课程内容与描述不符',
          createdAt: '2024-01-10 15:00:00',
          processedAt: '2024-01-12 10:30:00',
        },
        {
          id: 'refund_003',
          orderNo: 'ORD20240105003',
          courseTitle: '摄影基础入门',
          courseCover: 'https://picsum.photos/seed/refund3/400/300',
          teacher: '李老师',
          refundAmount: 99,
          status: 'rejected',
          refundReason: 'duplicate',
          refundReasonLabel: '重复购买',
          refundDescription: '不小心重复购买了',
          createdAt: '2024-01-05 09:00:00',
          processedAt: '2024-01-06 14:00:00',
        },
      ];

      setRefunds(mockRefunds);
    } catch (error) {
      console.error('获取退款记录失败:', error);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      refunding: {
        text: '退款中',
        className: 'bg-yellow-500 text-white',
        icon: <Clock size={14} color="#FFFFFF" />,
      },
      refunded: {
        text: '退款成功',
        className: 'bg-green-500 text-white',
        icon: <CircleCheck size={14} color="#FFFFFF" />,
      },
      rejected: {
        text: '退款失败',
        className: 'bg-red-500 text-white',
        icon: <X size={14} color="#FFFFFF" />,
      },
    };
    return statusMap[status as keyof typeof statusMap] || {
      text: '未知',
      className: 'bg-gray-500 text-white',
      icon: <Clock size={14} color="#FFFFFF" />,
    };
  };

  const handleCancelRefund = (refundId: string) => {
    Taro.showModal({
      title: '提示',
      content: '确定要取消退款申请吗？',
      success: (res) => {
        if (res.confirm) {
          setRefunds((prev) => prev.filter((r) => r.id !== refundId));
          Taro.showToast({ title: '已取消退款申请', icon: 'success' });
        }
      },
    });
  };

  const handleReapply = (_refundId: string) => {
    Taro.showToast({ title: '跳转到退款申请', icon: 'none' });
  };

  const filteredRefunds =
    activeTab === 'all'
      ? refunds
      : refunds.filter((r) => r.status === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'refunding', label: '退款中' },
    { key: 'refunded', label: '退款成功' },
    { key: 'rejected', label: '退款失败' },
  ];

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部 Tabs */}
      <View className="bg-white sticky top-0 z-10">
        <View className="flex flex-row">
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className="flex-1 py-3 text-center"
              onClick={() => setActiveTab(tab.key)}
            >
              <Text
                className={`block text-sm ${
                  activeTab === tab.key
                    ? 'text-orange-500 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </Text>
              {activeTab === tab.key && (
                <View className="h-1 bg-orange-500 mt-1 mx-4" />
              )}
            </View>
          ))}
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {filteredRefunds.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <RotateCcw size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无退款记录</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {filteredRefunds.map((refund) => {
              const statusInfo = getStatusInfo(refund.status);
              return (
                <Card key={refund.id}>
                  <CardContent className="p-4">
                    <View className="flex flex-row items-center justify-between mb-3">
                      <Text className="block text-xs text-gray-500">
                        退款单号: {refund.id}
                      </Text>
                      <Badge
                        variant="secondary"
                        className={`${statusInfo.className} flex flex-row items-center gap-1`}
                      >
                        {statusInfo.icon}
                        <Text className="text-xs">{statusInfo.text}</Text>
                      </Badge>
                    </View>

                    <View className="flex flex-row mb-3">
                      <Avatar className="w-20 h-20 rounded-lg overflow-hidden">
                        <AvatarImage src={refund.courseCover} />
                      </Avatar>
                      <View className="flex-1 ml-3">
                        <Text className="block text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                          {refund.courseTitle}
                        </Text>
                        <Text className="block text-xs text-gray-500">
                          讲师: {refund.teacher}
                        </Text>
                        <Text className="block text-xs text-gray-500 mt-1">
                          订单号: {refund.orderNo}
                        </Text>
                      </View>
                    </View>

                    <View className="bg-gray-50 rounded-lg p-3 mb-3">
                      <View className="flex flex-row justify-between mb-2">
                        <Text className="block text-xs text-gray-600">退款原因</Text>
                        <Text className="block text-xs text-gray-800 font-medium">
                          {refund.refundReasonLabel}
                        </Text>
                      </View>
                      {refund.refundDescription && (
                        <View className="mb-2">
                          <Text className="block text-xs text-gray-600 mb-1">
                            退款说明
                          </Text>
                          <Text className="block text-xs text-gray-800">
                            {refund.refundDescription}
                          </Text>
                        </View>
                      )}
                      <View className="flex flex-row justify-between">
                        <Text className="block text-xs text-gray-600">退款金额</Text>
                        <Text className="block text-sm text-orange-500 font-semibold">
                          ¥{refund.refundAmount}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-row items-center justify-between text-xs text-gray-500 mb-3">
                      <Text>申请时间: {refund.createdAt}</Text>
                      {refund.processedAt && (
                        <Text>处理时间: {refund.processedAt}</Text>
                      )}
                    </View>

                    {refund.status === 'refunding' && (
                      <View className="flex flex-row gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-600"
                          onClick={() => handleCancelRefund(refund.id)}
                        >
                          取消退款
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1 bg-orange-500 text-white"
                          onClick={() => handleReapply(refund.id)}
                        >
                          重新申请
                        </Button>
                      </View>
                    )}

                    {refund.status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full bg-orange-500 text-white"
                        onClick={() => handleReapply(refund.id)}
                      >
                        重新申请退款
                      </Button>
                    )}

                    {refund.status === 'refunded' && (
                      <View className="bg-green-50 rounded-lg p-2 text-center">
                        <Text className="block text-xs text-green-600">
                          退款成功，金额已原路退回
                        </Text>
                      </View>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RefundPage;
