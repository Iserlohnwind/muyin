Page({

  data: {
    remainDays: 200,
    passDays: 30,
    todoList: [],
    userHeadPic: '',
    pregnancyTime: '',
    edcInterval: 0,
    nextTime: ''
  },

  onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
  },



  onLoad: function (option) {
    let self = this;
    wx.request({
      url: 'https://www.ixunhuo.com/todo/getGestationTodoList', //开发者服务器接口地址",
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
          this.setData({
            todoList: res.data.data.todoList,
            userHeadPic: res.data.data.userHeadPic,
            pregnancyTime: res.data.data.pregnancyTime,
            edcInterval: res.data.data.edcInterval,
            nextTime: res.data.data.todoList[0] && res.data.data.todoList[0].todoDate
          });
          wx.setStorageSync('todoList', res.data.data.todoList);
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
                              url: 'https://www.ixunhuo.com/todo/getGestationTodoList', //开发者服务器接口地址",
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
                                    todoList: res.data.data.todoList,
                                    userHeadPic: res.data.data.userHeadPic,
                                    pregnancyTime: res.data.data.pregnancyTime,
                                    edcInterval: res.data.data.edcInterval,
                                    nextTime: res.data.data.todoList[0] && res.data.data.todoList[0].todoDate
                                  });
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
              debugger
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

  goRegister () {
    wx.navigateTo({ url: '/pages/register/register' });
  },

  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?typeId=${e.currentTarget.dataset.type}&url='https://www.ixunhuo.com/todo/getTodoDetail'` });
  }
})