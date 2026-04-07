export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '直播课堂' })
  : { navigationBarTitleText: '直播课堂' }
