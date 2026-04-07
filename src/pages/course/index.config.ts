export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '课程详情' })
  : { navigationBarTitleText: '课程详情' }
