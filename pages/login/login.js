var util = require('../../utils/util.js');
var api = require('../../config/api.js');
// var Mcaptcha = require('../../utils/mcaptcha.js');

var app = getApp();

Page({
  data: {
    companyName:'',
    password:'',
  },

  onLoad: function (options) {
    
    var that=this;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.compName) {
      this.setData({
        companyName: options.compName
      });
    }
  },

  bind_password: function (e) {
    this.data.password = e.detail.value
  },

  bind_companyname: function(e) {
    this.data.companyName = e.detail.value
  },
  
  login: function (e) {
    wx.showLoading({
      mask: true
    });
    var that = this;
    
    if (that.data.companyName.length <= 0) {
      wx.showToast({
        icon: 'none',
        duration: 1500,
        title: '请输入公司名称',
      })
      wx.hideLoading();
      return false;
    }

    if (that.data.password.length <= 9) {
      wx.showToast({
        icon: 'none',
        duration: 1500,
        title: '密码至少是10位',
      })
      wx.hideLoading();
      return false;
    }
    
    wx.request({
      url: api.Company_Login,
      data: { 
        "companyName": that.data.companyName,
        "openId": app.globalData.openId, 
        "password": that.data.password,
        "token": app.globalData.token,
        },
      method:'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            icon: 'success',
            duration: 4000,
            mask: true,
            title: '企业账号登录成功',
          })
          util.wxlogin().then((res) => {
            app.globalData.token = res.token;
            app.globalData.openId = res.openId;
            wx.switchTab({
              url: "/pages/discount/discount",
            })
          });
        } else if (res.data.code == 199) {
          wx.showModal({
            title: '错误信息',
            content: '出错',
            showCancel: false
          });
        } else if (res.data.code == 403) {
          wx.showModal({
            title: '错误提示',
            content: res.data.data,
            showCancel: false
          });
        } 
        
      }
    })
  },
})

