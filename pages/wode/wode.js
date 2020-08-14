var order = require("../../utils/home/order.js");

Page({
  data: {
    userInfo: {},
    userInfo_status: 0,
    loginStatus: 0,
    com_name: '',
    account: '',
    unread: '',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    
    order.companystate().then((res) => {
      if (res.data.code == 200) {
        
      } else {
        wx.showModal({
          title: '提示',
          content: '请前往登陆，开启会员卡服务',
          cancelText: '返回首页',
          confirmText: '去登陆',
          confirmColor: '#195ba9',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/home/home'
              })
            }
          }
        })
      }
    })

  },

  onShow: function () {
    var that = this;
    this.onLoad();

  },
  
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
      complete: function () {
        console.log("执行了complete")
      }
    })
  },

})