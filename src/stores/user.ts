import { create } from 'zustand'

// 用户角色枚举
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

// 讲师认证状态枚举
export enum InstructorStatus {
  UNVERIFIED = 'unverified',      // 未认证
  PENDING = 'pending',            // 审核中
  VERIFIED = 'verified',          // 已认证
  REJECTED = 'rejected',          // 已拒绝
}

// 认证类型枚举
export enum CertifyType {
  PERSONAL = 'personal',          // 个人认证
  ORGANIZATION = 'organization',  // 机构认证
}

// 用户信息接口
export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  email?: string
  role: UserRole
}

// 讲师认证信息接口
export interface InstructorInfo {
  userId: string
  status: InstructorStatus
  certifyType: CertifyType
  realName?: string                // 个人认证：真实姓名
  idCard?: string                  // 个人认证：身份证号
  idCardFront?: string             // 身份证正面
  idCardBack?: string              // 身份证背面
  organizationName?: string        // 机构认证：机构名称
  businessLicense?: string         // 机构认证：营业执照
  legalPersonIdCard?: string       // 机构认证：法人身份证
  contactPhone?: string
  rejectReason?: string            // 拒绝原因
  createdAt: string
  updatedAt: string
}

// 讲师统计数据接口
export interface InstructorStats {
  todaySales: number               // 今日销售额
  totalSales: number               // 总销售额
  courseCount: number              // 课程总数
  liveCount: number                // 直播场次
  studentCount: number             // 学员总数
}

// 用户状态管理接口
interface UserState {
  // 用户信息
  userInfo: UserInfo | null
  token: string
  isLoggedIn: boolean

  // 讲师信息
  instructorInfo: InstructorInfo | null
  instructorStats: InstructorStats | null

  // 设置用户信息
  setUserInfo: (info: UserInfo) => void
  setToken: (token: string) => void

  // 设置讲师信息
  setInstructorInfo: (info: InstructorInfo | null) => void
  setInstructorStats: (stats: InstructorStats | null) => void

  // 登录
  login: (info: UserInfo, token: string) => void

  // 退出登录
  logout: () => void

  // 切换身份
  switchRole: (role: UserRole) => void

  // 检查权限
  isInstructor: () => boolean
  isVerifiedInstructor: () => boolean
  canAccessInstructorFeatures: () => boolean
}

// 创建用户状态管理 Store
export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  userInfo: null,
  token: '',
  isLoggedIn: false,
  instructorInfo: null,
  instructorStats: null,

  // 设置用户信息
  setUserInfo: (info) => set({ userInfo: info }),

  // 设置 token
  setToken: (token) => {
    set({ token })
    // 保存到本地存储
    try {
      localStorage.setItem('token', token)
    } catch (e) {
      console.error('保存 token 失败:', e)
    }
  },

  // 设置讲师信息
  setInstructorInfo: (info) => {
    set({ instructorInfo: info })
    // 保存到本地存储
    try {
      if (info) {
        localStorage.setItem('instructorInfo', JSON.stringify(info))
      } else {
        localStorage.removeItem('instructorInfo')
      }
    } catch (e) {
      console.error('保存讲师信息失败:', e)
    }
  },

  // 设置讲师统计数据
  setInstructorStats: (stats) => set({ instructorStats: stats }),

  // 登录
  login: (info, token) => {
    set({
      userInfo: info,
      token,
      isLoggedIn: true,
    })
    // 保存到本地存储
    try {
      localStorage.setItem('userInfo', JSON.stringify(info))
      localStorage.setItem('token', token)
      localStorage.setItem('isLoggedIn', 'true')
    } catch (e) {
      console.error('保存登录信息失败:', e)
    }
  },

  // 退出登录
  logout: () => {
    set({
      userInfo: null,
      token: '',
      isLoggedIn: false,
      instructorInfo: null,
      instructorStats: null,
    })
    // 清除本地存储
    try {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('instructorInfo')
    } catch (e) {
      console.error('清除本地存储失败:', e)
    }
  },

  // 切换身份
  switchRole: (role) => {
    const { userInfo } = get()
    if (userInfo) {
      set({
        userInfo: { ...userInfo, role },
      })
      // 保存到本地存储
      try {
        localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, role }))
      } catch (e) {
        console.error('保存用户信息失败:', e)
      }
    }
  },

  // 检查是否是讲师
  isInstructor: () => {
    const { userInfo } = get()
    return userInfo?.role === UserRole.INSTRUCTOR || userInfo?.role === UserRole.ADMIN
  },

  // 检查是否是已认证讲师
  isVerifiedInstructor: () => {
    const { instructorInfo } = get()
    return instructorInfo?.status === InstructorStatus.VERIFIED
  },

  // 检查是否可以使用讲师功能
  canAccessInstructorFeatures: () => {
    const { isLoggedIn, isInstructor, isVerifiedInstructor } = get()
    return isLoggedIn && isInstructor() && isVerifiedInstructor()
  },
}))

// 初始化时从本地存储加载用户信息
export const initUserStore = () => {
  try {
    const userInfoStr = localStorage.getItem('userInfo')
    const token = localStorage.getItem('token')
    const isLoggedInStr = localStorage.getItem('isLoggedIn')
    const instructorInfoStr = localStorage.getItem('instructorInfo')

    if (userInfoStr && token) {
      const userInfo = JSON.parse(userInfoStr)
      useUserStore.setState({
        userInfo,
        token,
        isLoggedIn: isLoggedInStr === 'true',
      })
    }

    if (instructorInfoStr) {
      const instructorInfo = JSON.parse(instructorInfoStr)
      useUserStore.setState({ instructorInfo })
    }
  } catch (e) {
    console.error('初始化用户状态失败:', e)
  }
}
