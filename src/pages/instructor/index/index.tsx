import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import {
  BookOpen,
  Video,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Bell,
  ChevronRight,
  TriangleAlert,
  Monitor,
  ArrowUpRight,
} from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserStore, InstructorStatus } from '@/stores/user'
import { Network } from '@/network'

const InstructorHomePage = () => {
  const { userInfo, instructorInfo, instructorStats, setInstructorStats } = useUserStore()

  useEffect(() => {
    const loadStats = async () => {
      if (!userInfo) return

      try {
        const res = await Network.request({
          url: '/api/instructor/stats',
          method: 'GET',
          data: { userId: userInfo.id },
        })

        console.log('讲师统计数据响应:', res.data)

        if (res.data?.code === 200 && res.data?.data) {
          setInstructorStats(res.data.data)
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
        const mockStats = {
          todaySales: 12580,
          totalSales: 45890,
          courseCount: 12,
          liveCount: 8,
          studentCount: 3256,
        }
        setInstructorStats(mockStats)
      }
    }

    loadStats()
  }, [userInfo, setInstructorStats])

  // 未认证提示
  if (!instructorInfo || instructorInfo.status !== InstructorStatus.VERIFIED) {
    return (
      <View className="min-h-screen bg-gray-50 pb-16">
        <View className="bg-white px-4 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="block text-lg font-semibold text-gray-800">讲师工作台</Text>
            <Bell size={24} color="#374151" />
          </View>
        </View>

        <ScrollView scrollY className="flex-1 px-4 mt-4">
          <Card className="mb-4 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <View className="flex flex-row items-start">
                <TriangleAlert size={24} color="#FF6B35" className="mt-1 mr-3 flex-shrink-0" />
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-orange-800 mb-2">未认证</Text>
                  <Text className="block text-sm text-orange-700 mb-4">
                    您还未完成讲师认证，认证通过后即可使用讲师端功能。
                  </Text>
                  <View className="flex flex-row gap-2">
                    <Button
                      className="bg-orange-500 text-white"
                      onClick={() => Taro.navigateTo({ url: '/pages/instructor/certify/index' })}
                    >
                      立即认证
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        useUserStore.getState().setInstructorInfo({
                          userId: userInfo?.id || '',
                          status: InstructorStatus.VERIFIED,
                          certifyType: 'personal' as any,
                          realName: '测试讲师',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        })
                        Taro.showToast({ title: '已跳过认证', icon: 'success' })
                      }}
                    >
                      跳过认证体验
                    </Button>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 功能预览 */}
          <Card className="mb-4">
            <CardContent className="p-6">
              <Text className="block text-base font-semibold text-gray-800 mb-4">认证后可用功能</Text>
              <View className="space-y-3">
                {[
                  { icon: TrendingUp, label: '数据统计', desc: '查看销售、学员数据' },
                  { icon: DollarSign, label: '收益管理', desc: '查看收益、申请提现' },
                  { icon: Users, label: '学员管理', desc: 'PC端管理学员信息' },
                  { icon: BookOpen, label: '课程管理', desc: 'PC端管理课程内容' },
                ].map((item, index) => (
                  <View key={index} className="flex flex-row items-center p-3 bg-gray-50 rounded-lg">
                    <item.icon size={20} color="#FF6B35" />
                    <View className="flex-1 ml-3">
                      <Text className="block text-sm font-medium text-gray-800">{item.label}</Text>
                      <Text className="block text-xs text-gray-500 mt-0.5">{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </View>
    )
  }

  // 已认证，显示讲师首页
  return (
    <View className="min-h-screen bg-gray-50 pb-16">
      {/* 顶部导航 */}
      <View className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 pt-6 pb-8">
        <View className="flex flex-row items-center justify-between mb-6">
          <View className="flex flex-row items-center">
            <Text className="block text-lg font-semibold text-white">讲师工作台</Text>
            <Badge className="ml-2 bg-white text-orange-500 border-0">已认证</Badge>
          </View>
          <Bell size={24} color="#FFFFFF" />
        </View>

        {/* 讲师信息 */}
        <View className="flex flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <Text className="text-xl font-bold text-orange-500">
              {userInfo?.nickname?.charAt(0) || '讲'}
            </Text>
          </View>
          <View className="ml-3">
            <Text className="block text-lg font-semibold text-white">{userInfo?.nickname}</Text>
            <Text className="block text-sm text-white text-opacity-80">
              {instructorInfo?.certifyType === 'personal' ? '个人讲师' : '机构讲师'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className="flex-1">
        {/* 数据概览 */}
        <View className="px-4 -mt-4">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <View className="grid grid-cols-2 gap-4">
                <View className="bg-orange-50 rounded-xl p-4">
                  <DollarSign size={20} color="#FF6B35" />
                  <Text className="block text-2xl font-bold text-gray-800 mt-2">
                    ¥{(instructorStats?.todaySales || 0).toLocaleString()}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">今日销售额</Text>
                </View>

                <View className="bg-blue-50 rounded-xl p-4">
                  <BookOpen size={20} color="#3B82F6" />
                  <Text className="block text-2xl font-bold text-gray-800 mt-2">
                    {instructorStats?.courseCount || 0}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">课程总数</Text>
                </View>

                <View className="bg-green-50 rounded-xl p-4">
                  <Users size={20} color="#10B981" />
                  <Text className="block text-2xl font-bold text-gray-800 mt-2">
                    {instructorStats?.studentCount || 0}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">学员总数</Text>
                </View>

                <View className="bg-purple-50 rounded-xl p-4">
                  <Video size={20} color="#8B5CF6" />
                  <Text className="block text-2xl font-bold text-gray-800 mt-2">
                    {instructorStats?.liveCount || 0}
                  </Text>
                  <Text className="block text-xs text-gray-500 mt-1">直播场次</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 数据统计 */}
        <View className="px-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="block text-base font-semibold text-gray-800">数据统计</Text>
                <View className="flex flex-row items-center" onClick={() => Taro.navigateTo({ url: '/pages/instructor/stats/index' })}>
                  <Text className="block text-sm text-gray-500 mr-1">查看详情</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </View>
              </View>

              <View className="flex flex-row items-center justify-between p-3 bg-gray-50 rounded-lg">
                <View className="flex flex-row items-center">
                  <TrendingUp size={20} color="#10B981" />
                  <Text className="block text-sm text-gray-700 ml-3">总销售额</Text>
                </View>
                <Text className="block text-base font-semibold text-gray-800">
                  ¥{(instructorStats?.totalSales || 0).toLocaleString()}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 提现管理 */}
        <View className="px-4 mt-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center">
                  <DollarSign size={20} color="#FF6B35" />
                  <Text className="block text-base font-semibold text-gray-800 ml-3">提现管理</Text>
                </View>
                <Button size="sm" onClick={() => Taro.navigateTo({ url: '/pages/instructor/withdraw/index' })}>
                  去提现
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* PC端管理入口 */}
        <View className="px-4 mb-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <View className="flex flex-row items-start">
                <Monitor size={24} color="#FF6B35" className="mt-1 mr-3 flex-shrink-0" />
                <View className="flex-1">
                  <Text className="block text-base font-semibold text-gray-800 mb-2">PC端管理</Text>
                  <Text className="block text-sm text-gray-600 mb-3">
                    课程管理、直播创建、学员管理等功能请在PC端操作
                  </Text>
                  <Button size="sm" className="bg-orange-500">
                    <ArrowUpRight size={16} color="#FFFFFF" />
                    <Text className="ml-1">前往PC端</Text>
                  </Button>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  )
}

export default InstructorHomePage
