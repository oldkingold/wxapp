var util = require('../../utils/util.js');
var api = require('../../config/api.js');
// var Mcaptcha = require('../../utils/mcaptcha.js');

var app = getApp();

Page({
  data: {
    companyName: '',
    password: '',
    repassword: '',
  },

  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.compName) {
      this.setData({
        companyName: options.compName
      });
    }
  },

  bind_passward: function (e) {
    this.data.password = e.detail.value
  },
  bind_repassward: function (e) {
    this.data.repassword = e.detail.value
  },
  bind_companyname: function (e) {
    this.data.companyName = e.detail.value
  },

  login: util.throttle(function (e) {
    console.log("------------------------------------------")
    console.log(e)
    if (e.detail.userInfo) {
      util.wxlogin();
    }else {
      wx.showModal({
        showCancel: false,
        content: '请先允许微信授权',
      })
      return false;
    }

    var that = this;

    if (that.data.companyName.length <= 0) {
      wx.showModal({
        showCancel: false,
        content: '请输入公司名称',
      })
      return false;
    }

    if (that.data.password.length <= 7) {
      wx.showModal({
        showCancel: false,
        content: '密码至少是8位',
      })
      return false;
    }

    if (that.data.password != that.data.repassword ) {
      wx.showModal({
        showCancel: false,
        content: '密码不相同',
      })
      return false;
    }
    
    wx.showLoading({
      mask: true
    });
    wx.request({
      url: api.CompanyRegister,
      data: {
        "companyName": that.data.companyName,
        "openId": app.globalData.openId,
        "password": that.data.password,
        "repassword": that.data.repassword,
        "token": app.globalData.token,
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.showToast({
            icon: 'success',
            duration: 4000,
            mask: true,
            title: '账号注册成功',
          })
          util.wxlogin().then((res) => {
            app.globalData.token = res.token;
            app.globalData.openId = res.openId;
            wx.navigateTo ({
              url: "/pages/notices/notices",
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

      },
      fail: function (res) {
        console.log(res);
        
      }
    })
  },1500)
})
