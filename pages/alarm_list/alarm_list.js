Page({

  data: {
    authShow: false
  },

  onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
  },

  goTijian () {
      let self = this;
      wx.getUserInfo({
          success: function (res) {
              wx.setStorageSync('wechatInfo',JSON.parse(res.rawData));
              wx.redirectTo({ url: '/pages/register/register'});
          }
      });
    
  },

  goYimiao () {
      wx.getUserInfo({
          success: function (res) {
              wx.setStorageSync('wechatInfo',JSON.parse(res.rawData));
              if (wx.getStorageSync('babysList')) {
                  wx.redirectTo({ url: '/pages/babylist/babylist' });
                } else {
                  wx.redirectTo({ url: '/pages/index/index' });
                }
          }
      });
  },

  login (self) {
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
                            self.setData({
                                userToken: res.data.data.userToken,
                                userId: res.data.data.userId
                            })
                            wx.setStorageSync('userToken', res.data.data.userToken);
                            wx.setStorageSync('userId', res.data.data.userId);
                            self.getUserInfo(self);
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
    },

    bindgetuserinfo () {
        let self = this;
        wx.getUserInfo({
            success: function (res) {
                self.setData({
                    userInfo: JSON.parse(res.rawData),
                    authShow: false
                });
            }
        });
    },

  getUserInfo (self) {
        wx.request({
            url: 'https://www.ixunhuo.com/user/getUserInfo',
            method: 'GET',
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'userId': self.data.userId || wx.getStorageSync('userId'),
                'userToken': self.data.userToken || wx.getStorageSync('userToken')
            },
            success: function (res) {
                wx.hideLoading();

                if(!res.data.data.wechatName) {
                    self.setData({
                        authShow: true
                    })
                }
                if (res.data.code === 401) {
                    self.login(self);   
                }
                if (res.data.data.wechatName) {
                    wx.setStorageSync('userInfo', res.data.data);
                }
            }
        })
    },


  onLoad: function (option) {
        if (wx.getStorageSync('userToken') && wx.getStorageSync('babysList')) {
          wx.redirectTo({ url: '/pages/babylist/babylist' });
        } else if (wx.getStorageSync('userToken') && wx.getStorageSync('todoList')){
          wx.redirectTo({ url: '/pages/list/list' });
        }else {
          this.setData({
            noRegister: true
          });
          wx.showLoading({
              title: '正在加载中...'
          })
          if (!wx.getStorageSync('userToken')) {
              this.login(this);
          } else {
              this.getUserInfo(this);
          };
        }

        
        // this.login(this);
    }
})