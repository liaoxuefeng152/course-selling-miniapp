export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '直播观看',
    })
  : { navigationBarTitleText: '直播观看' };
