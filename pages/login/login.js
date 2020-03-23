var util = require('../../utils/util.js');
var api = require('../../config/api.js');
// var Mcaptcha = require('../../utils/mcaptcha.js');

var app = getApp();

Page({
  data: {
    companyName:'',
    phone:'',
    phoneCode: '',
    phoneCodeID:'935301565341497339^0',
    time: '获取验证码',
    timeOpen: true,
    timeNum : 60,
    reg: false,
    showmsg:'',
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

  bind_phone: function (e) {
    this.data.phone = e.detail.value
  },

  bind_phone_code: function (e) {
    this.data.phoneCode = e.detail.value
  },

  bind_companyname: function(e) {
    this.data.companyName = e.detail.value
  },
  
  //手机验证码请求事件
  downtime: function (e){
    (this.data.timeOpen) ? countdown(this) : ''
  },
  
  login: function (e) {
    wx.showLoading({
      mask: true
    });
    var that = this;
    
    if (that.data.phoneCodeID == '') {
      wx.showToast({
        icon: 'none',
        duration: 1500,
        title: '请点击获取验证码',
      })
      wx.hideLoading();
      return false;
    }
    
    wx.request({
      url: api.Company_Loginsms,
      data: { 
        "companyName": that.data.companyName,
        "openId": app.globalData.openId, 
        "tel": that.data.phone,
        "smsCode": that.data.phoneCode,
        "biz_id": that.data.phoneCodeID,
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
              url: "/pages/wode/wode",
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
            content: res.data.msg,
            showCancel: false
          });
        } 
        
      }
    })
  },
})

