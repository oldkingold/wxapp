var util = require('../../utils/util.js');
// var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    canIUseGetUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    userInfo_status: 0,
    loginStatus: 0,
    com_name: '',
    account: '',
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //判断是否微信授权登录
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          let userInfo = wx.getStorageSync('userInfo');
          if (userInfo) {
            that.setData({
              userInfo: userInfo,
              userInfo_status: 1
            })
          }
          //判断是否公司账号登录
          let company_setting = wx.getStorageSync('company_setting');
          if (company_setting) {
            that.setData({
              loginStatus: 1,
              com_name: company_setting.name,
              account: company_setting.money,
            });
          }
        }
      }
    })
  },

  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onshow---------------------onshow")
    var that = this;
    //判断是否微信授权登录
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          let userInfo = wx.getStorageSync('userInfo');
          if (userInfo) {
            that.setData({
              userInfo: userInfo,
              userInfo_status: 1
            })
          } else {
            that.setData({
              userInfo_status: 0,
            });
          }
          //判断是否公司账号登录
          let company_setting = wx.getStorageSync('company_setting');
          if (company_setting) {
            that.setData({
              loginStatus: 1,
              com_name: company_setting.name,
              account: company_setting.money,
            });
          }else {
            that.setData({
              loginStatus: 0,
            });
          }
        }
      }
    })
  },

  //微信授权登录
  bindweixin(e) {
    let that = this;
    if (e.detail.userInfo) {
      util.wxlogin().then((res) => {
        that.setData({
          userInfo_status: 1,
          userInfo: e.detail.userInfo,
        });
        app.globalData.token = res.token;
        app.globalData.openId = res.openId;
        that.onShow();
      });
    }else{
      wx.showModal({
        title: "用户未授权",
        content: '如需正常使用我的界面中其他功能，请授权允许微信登录',
        showCancel: false,
      })
    }
  },
  
  bindcheckloginwx(e) {
    let that = this;
    if (e.detail.userInfo) {
      //微信账号登录
      let url = e.target.dataset['url'];

      util.wxlogin().then((res) => {
        that.setData({
          userInfo_status: 1,
          userInfo: e.detail.userInfo,
        });
        app.globalData.token = res.token;
        app.globalData.openId = res.openId;
        wx.navigateTo({
          url: url,
        })
      });

    } else {
      wx.showModal({
        title: "用户未授权",
        content: '如需正常使用我的界面中其他功能，请授权允许微信登录',
        showCancel: false,
      })
    }
  },
  //绑定企业账号
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        wx.navigateTo({
          url: '/pages/judge/judge?website=' + res.result,
        })
      }
    })
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/home/home'
          });
        }
      }
    })
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
  
  onPullDownRefresh: function () {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //账号登录
          util.wxlogin().then((res) => {
            app.globalData.token = res.token;
            app.globalData.openId = res.openId;
            that.onLoad();
            wx.stopPullDownRefresh()
          });
        }else {
          wx.stopPullDownRefresh()
        }
      }
    })
    
  },
})