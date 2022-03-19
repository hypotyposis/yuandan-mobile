export default {
  pages: [
    'pages/index/index',
    'pages/detailPage/detailPage',
    'pages/userHomePage/userHomePage',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7F8349',
    selectedColor: '#5495e6',
    borderStyle: 'black',
    backgroundColor: '#fff',
    list: [
      {
         pagePath: 'pages/index/index',
         iconPath: 'assets/icons/home-outline.png',
         selectedIconPath: 'assets/icons/home.png',
         text: '首页'
      },
      {
        pagePath: 'pages/userHomePage/userHomePage',
        iconPath: 'assets/icons/person-circle-outline.png',
        selectedIconPath: 'assets/icons/person-circle.png',
        text: '我的'
      }
    ]
  }
}
