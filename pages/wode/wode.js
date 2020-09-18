var order = require("../../utils/home/order.js");

Page({
  data: {
    com_name: '',
  },

  onLoad: function (options) {
    wx.removeStorageSync("company_bind_tel")
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.data.myshow = this.selectComponent('#myshow')
    

  },

  onShow: function () {
    var that = this;
    this.data.myshow.Loading()
    order.companystate().then((res) => {
      that.data.myshow.Close()
      if (res.data.code == 200) {
        that.setData({
          com_name: res.data.data.companyname
        })
        wx.setStorageSync("company_bind_tel", res.data.data.bind_tel)
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
  onHide: function () {
    this.data.myshow.Close()
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