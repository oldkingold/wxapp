var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');

var app = getApp();
Page({
  data: {
    companySetting: null,
    companyAdmin: false,
    isChanged: false,
    bindCompany: '',
    bindTel: '',
    bindName: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    
  },
  bind_unbundling: function () {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '确定退出登录？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          var token = app.globalData.token;
          wx.request({
            url: api.companyUnbind,
            method: 'POST',
            data: {
              token: token,
            },
            success: function (r) {
              if (r.data.code == 200) {
                wx.showToast({
                  title: '退出登录',
                  icon: 'success',
                  duration: 1500
                })
                
                wx.switchTab({
                  url: "/pages/home/home",
                })

              }
            }
          })
        }
      }
    })
  },

})
