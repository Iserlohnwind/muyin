Page({

  data: {
    remainDays: 200,
    passDays: 30
  },

  onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
  },



  onLoad: function (option) {
    wx.request({
      url: 'https://www.ixunhuo.com/todo/getLactationTodoList', //开发者服务器接口地址",
      method: 'GET',
      header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'userId':  wx.getStorageSync('userId'),
          'userToken':  wx.getStorageSync('userToken')
      },
      success: res => {
          debugger
      },
      fail: () => {
          debugger
      },
      complete: () => {}
    });
  }
})