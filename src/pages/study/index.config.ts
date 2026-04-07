export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的学习' })
  : { navigationBarTitleText: '我的学习' }
