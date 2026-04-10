export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '编辑直播',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    })
  : {
      navigationBarTitleText: '编辑直播',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black',
    };
