import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { ArrowLeft, User, Building, Upload, CircleAlert } from 'lucide-react-taro'
import { Button } from '@/components/ui/button'
import { Input as UIInput } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUserStore, CertifyType } from '@/stores/user'

const InstructorCertifyPage = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'organization'>('personal')
  const [loading, setLoading] = useState(false)

  // 个人认证表单数据
  const [personalForm, setPersonalForm] = useState({
    realName: '',
    idCard: '',
    idCardFront: '',
    idCardBack: '',
    contactPhone: '',
  })

  // 机构认证表单数据
  const [organizationForm, setOrganizationForm] = useState({
    organizationName: '',
    businessLicense: '',
    legalPersonIdCard: '',
    contactPhone: '',
  })

  const handleChooseImage = (field: string, maxCount: number = 1) => {
    Taro.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]

        if (activeTab === 'personal') {
          setPersonalForm((prev) => ({ ...prev, [field]: tempFilePath }))
        } else {
          setOrganizationForm((prev) => ({ ...prev, [field]: tempFilePath }))
        }
      },
    })
  }

  const handleSubmit = async () => {
    const form = activeTab === 'personal' ? personalForm : organizationForm

    // 表单验证
    if (activeTab === 'personal') {
      const personalFormTyped = personalForm as any
      if (!personalFormTyped.realName) {
        Taro.showToast({ title: '请输入真实姓名', icon: 'none' })
        return
      }
      if (!personalFormTyped.idCard) {
        Taro.showToast({ title: '请输入身份证号', icon: 'none' })
        return
      }
      if (!/^\d{17}[\dXx]$/.test(personalFormTyped.idCard)) {
        Taro.showToast({ title: '身份证号格式不正确', icon: 'none' })
        return
      }
      if (!personalFormTyped.idCardFront) {
        Taro.showToast({ title: '请上传身份证正面', icon: 'none' })
        return
      }
      if (!personalFormTyped.idCardBack) {
        Taro.showToast({ title: '请上传身份证反面', icon: 'none' })
        return
      }
      if (!personalFormTyped.contactPhone) {
        Taro.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      if (!/^1[3-9]\d{9}$/.test(personalFormTyped.contactPhone)) {
        Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
    } else {
      const organizationFormTyped = organizationForm as any
      if (!organizationFormTyped.organizationName) {
        Taro.showToast({ title: '请输入机构名称', icon: 'none' })
        return
      }
      if (!organizationFormTyped.businessLicense) {
        Taro.showToast({ title: '请上传营业执照', icon: 'none' })
        return
      }
      if (!organizationFormTyped.legalPersonIdCard) {
        Taro.showToast({ title: '请上传法人身份证', icon: 'none' })
        return
      }
      if (!organizationFormTyped.contactPhone) {
        Taro.showToast({ title: '请输入联系电话', icon: 'none' })
        return
      }
      if (!/^1[3-9]\d{9}$/.test(organizationFormTyped.contactPhone)) {
        Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }
    }

    setLoading(true)

    try {
      // 模拟提交认证
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 保存讲师认证信息
      useUserStore.getState().setInstructorInfo({
        userId: useUserStore.getState().userInfo?.id || '',
        status: 'pending' as any,
        certifyType: activeTab === 'personal' ? CertifyType.PERSONAL : CertifyType.ORGANIZATION,
        realName: activeTab === 'personal' ? (form as any).realName : undefined,
        idCard: activeTab === 'personal' ? (form as any).idCard : undefined,
        idCardFront: activeTab === 'personal' ? (form as any).idCardFront : undefined,
        idCardBack: activeTab === 'personal' ? (form as any).idCardBack : undefined,
        organizationName: activeTab === 'organization' ? (form as any).organizationName : undefined,
        businessLicense: activeTab === 'organization' ? (form as any).businessLicense : undefined,
        legalPersonIdCard: activeTab === 'organization' ? (form as any).legalPersonIdCard : undefined,
        contactPhone: (form as any).contactPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      Taro.showToast({ title: '提交成功，等待审核', icon: 'success' })

      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } catch (error) {
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <View className="bg-white px-4 py-4">
        <View className="flex flex-row items-center">
          <View onClick={() => Taro.navigateBack()}>
            <ArrowLeft size={24} color="#374151" />
          </View>
          <Text className="block text-lg font-semibold text-gray-800 ml-4">讲师认证</Text>
        </View>
      </View>

      <ScrollView scrollY className="flex-1 px-4 mt-4">
        <Card>
          <CardContent className="p-6">
            <View className="mb-6">
              <Text className="block text-sm font-medium text-gray-700 mb-3">认证类型</Text>
              <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="personal">
                    <User size={16} color="#6B7280" className="mr-2" />
                    个人认证
                  </TabsTrigger>
                  <TabsTrigger value="organization">
                    <Building size={16} color="#6B7280" className="mr-2" />
                    机构认证
                  </TabsTrigger>
                </TabsList>

                {/* 个人认证表单 */}
                <TabsContent value="personal" className="mt-4">
                  <View className="space-y-4">
                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">真实姓名 *</Text>
                      <UIInput
                        placeholder="请输入真实姓名"
                        value={personalForm.realName}
                        onInput={(e) => setPersonalForm({ ...personalForm, realName: e.detail.value })}
                      />
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">身份证号 *</Text>
                      <UIInput
                        type="idcard"
                        placeholder="请输入身份证号"
                        value={personalForm.idCard}
                        onInput={(e) => setPersonalForm({ ...personalForm, idCard: e.detail.value })}
                      />
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">身份证正面 *</Text>
                      <View
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-32"
                        onClick={() => handleChooseImage('idCardFront')}
                      >
                        {personalForm.idCardFront ? (
                          <Image
                            src={personalForm.idCardFront}
                            mode="aspectFit"
                            className="w-full h-full"
                          />
                        ) : (
                          <>
                            <Upload size={32} color="#9CA3AF" />
                            <Text className="block text-sm text-gray-500 mt-2">点击上传身份证正面</Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">身份证反面 *</Text>
                      <View
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-32"
                        onClick={() => handleChooseImage('idCardBack')}
                      >
                        {personalForm.idCardBack ? (
                          <Image
                            src={personalForm.idCardBack}
                            mode="aspectFit"
                            className="w-full h-full"
                          />
                        ) : (
                          <>
                            <Upload size={32} color="#9CA3AF" />
                            <Text className="block text-sm text-gray-500 mt-2">点击上传身份证反面</Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">联系电话 *</Text>
                      <UIInput
                        type="number"
                        placeholder="请输入联系电话"
                        value={personalForm.contactPhone}
                        onInput={(e) => setPersonalForm({ ...personalForm, contactPhone: e.detail.value })}
                        maxlength={11}
                      />
                    </View>
                  </View>
                </TabsContent>

                {/* 机构认证表单 */}
                <TabsContent value="organization" className="mt-4">
                  <View className="space-y-4">
                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">机构名称 *</Text>
                      <UIInput
                        placeholder="请输入机构名称"
                        value={organizationForm.organizationName}
                        onInput={(e) => setOrganizationForm({ ...organizationForm, organizationName: e.detail.value })}
                      />
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">营业执照 *</Text>
                      <View
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-32"
                        onClick={() => handleChooseImage('businessLicense')}
                      >
                        {organizationForm.businessLicense ? (
                          <Image
                            src={organizationForm.businessLicense}
                            mode="aspectFit"
                            className="w-full h-full"
                          />
                        ) : (
                          <>
                            <Upload size={32} color="#9CA3AF" />
                            <Text className="block text-sm text-gray-500 mt-2">点击上传营业执照</Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">法人身份证 *</Text>
                      <View
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-32"
                        onClick={() => handleChooseImage('legalPersonIdCard')}
                      >
                        {organizationForm.legalPersonIdCard ? (
                          <Image
                            src={organizationForm.legalPersonIdCard}
                            mode="aspectFit"
                            className="w-full h-full"
                          />
                        ) : (
                          <>
                            <Upload size={32} color="#9CA3AF" />
                            <Text className="block text-sm text-gray-500 mt-2">点击上传法人身份证</Text>
                          </>
                        )}
                      </View>
                    </View>

                    <View>
                      <Text className="block text-sm text-gray-600 mb-2">联系电话 *</Text>
                      <UIInput
                        type="number"
                        placeholder="请输入联系电话"
                        value={organizationForm.contactPhone}
                        onInput={(e) => setOrganizationForm({ ...organizationForm, contactPhone: e.detail.value })}
                        maxlength={11}
                      />
                    </View>
                  </View>
                </TabsContent>
              </Tabs>
            </View>

            {/* 提交按钮 */}
            <Button
              className="w-full bg-orange-500 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '提交中...' : '提交认证'}
            </Button>

            {/* 提示信息 */}
            <View className="mt-4 px-4 py-3 bg-orange-50 rounded-xl">
              <View className="flex flex-row items-start">
                <CircleAlert size={16} color="#FF6B35" className="mt-1 mr-2 flex-shrink-0" />
                <View className="flex-1">
                  <Text className="block text-xs text-orange-700 font-medium">温馨提示</Text>
                  <Text className="block text-xs text-orange-600 mt-1">
                    提交认证后，预计 1-2 个工作日内完成审核。审核通过后即可使用讲师功能。
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  )
}

export default InstructorCertifyPage
