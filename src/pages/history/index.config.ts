export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '学习历史' })
  : { navigationBarTitleText: '学习历史' }
