export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '帮助与反馈' })
  : { navigationBarTitleText: '帮助与反馈' }
