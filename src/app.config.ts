export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/live/index',
    'pages/live-detail/index',
    'pages/study/index',
    'pages/profile/index',
    'pages/login/index',
    'pages/profile/edit/index',
    'pages/course/index',
    'pages/course-play/index',
    'pages/course-list/index',
    'pages/order/index',
    'pages/order/confirm',
    'pages/coupons/index',
    'pages/favorites/index',
    'pages/history/index',
    'pages/reviews/index',
    'pages/messages/index',
    'pages/reminders/index',
    'pages/settings/index',
    'pages/help/index',
    'pages/refund/index',
    'pages/my-courses/index',
    // 讲师端页面
    'pages/instructor/index/index',
    'pages/instructor/certify/index',
    'pages/instructor/courses/index',
    'pages/instructor/courses/edit/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '在线课堂',
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
