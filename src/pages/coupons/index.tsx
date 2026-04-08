import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import { Ticket, Clock, Gift } from 'lucide-react-taro';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Coupon {
  id: string;
  title: string;
  type: 'discount' | 'cash';
  value: number;
  minAmount: number;
  validUntil: string;
  status: 'available' | 'used' | 'expired';
  description: string;
}

const CouponsPage = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'used'>('available');

  const coupons: Coupon[] = [
    {
      id: 'coupon_001',
      title: '新人专享券',
      type: 'cash',
      value: 50,
      minAmount: 199,
      validUntil: '2024-12-31',
      status: 'available',
      description: '限首次购买使用',
    },
    {
      id: 'coupon_002',
      title: '限时折扣券',
      type: 'discount',
      value: 20,
      minAmount: 100,
      validUntil: '2024-02-28',
      status: 'available',
      description: '全场课程通用',
    },
    {
      id: 'coupon_003',
      title: 'VIP专属券',
      type: 'cash',
      value: 100,
      minAmount: 299,
      validUntil: '2024-03-15',
      status: 'available',
      description: 'VIP会员专享',
    },
    {
      id: 'coupon_004',
      title: '节日特惠券',
      type: 'cash',
      value: 30,
      minAmount: 0,
      validUntil: '2024-01-10',
      status: 'used',
      description: '已使用',
    },
  ];

  const availableCoupons = coupons.filter((c) => c.status === 'available');
  const usedCoupons = coupons.filter((c) => c.status === 'used' || c.status === 'expired');

  const displayCoupons = activeTab === 'available' ? availableCoupons : usedCoupons;

  const getCouponValue = (coupon: Coupon) => {
    if (coupon.type === 'cash') {
      return `¥${coupon.value}`;
    }
    return `${coupon.value}折`;
  };

  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      <View className="bg-white sticky top-0 z-10">
        <View className="flex flex-row">
          <View
            className={`flex-1 py-3 text-center ${activeTab === 'available' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('available')}
          >
            <Text className={`text-base font-medium ${activeTab === 'available' ? 'text-orange-500' : 'text-gray-500'}`}>
              可用优惠券 ({availableCoupons.length})
            </Text>
          </View>
          <View
            className={`flex-1 py-3 text-center ${activeTab === 'used' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('used')}
          >
            <Text className={`text-base font-medium ${activeTab === 'used' ? 'text-orange-500' : 'text-gray-500'}`}>
              已使用/已过期 ({usedCoupons.length})
            </Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 py-4">
        {displayCoupons.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Ticket size={48} color="#9CA3AF" />
            <Text className="block text-gray-400 mt-4">暂无优惠券</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            {displayCoupons.map((coupon) => (
              <Card key={coupon.id} className="overflow-hidden">
                <View className="flex flex-row">
                  <View className="w-28 bg-gradient-to-r from-orange-500 to-orange-400 flex flex-col items-center justify-center p-4">
                    <Text className="block text-2xl font-bold text-white">
                      {getCouponValue(coupon)}
                    </Text>
                    {coupon.minAmount > 0 && (
                      <Text className="block text-xs text-white text-opacity-80 mt-1">
                        满{coupon.minAmount}可用
                      </Text>
                    )}
                    {coupon.minAmount === 0 && (
                      <Text className="block text-xs text-white text-opacity-80 mt-1">
                        无门槛
                      </Text>
                    )}
                  </View>

                  <View className="flex-1 p-4 bg-white">
                    <View className="flex flex-row items-center justify-between mb-2">
                      <Text className="block text-base font-semibold text-gray-800">
                        {coupon.title}
                      </Text>
                      {coupon.status === 'available' && (
                        <View className="px-2 py-1 bg-orange-100 rounded">
                          <Text className="block text-xs text-orange-500">待使用</Text>
                        </View>
                      )}
                      {coupon.status === 'used' && (
                        <View className="px-2 py-1 bg-gray-100 rounded">
                          <Text className="block text-xs text-gray-500">已使用</Text>
                        </View>
                      )}
                      {coupon.status === 'expired' && (
                        <View className="px-2 py-1 bg-gray-100 rounded">
                          <Text className="block text-xs text-gray-500">已过期</Text>
                        </View>
                      )}
                    </View>

                    <Text className="block text-xs text-gray-500 mb-2">
                      {coupon.description}
                    </Text>

                    <View className="flex flex-row items-center">
                      <Clock size={12} color="#9CA3AF" />
                      <Text className="block text-xs text-gray-400 ml-1">
                        有效期至: {coupon.validUntil}
                      </Text>
                    </View>

                    {coupon.status === 'available' && (
                      <View className="mt-3">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-orange-500 text-white w-full"
                        >
                          立即使用
                        </Button>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View className="mt-6">
          <View className="flex flex-col items-center">
            <Gift size={32} color="#FF6B35" />
            <Text className="block text-base font-medium text-gray-800 mt-2">更多优惠券</Text>
            <Text className="block text-sm text-gray-500 mt-1">关注公众号获取更多优惠</Text>
            <Button className="mt-4 bg-orange-500 text-white">去领取</Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CouponsPage;
