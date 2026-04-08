import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import {
  BookOpen,
  Plus,
  Pencil,
  Ellipsis,
} from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Network } from '@/network'
import { useUserStore } from '@/stores/user'

interface Course {
  id: string
  title: string
  description: string
  coverImage: string
  price: number
  originalPrice: number
  category: string
  tags: string[]
  status: 'draft' | 'published'
  viewCount: number
  purchaseCount: number
  createdAt: string
}

const InstructorCoursesPage = () => {
  const { userInfo } = useUserStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')

  // 加载课程列表
  const loadCourses = async () => {
    if (!userInfo) return

    setLoading(true)
    try {
      const res = await Network.request({
        url: '/api/courses',
        method: 'GET',
        data: {
          page: 1,
          pageSize: 50,
          status: statusFilter === 'all' ? undefined : statusFilter,
          keyword: keyword || undefined,
        },
      })

      console.log('课程列表响应:', res.data)

      if (res.data?.code === 200 && res.data?.data?.items) {
        setCourses(res.data.data.items)
      } else {
        setCourses([])
      }
    } catch (error) {
      console.error('加载课程列表失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [statusFilter, keyword])

  // 创建课程
  const handleCreate = () => {
    Taro.navigateTo({ url: '/pages/instructor/courses/edit' })
  }

  // 编辑课程
  const handleEdit = (courseId: string) => {
    Taro.navigateTo({
      url: `/pages/instructor/courses/edit?id=${courseId}`,
    })
  }

  // 删除课程
  const handleDelete = async (courseId: string) => {
    const { confirm } = await Taro.showModal({
      title: '确认删除',
      content: '确定要删除该课程吗？删除后无法恢复。',
    })

    if (!confirm) return

    try {
      const res = await Network.request({
        url: `/api/courses/${courseId}`,
        method: 'DELETE',
      })

      console.log('删除课程响应:', res.data)

      if (res.data?.code === 200) {
        Taro.showToast({ title: '删除成功', icon: 'success' })
        loadCourses()
      } else {
        Taro.showToast({ title: res.data?.msg || '删除失败', icon: 'none' })
      }
    } catch (error) {
      console.error('删除课程失败:', error)
      Taro.showToast({ title: '删除失败', icon: 'none' })
    }
  }

  // 发布/下架课程
  const handlePublish = async (courseId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const action = newStatus === 'published' ? '发布' : '下架'

    const { confirm } = await Taro.showModal({
      title: `确认${action}`,
      content: `确定要${action}该课程吗？`,
    })

    if (!confirm) return

    try {
      const res = await Network.request({
        url: `/api/courses/${courseId}/publish`,
        method: 'POST',
        data: { status: newStatus },
      })

      console.log(`${action}课程响应:`, res.data)

      if (res.data?.code === 200) {
        Taro.showToast({ title: `${action}成功`, icon: 'success' })
        loadCourses()
      } else {
        Taro.showToast({ title: res.data?.msg || `${action}失败`, icon: 'none' })
      }
    } catch (error) {
      console.error(`${action}课程失败:`, error)
      Taro.showToast({ title: `${action}失败`, icon: 'none' })
    }
  }

  // 显示操作菜单
  const showActionSheet = (course: Course) => {
    Taro.showActionSheet({
      itemList: [
        course.status === 'draft' ? '发布课程' : '下架课程',
        '编辑课程',
        '删除课程',
      ],
      success: async (res) => {
        switch (res.tapIndex) {
          case 0:
            handlePublish(course.id, course.status)
            break
          case 1:
            handleEdit(course.id)
            break
          case 2:
            handleDelete(course.id)
            break
        }
      },
    })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4 sticky top-0 z-10">
        <View className="flex flex-row items-center justify-between mb-3">
          <Text className="block text-lg font-semibold text-gray-800">课程管理</Text>
          <Button size="sm" onClick={handleCreate}>
            <Plus size={16} color="#FFFFFF" />
            <Text className="ml-1">新建课程</Text>
          </Button>
        </View>

        {/* 搜索框 */}
        <View className="flex flex-row gap-2">
          <View className="flex-1">
            <Input
              placeholder="搜索课程名称"
              value={keyword}
              onInput={(e) => setKeyword(e.detail.value)}
              className="bg-gray-50"
            />
          </View>
          <Button variant="outline" size="sm" onClick={() => setStatusFilter('all')}>
            <Text className={statusFilter === 'all' ? 'text-orange-500' : ''}>全部</Text>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatusFilter('published')}>
            <Text className={statusFilter === 'published' ? 'text-orange-500' : ''}>已发布</Text>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatusFilter('draft')}>
            <Text className={statusFilter === 'draft' ? 'text-orange-500' : ''}>草稿</Text>
          </Button>
        </View>
      </View>

      {/* 课程列表 */}
      <ScrollView scrollY className="flex-1">
        {loading ? (
          <View className="p-8 text-center">
            <Text className="block text-gray-500">加载中...</Text>
          </View>
        ) : courses.length === 0 ? (
          <View className="p-8 text-center">
            <BookOpen size={48} color="#9CA3AF" />
            <Text className="block text-gray-500 mt-4">暂无课程</Text>
            <Text className="block text-sm text-gray-400 mt-2">点击上方「新建课程」开始创建</Text>
          </View>
        ) : (
          <View className="p-4 space-y-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <View className="flex flex-row">
                    {/* 课程封面 */}
                    <Image
                      src={course.coverImage || 'https://via.placeholder.com/160x120'}
                      className="w-24 h-20 rounded-lg flex-shrink-0"
                      mode="aspectFill"
                    />
                    {/* 课程信息 */}
                    <View className="flex-1 ml-4">
                      <View className="flex flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text className="block text-base font-medium text-gray-800 line-clamp-2">
                            {course.title}
                          </Text>
                          <View className="flex flex-row items-center mt-2 gap-2">
                            <Text className="block text-orange-500 font-bold">¥{course.price}</Text>
                            {course.originalPrice > course.price && (
                              <Text className="block text-sm text-gray-400 line-through">
                                ¥{course.originalPrice}
                              </Text>
                            )}
                          </View>
                        </View>
                        <Badge
                          variant={course.status === 'published' ? 'default' : 'secondary'}
                        >
                          {course.status === 'published' ? '已发布' : '草稿'}
                        </Badge>
                      </View>
                      {/* 统计数据 */}
                      <View className="flex flex-row items-center mt-3 gap-4 text-xs text-gray-500">
                        <View className="flex flex-row items-center">
                          <Text>{course.viewCount} 浏览</Text>
                        </View>
                        <View className="flex flex-row items-center">
                          <Text>{course.purchaseCount} 购买</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* 操作按钮 */}
                  <View className="flex flex-row gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(course.id)}
                    >
                      <Pencil size={14} color="#6B7280" />
                      <Text className="ml-1">编辑</Text>
                    </Button>
                    {course.status === 'draft' ? (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500"
                        onClick={() => handlePublish(course.id, course.status)}
                      >
                        <Text>发布</Text>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePublish(course.id, course.status)}
                      >
                        <Text>下架</Text>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => showActionSheet(course)}
                    >
                      <Ellipsis size={16} color="#6B7280" />
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default InstructorCoursesPage
