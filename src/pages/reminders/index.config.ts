export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '课程提醒' })
  : { navigationBarTitleText: '课程提醒' }
