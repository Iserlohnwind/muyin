Page({

  data: {
    remainDays: 200,
    passDays: 30,
    avatarUrl: '',
    babyList: []
  },

  onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
  },


  onLoad: function (option) {
    let userInfo = wx.getStorageSync('wechatInfo');
    this.setData({
      avatarUrl: userInfo.avatarUrl
    });
    let self = this;
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
        if (res.data.code === 200) {
          self.setData({
            babyList: res.data.data.babyList
          });
          wx.setStorageSync('babysList', res.data.data.babyList);
        } else if (res.data.code === 401) {
          wx.login({
            success: function (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://www.ixunhuo.com/auth/login',
                        data: `code=${res.code}`,
                        method: 'POST',
                        header: {
                            //设置参数内容类型为x-www-form-urlencoded
                            'content-type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        },
                        success: function (res) {
                            wx.setStorageSync('userToken', res.data.data.userToken);
                            wx.setStorageSync('userId', res.data.data.userId);
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
                                if (res.data.code === 200) {
                                  self.setData({
                                    babyList: res.data.data.babyList
                                  });
                                  wx.setStorageSync('babysList', res.data.data.babyList);
                                }
                              }
                            });
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            },
            fail: function (e) {
            }
          });
        }
          
      },
      fail: () => {
        wx.showToast({
          title: '暂无相关信息', //提示的内容,
          icon: 'success', //图标,
          duration: 2000
        });
      },
      complete: () => {}
    });
  },

  goDetail (e) {
    wx.navigateTo({ url: `/pages/detail/detail?typeId=${e.currentTarget.dataset.info.typeId}&url='https://www.ixunhuo.com/todo/getTodoDetail'` });
  }
})