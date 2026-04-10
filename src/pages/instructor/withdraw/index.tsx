import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, DollarSign, Calendar, History } from 'lucide-react-taro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from '@/network';

interface WithdrawRecord {
  id: number;
  amount: number;
  bankAccount: string;
  bankName: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  applyTime: string;
  completeTime?: string;
}

const WithdrawPage = () => {
  const [balance] = useState(12580.00);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  // 账户信息目前为只读，需要修改请前往PC端
  const bankName = '中国工商银行';
  const bankAccount = '6222 0000 0000 0000';
  const accountName = '张三';
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [records] = useState<WithdrawRecord[]>([
    {
      id: 1,
      amount: 5000,
      bankAccount: '6222 **** **** 1234',
      bankName: '中国工商银行',
      status: 'success',
      applyTime: '2024-04-08 14:30:00',
      completeTime: '2024-04-08 16:45:00',
    },
    {
      id: 2,
      amount: 3000,
      bankAccount: '6222 **** **** 1234',
      bankName: '中国工商银行',
      status: 'processing',
      applyTime: '2024-04-10 09:15:00',
    },
    {
      id: 3,
      amount: 2000,
      bankAccount: '6222 **** **** 1234',
      bankName: '中国工商银行',
      status: 'failed',
      applyTime: '2024-04-05 11:20:00',
    },
  ]);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      pending: { label: '待审核', color: 'bg-amber-500' },
      processing: { label: '处理中', color: 'bg-blue-500' },
      success: { label: '已到账', color: 'bg-green-500' },
      failed: { label: '失败', color: 'bg-red-500' },
    };
    return config[status] || { label: '', color: 'bg-gray-500' };
  };

  const handleWithdraw = async () => {
    // 验证提现金额
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      Taro.showToast({ title: '请输入提现金额', icon: 'none' });
      return;
    }

    if (amount > balance) {
      Taro.showToast({ title: '提现金额超过可用余额', icon: 'none' });
      return;
    }

    if (amount < 100) {
      Taro.showToast({ title: '最低提现金额为100元', icon: 'none' });
      return;
    }

    setLoading(true);

    try {
      // 调用后端接口申请提现
      const res = await Network.request({
        url: '/api/instructor/withdraw/apply',
        method: 'POST',
        data: {
          amount,
          bankName,
          bankAccount: bankAccount.replace(/\s/g, ''),
          accountName,
        },
      });

      console.log('提现申请响应:', res.data);

      if (res.data?.code === 200) {
        Taro.showToast({ title: '提现申请已提交', icon: 'success' });

        // 清空输入
        setWithdrawAmount('');

        // 切换到历史记录标签
        setActiveTab('all');
      } else {
        throw new Error(res.data?.msg || '提现申请失败');
      }
    } catch (error: any) {
      console.error('提现申请失败:', error);

      // 判断是否是网络错误或后端未实现
      if (error.message?.includes('Network') || error.message?.includes('404')) {
        // 模拟提现成功（开发环境）
        Taro.showModal({
          title: '开发环境提示',
          content: `后端接口未实现，是否模拟提现成功？\n\n提现金额：¥${amount.toFixed(2)}`,
          success: (res) => {
            if (res.confirm) {
              Taro.showToast({ title: '提现申请已提交', icon: 'success' });
              setWithdrawAmount('');
              setActiveTab('all');
            }
          },
        });
      } else {
        Taro.showToast({
          title: error.message || '提现申请失败，请重试',
          icon: 'none',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setWithdrawAmount(amount.toString());
  };

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待审核' },
    { key: 'processing', label: '处理中' },
    { key: 'success', label: '已到账' },
  ];

  const filteredRecords =
    activeTab === 'all'
      ? records
      : records.filter((r) => r.status === activeTab);

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center">
          <View onClick={() => Taro.navigateBack()}>
            <ArrowLeft size={24} color="#374151" />
          </View>
          <Text className="block text-lg font-semibold text-gray-800 ml-4">提现管理</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* 余额卡片 */}
        <View className="px-4 py-4">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-400">
            <CardContent className="p-6">
              <Text className="block text-white text-sm mb-2">可提现余额</Text>
              <View className="flex flex-row items-baseline">
                <Text className="text-4xl font-bold text-white">¥</Text>
                <Text className="text-4xl font-bold text-white ml-1">{balance.toFixed(2)}</Text>
              </View>
              <View className="mt-4 flex flex-row items-center">
                <Calendar size={14} color="#FFFFFF" />
                <Text className="text-white text-xs ml-2">每日提现额度：¥50000</Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 提现表单 */}
        <View className="px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-4">申请提现</Text>

              {/* 提现金额 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">提现金额</Text>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Text className="text-2xl font-bold text-gray-800 mr-2">¥</Text>
                  <Input
                    className="text-2xl font-bold bg-transparent border-0 p-0 inline-block"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onInput={(e) => setWithdrawAmount(e.detail.value)}
                    type="digit"
                  />
                </View>
                <Text className="text-xs text-gray-400 mt-2">最低提现金额：¥100</Text>
              </View>

              {/* 快捷金额 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">快捷金额</Text>
                <View className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map((amount) => (
                    <View
                      key={amount}
                      className={`py-2 rounded-lg text-center border ${
                        withdrawAmount === amount.toString()
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleQuickAmount(amount)}
                    >
                      <Text
                        className={`text-sm ${
                          withdrawAmount === amount.toString()
                            ? 'text-orange-500 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        {amount}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 提现账户 */}
              <View className="mb-4">
                <Text className="block text-sm text-gray-700 mb-2">提现账户</Text>
                <View className="bg-gray-50 rounded-xl p-3">
                  <View className="flex flex-row items-center mb-2">
                    <Text className="text-sm text-gray-500 w-20">开户行</Text>
                    <Text className="text-sm text-gray-800">{bankName}</Text>
                  </View>
                  <View className="flex flex-row items-center mb-2">
                    <Text className="text-sm text-gray-500 w-20">卡号</Text>
                    <Text className="text-sm text-gray-800">{bankAccount}</Text>
                  </View>
                  <View className="flex flex-row items-center">
                    <Text className="text-sm text-gray-500 w-20">户名</Text>
                    <Text className="text-sm text-gray-800">{accountName}</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-400 mt-2">* 如需修改账户信息，请前往PC端操作</Text>
              </View>

              {/* 提现说明 */}
              <View className="mb-4 p-3 bg-blue-50 rounded-xl">
                <View className="flex flex-row items-start">
                  <History size={16} color="#3B82F6" className="mt-1 mr-2 flex-shrink-0" />
                  <Text className="text-xs text-blue-800 leading-relaxed">
                    提现说明：
                    {'\n'}• 每日提现额度：¥50000
                    {'\n'}• 提现到账时间：1-3个工作日
                    {'\n'}• 提现手续费：免手续费
                    {'\n'}• 遇节假日可能延迟到账
                  </Text>
                </View>
              </View>

              {/* 提交按钮 */}
              <Button
                className="w-full bg-orange-500 text-white"
                onClick={handleWithdraw}
                disabled={loading}
              >
                {loading ? '提交中...' : '确认提现'}
              </Button>
            </CardContent>
          </Card>
        </View>

        {/* 提现记录 */}
        <View className="px-4 pb-4">
          <Card>
            <CardContent className="p-4">
              <Text className="block text-base font-semibold text-gray-800 mb-4">提现记录</Text>

              {/* 标签切换 */}
              <View className="flex flex-row mb-4 overflow-x-auto">
                {tabs.map((tab) => (
                  <View
                    key={tab.key}
                    className={`mr-4 pb-2 flex-shrink-0 ${
                      activeTab === tab.key
                        ? 'border-b-2 border-orange-500'
                        : 'border-b-2 border-transparent'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <Text
                      className={`text-sm ${
                        activeTab === tab.key
                          ? 'text-orange-500 font-semibold'
                          : 'text-gray-500'
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* 记录列表 */}
              {filteredRecords.length === 0 ? (
                <View className="flex flex-col items-center justify-center py-10">
                  <History size={48} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-2">暂无记录</Text>
                </View>
              ) : (
                <View className="flex flex-col gap-3">
                  {filteredRecords.map((record) => {
                    const badge = getStatusBadge(record.status);
                    return (
                      <Card key={record.id}>
                        <CardContent className="p-4">
                          <View className="flex flex-row items-center justify-between mb-2">
                            <Text className="text-base font-bold text-gray-800">
                              -¥{record.amount.toFixed(2)}
                            </Text>
                            <Badge className={`${badge.color} text-white text-xs border-0`}>
                              {badge.label}
                            </Badge>
                          </View>
                          <View className="flex flex-row items-center mb-1">
                            <DollarSign size={14} color="#9CA3AF" />
                            <Text className="text-xs text-gray-600 ml-1">{record.bankName}</Text>
                          </View>
                          <View className="flex flex-row items-center mb-1">
                            <Text className="text-xs text-gray-500 ml-6">{record.bankAccount}</Text>
                          </View>
                          <View className="flex flex-row items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <Text className="text-xs text-gray-500">{record.applyTime}</Text>
                            {record.completeTime && (
                              <Text className="text-xs text-gray-500">
                                {record.completeTime}
                              </Text>
                            )}
                          </View>
                        </CardContent>
                      </Card>
                    );
                  })}
                </View>
              )}
            </CardContent>
          </Card>
        </View>

        {/* 提示信息 */}
        <View className="px-4 mb-4">
          <View className="p-4 bg-orange-50 rounded-xl border border-orange-200">
            <Text className="text-sm text-orange-800">
              修改账户信息、查看详细账单等功能请在PC端完成
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WithdrawPage;
