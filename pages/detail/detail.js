var WxParse = require('../../wxParse/wxParse.js');

Page({

  data: {
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    typeId: '',
    detailItemList: []
  },

  onShareAppMessage: function (res) {
        return {
            title: '宝妈小闹钟',
            path: '/pages/alarm_list/alarm_list',
        }
  },

  onLoad(option) {
    var article = '<div>我是HTML<p>sss</p>代码</div>';
    /**
     * WxParse.wxParse(bindName , type, data, target,imagePadding)
     * 1.bindName绑定的数据名(必填)
     * 2.type可以为html或者md(必填)
     * 3.data为传入的具体数据(必填)
     * 4.target为Page对象,一般为this(必填)
     * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
     */
    var that = this;
    // WxParse.wxParse('article', 'html', article, that, 5);
    wx.request({
      url: 'https://www.ixunhuo.com/todo/getTodoDetail', //开发者服务器接口地址",
      method: 'GET',
      header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'userId':  wx.getStorageSync('userId'),
          'userToken':  wx.getStorageSync('userToken')
      },
      data: {
        typeId: option.typeId
      },
      success: res => {
          this.setData({
            detailItemList: res.data.data.detailItemList
          });
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
    
  }
})