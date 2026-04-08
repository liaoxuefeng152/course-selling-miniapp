export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '我的课程',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    })
  : {
      navigationBarTitleText: '我的课程',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black'
    };
