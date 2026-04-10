export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '直播中控台',
      navigationBarBackgroundColor: '#000',
      navigationBarTextStyle: 'white',
    })
  : {
      navigationBarTitleText: '直播中控台',
      navigationBarBackgroundColor: '#000',
      navigationBarTextStyle: 'white',
    };