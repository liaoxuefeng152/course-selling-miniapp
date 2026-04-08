import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { ArrowLeft, Save, Upload, Plus, Trash2, ChevronRight } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input as UIInput } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Network } from '@/network'
import { useUserStore } from '@/stores/user'

const CourseEditPage = () => {
  const { userInfo } = useUserStore()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    price: '',
    originalPrice: '',
    category: '',
    tags: [] as string[],
    chapters: [] as any[],
  })

  const [tagInput, setTagInput] = useState('')

  // 加载课程详情
  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const id = instance.router?.params?.id

    if (id) {
      setCourseId(id)
      loadCourseDetail(id)
    }
  }, [])

  const loadCourseDetail = async (id: string) => {
    setLoading(true)
    try {
      const res = await Network.request({
        url: `/api/courses/${id}`,
        method: 'GET',
      })

      console.log('课程详情响应:', res.data)

      if (res.data?.code === 200 && res.data?.data) {
        const course = res.data.data
        setFormData({
          title: course.title || '',
          description: course.description || '',
          coverImage: course.coverImage || '',
          price: course.price?.toString() || '',
          originalPrice: course.originalPrice?.toString() || '',
          category: course.category || '',
          tags: course.tags || [],
          chapters: course.chapters || [],
        })
      }
    } catch (error) {
      console.error('加载课程详情失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 上传封面
  const handleUploadCover = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })

      if (res.tempFilePaths && res.tempFilePaths.length > 0) {
        // TODO: 实际应该上传到对象存储
        setFormData({ ...formData, coverImage: res.tempFilePaths[0] })
      }
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  // 添加标签
  const handleAddTag = () => {
    if (!tagInput.trim()) return

    if (formData.tags.includes(tagInput.trim())) {
      Taro.showToast({ title: '标签已存在', icon: 'none' })
      return
    }

    if (formData.tags.length >= 5) {
      Taro.showToast({ title: '最多添加5个标签', icon: 'none' })
      return
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tagInput.trim()],
    })
    setTagInput('')
  }

  // 删除标签
  const handleRemoveTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index)
    setFormData({ ...formData, tags: newTags })
  }

  // 保存课程
  const handleSave = async () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入课程标题', icon: 'none' })
      return
    }

    if (!formData.coverImage) {
      Taro.showToast({ title: '请上传课程封面', icon: 'none' })
      return
    }

    if (!formData.price || Number.isNaN(Number(formData.price))) {
      Taro.showToast({ title: '请输入正确的价格', icon: 'none' })
      return
    }

    setSaving(true)
    try {
      const data = {
        ...formData,
        instructorId: userInfo?.id,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
      }

      let res
      if (courseId) {
        // 更新课程
        res = await Network.request({
          url: `/api/courses/${courseId}`,
          method: 'PUT',
          data,
        })
      } else {
        // 创建课程
        res = await Network.request({
          url: '/api/courses',
          method: 'POST',
          data,
        })
      }

      console.log('保存课程响应:', res.data)

      if (res.data?.code === 200) {
        Taro.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        Taro.showToast({ title: res.data?.msg || '保存失败', icon: 'none' })
      }
    } catch (error) {
      console.error('保存课程失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4 sticky top-0 z-10">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center" onClick={() => Taro.navigateBack()}>
            <ArrowLeft size={24} color="#374151" />
            <Text className="block text-lg font-semibold text-gray-800 ml-4">
              {courseId ? '编辑课程' : '新建课程'}
            </Text>
          </View>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save size={16} color="#FFFFFF" />
            <Text className="ml-1">{saving ? '保存中...' : '保存'}</Text>
          </Button>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 p-4">
        {/* 基本信息 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-medium text-gray-800 mb-4">基本信息</Text>

            {/* 课程标题 */}
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程标题 *</Text>
              <UIInput
                placeholder="请输入课程标题"
                value={formData.title}
                onInput={(e) => setFormData({ ...formData, title: e.detail.value })}
                maxlength={100}
              />
            </View>

            {/* 课程描述 */}
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程描述</Text>
              <Textarea
                placeholder="请输入课程描述"
                value={formData.description}
                onInput={(e) => setFormData({ ...formData, description: e.detail.value })}
                maxlength={500}
                style={{
                  minHeight: '100px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '12px',
                  padding: '12px',
                  width: '100%',
                }}
              />
            </View>

            {/* 课程封面 */}
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程封面 *</Text>
              {formData.coverImage ? (
                <View className="relative">
                  <Image
                    src={formData.coverImage}
                    className="w-full h-48 rounded-lg"
                    mode="aspectFill"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </Button>
                </View>
              ) : (
                <View
                  className="w-full h-48 rounded-lg bg-gray-100 flex flex-col items-center justify-center border-2 border-dashed border-gray-300"
                  onClick={handleUploadCover}
                >
                  <Upload size={32} color="#9CA3AF" />
                  <Text className="block text-sm text-gray-500 mt-2">点击上传封面</Text>
                </View>
              )}
            </View>

            {/* 课程分类 */}
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程分类</Text>
              <UIInput
                placeholder="请输入课程分类"
                value={formData.category}
                onInput={(e) => setFormData({ ...formData, category: e.detail.value })}
              />
            </View>

            {/* 课程价格 */}
            <View className="mb-4">
              <Text className="block text-sm font-medium text-gray-700 mb-2">课程价格 *</Text>
              <View className="flex flex-row gap-3">
                <View className="flex-1">
                  <UIInput
                    type="number"
                    placeholder="售价"
                    value={formData.price}
                    onInput={(e) => setFormData({ ...formData, price: e.detail.value })}
                  />
                </View>
                <View className="flex-1">
                  <UIInput
                    type="number"
                    placeholder="原价（选填）"
                    value={formData.originalPrice}
                    onInput={(e) => setFormData({ ...formData, originalPrice: e.detail.value })}
                  />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 课程标签 */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="block text-base font-medium text-gray-800 mb-4">课程标签</Text>
            <View className="flex flex-row gap-2 mb-3">
              <View className="flex-1">
                <UIInput
                  placeholder="输入标签后按添加按钮"
                  value={tagInput}
                  onInput={(e) => setTagInput(e.detail.value)}
                />
              </View>
              <Button variant="outline" size="sm" onClick={handleAddTag}>
                <Plus size={16} color="#6B7280" />
              </Button>
            </View>
            <View className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <View
                  key={index}
                  className="px-3 py-2 bg-orange-50 rounded-full flex flex-row items-center"
                >
                  <Text className="text-sm text-orange-600">{tag}</Text>
                  <View
                    className="ml-2"
                    onClick={() => handleRemoveTag(index)}
                  >
                    <Trash2 size={12} color="#EF4444" />
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 课程章节 */}
        <Card>
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="block text-base font-medium text-gray-800">课程章节</Text>
              <Button variant="outline" size="sm">
                <Plus size={14} color="#6B7280" />
                <Text className="ml-1">添加章节</Text>
              </Button>
            </View>
            {formData.chapters.length === 0 ? (
              <View className="py-8 text-center">
                <Text className="block text-sm text-gray-500">暂无章节</Text>
              </View>
            ) : (
              <View className="space-y-3">
                {formData.chapters.map((chapter, index) => (
                  <View
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg flex flex-row items-center justify-between"
                  >
                    <View className="flex-1">
                      <Text className="block text-sm font-medium text-gray-800">
                        第{index + 1}章：{chapter.title}
                      </Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}

export default CourseEditPage
