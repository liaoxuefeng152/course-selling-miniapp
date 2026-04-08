import { View, Text } from '@tarojs/components'
import { Video, Plus } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const LivesPage = () => {
  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <Text className="block text-2xl font-bold text-gray-800 mb-6">直播管理</Text>

      <Card>
        <CardContent className="p-8 text-center">
          <Video size={64} color="#FF6B35" />
          <Text className="block text-lg font-semibold text-gray-800 mt-4">功能开发中</Text>
          <Text className="block text-sm text-gray-500 mt-2">
            直播管理功能正在开发中，敬请期待！
          </Text>
          <Button className="mt-6" disabled>
            <Plus size={16} color="#FFFFFF" />
            <Text className="ml-2">创建直播</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  )
}

export default LivesPage
