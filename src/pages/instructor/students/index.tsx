import { View, Text } from '@tarojs/components'
import { Users } from 'lucide-react-taro'
import { Card, CardContent } from '@/components/ui/card'

const StudentsPage = () => {
  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <Text className="block text-2xl font-bold text-gray-800 mb-6">学员管理</Text>

      <Card>
        <CardContent className="p-8 text-center">
          <Users size={64} color="#10B981" />
          <Text className="block text-lg font-semibold text-gray-800 mt-4">功能开发中</Text>
          <Text className="block text-sm text-gray-500 mt-2">
            学员管理功能正在开发中，敬请期待！
          </Text>
        </CardContent>
      </Card>
    </View>
  )
}

export default StudentsPage
