export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '课程学习',
    })
  : { navigationBarTitleText: '课程学习' };
