export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '我的评价' })
  : { navigationBarTitleText: '我的评价' }
