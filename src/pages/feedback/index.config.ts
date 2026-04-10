export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '意见反馈',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '意见反馈',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    };