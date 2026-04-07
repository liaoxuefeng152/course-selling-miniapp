export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/live/index',
    'pages/study/index',
    'pages/profile/index',
    'pages/course/index',
    'pages/course-list/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '多平台卖课',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#9CA3AF',
    selectedColor: '#FF6B35',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/live/index',
        text: '直播',
        iconPath: './assets/tabbar/play-circle.png',
        selectedIconPath: './assets/tabbar/play-circle-active.png'
      },
      {
        pagePath: 'pages/study/index',
        text: '学习',
        iconPath: './assets/tabbar/book-open.png',
        selectedIconPath: './assets/tabbar/book-open-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/user.png',
        selectedIconPath: './assets/tabbar/user-active.png'
      }
    ]
  }
})
