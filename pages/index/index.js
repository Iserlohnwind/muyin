Page({

    onShareAppMessage: function (res) {
        // if (res.from === 'button') {
        //     // 来自页面内转发按钮
        //     console.log(res.target)
        // }
        // return {
        //     title: '堤旁树',
        //     path: './pages/index/index',
        //     success: function (res) {
        //         // 转发成功
        //     },
        //     fail: function (res) {
        //         // 转发失败
        //     }
        // }
    },

    data: {
        userInfo: {},
        userToken: '',
        authShow: false,
        userId: '',
        phone: '',
        name: '',
        region: ['安徽省', '合肥市', '全部'],
        customItem: '全部',
        babaName: '',
        babysList: [{
            babyName: '',
            babyGender: 1,
            babyBirthday: '2018-09-01',
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
        }]
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

    dealBabyName (e) {
        let babysList = this.data.babysList;
        babysList[parseInt(e.currentTarget.dataset.index)].babyName = e.detail.value;
        this.setData({
            babysList: babysList
        });
    },

    bindRegionChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },

    bindDateChange: function (e) {
        let babysList = this.data.babysList;
        babysList[parseInt(e.currentTarget.dataset.index)].babyBirthday = e.detail.value;
        this.setData({
            babysList: babysList
        })
    },

    radioChange (e) {
        let babysList = this.data.babysList;
        // babysList[parseInt(e.currentTarget.dataset.index)].babyGender = e.detail.value;
        if (e.detail.value === '女孩') {
            babysList[parseInt(e.currentTarget.dataset.index)].babyGender = 2;
            babysList[parseInt(e.currentTarget.dataset.index)].items[1].checked = true;
            delete  babysList[parseInt(e.currentTarget.dataset.index)].items[0].checked;
        } else {
            babysList[parseInt(e.currentTarget.dataset.index)].babyGender = 1;
            babysList[parseInt(e.currentTarget.dataset.index)].items[0].checked = true;
            delete  babysList[parseInt(e.currentTarget.dataset.index)].items[1].checked;
        }
        this.setData({
            babysList: babysList
        });
    },

    addBaby () {
        let babysList = this.data.babysList;
        babysList.push({babyName: '',
            babyGender: 0,
            babyBirthday: '2018-09-01',
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
        });
        this.setData({
            babysList: babysList
        });
    },

    deleteBaby (e) {
        let babysList = this.data.babysList;
        babysList.splice(parseInt(e.currentTarget.dataset.index), 1);
        this.setData({
            babysList: babysList
        })
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
            }
        });
    },

    getUserInfo (self) {
        wx.request({
            url: 'https://www.ixunhuo.com/user/getUserInfo',
            method: 'GET',
            // data: {
            //     userId: self.data.userId,
            //     userToken: self.data.userToken
            // },
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
                } else if (res.data.code === 401) {
                    self.login(self);   
                }
                let data = res.data.data;
                if(data.wechatName) {
                    self.setData({
                        name: data.userName,
                        phone: data.mobile
                    })
                }
            }
        })
    },

    storeInfo () {
        let errs = this.validate();
        if (errs.length > 0) {
            this.showValidateErrorToast(errs);
        } else {
            let self = this;
            let userId = wx.getStorageSync('userId');
            let userToken = wx.getStorageSync('userToken');
            if(this.data.authShow) {
                wx.request({
                url: 'https://www.ixunhuo.com/user/updateWechatInfo', //开发者服务器接口地址",
                data: {
                    userHeadPic: this.data.userInfo.avatarUrl,
                    wechatName: this.data.userInfo.nickName
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
                        self.updateLactationalInfo();
                    }
                },
                fail: () => {},
                complete: () => {}
                });
            } else {
                this.updateLactationalInfo();
            }
        }
        
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

    showValidateErrorToast (errs) {
        wx.showToast({
            title: errs[0],
            icon: 'none',
            duration: 2000
        });
    },

    validate () {
        const errs = []
        if (!this.data.phone) {
            errs.push('请输入手机号');
        }
        if (!this.data.name) {
            errs.push('请输入姓名');
        }
        if (this.data.phone.length !== 11) {
            errs.push('请输入正确的手机号');
        }
        return errs
    },

    updateLactationalInfo () {
        let self = this;
        let userId = wx.getStorageSync('userId');
        let userToken = wx.getStorageSync('userToken');
        wx.request({
            url: 'https://www.ixunhuo.com/user/updateLactationalInfo',
            data: {
                babyInfoList: this.data.babysList,
                "mobile": this.data.phone,
                "userName":  this.data.name,
                "userRegion": this.data.region.join(','),
                "userType": 2
            },
            method: 'POST',
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/json',
                'Accept': 'application/json',
                'userId': userId,
                'userToken': userToken
            },
            success: function (res) {
                if(res.data.code == 200) {
                    wx.showToast({
                        title: '保存成功',
                        duration: 2000, //延迟时间,
                    });
                    wx.setStorageSync('babysList', self.data.babysList);
                    let REDIRECT_URI = `https://www.ixunhuo.com/index?userid=${userId}&token=${userToken}`;
                    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx547df2035c15a16d&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
                    // console.log(`/pages/shouquan/shouquan?url=https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx547df2035c15a16d&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
                    wx.redirectTo({ url: `/pages/shouquan/shouquan?url=${encodeURIComponent(url)}` });

                    // wx.navigateTo({ url: '/pages/babylist/babylist' });
                } else {
                    wx.showToast({
                        title: '保存失败', //提示的内容,
                        icon: 'fail', //图标,
                        duration: 2000, //延迟时间,
                    });
                }
                
            }
        });
    },

    onLoad: function (option) {

        wx.showLoading({
            title: '正在加载中...'
        })
        if (!wx.getStorageSync('userToken')) {
            this.login(this);
        } else {
            this.getUserInfo(this);
        };
        // this.login(this);
    }
})

var username = "";
var theList = require("al.js");