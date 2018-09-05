Page({

    onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
    },

    data: {
        userInfo: {},
        phone: '',
        name: '',
        region: ['安徽省', '合肥市', '全部'],
        customItem: '全部',
        date: '2018-09-01',
        items: [
            {
                name: '男孩',
                value: '男孩',
                checked: 'true'
            },
            {
                name: '女孩',
                value: '女孩'
            },
        ]
    },

    dealPhone (e) {
        this.setData({
            phone: e.detail.value
        });
    },

    dealName (e) {
        this.setData({
            name: e.detail.value
        });
    },


    goToList: function (event) {
        this.checkAuthroize();
    },

    goToShop: function (event) { },

    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },

    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },

    storeInfo () {
        let self = this;
        let userId = wx.getStorageSync('userId');
        let userToken = wx.getStorageSync('userToken');
        wx.request({
            url: 'https://www.ixunhuo.com/user/updateGestationalInfo',
            data: {
                "edc": self.data.date + "T12:22:54.518Z",
                "mobile": self.data.phone,
                "userName": self.data.name,
                "userRegion": self.data.region.join(','),
                "userType": 0
            }, //请求的参数",
            header: {
                //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/json',
            'Accept': 'application/json',
            'userId': userId,
            'userToken': userToken
        },
            method: 'POST',
            success: res => {
                if (res.data.code == 200) {
                    console.log('data: ' + JSON.stringify(res.data));
                    wx.setStorageSync('todoList', {todo: '123'});
                    let REDIRECT_URI = `https://www.ixunhuo.com/index?goYunjian=1&userid=${userId}&token=${userToken}`;
                    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx547df2035c15a16d&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
                    // console.log(`/pages/shouquan/shouquan?url=https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx547df2035c15a16d&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
                    wx.redirectTo({ url: `/pages/shouquan/shouquan?url=${encodeURIComponent(url)}` });
                    // wx.navigateTo({ url: '/pages/list/list' });
                }
            },
            fail: () => {},
            complete: () => {}
        });
    },

    storeWechatInfo () {
        let self = this;
        let userId = wx.getStorageSync('userId');
        let userToken = wx.getStorageSync('userToken');
        wx.request({
            url: 'https://www.ixunhuo.com/user/updateWechatInfo', //开发者服务器接口地址",
            data: {
                userHeadPic: wx.getStorageSync('wechatInfo').avatarUrl,
                wechatName: wx.getStorageSync('wechatInfo').nickName
            }, //请求的参数",
            header: {
                //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/json',
            'Accept': 'application/json',
            'userId': userId,
            'userToken': userToken
        },
            method: 'POST',
            success: res => {
                if (res.data.code == 200) {
                    // self.setDat({
                    //     phone: res.data.data.mobile,
                    //     name: res.data.data.userName,
                    //     region: res.data.data.region.split(',')
                    // })
                }
            },
            fail: () => {},
            complete: () => {}
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

                self.setData({
                    phone: res.data.data.mobile,
                    name: res.data.data.userName,
                    region: res.data.data.userRegion.split(',')
                })

                if(!res.data.data.wechatName) {
                    self.storeWechatInfo();
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

        let self = this

        this.getUserInfo(self);

    }
})
