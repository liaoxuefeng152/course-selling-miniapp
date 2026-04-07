export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '课程列表' })
  : { navigationBarTitleText: '课程列表' }
