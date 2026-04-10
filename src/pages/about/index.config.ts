export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '关于我们',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '关于我们',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    };