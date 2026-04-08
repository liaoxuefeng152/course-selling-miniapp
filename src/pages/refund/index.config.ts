export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '退款记录',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    })
  : {
      navigationBarTitleText: '退款记录',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    };
