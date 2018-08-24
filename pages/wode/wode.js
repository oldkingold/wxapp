// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// var storage = require('../../../services/storage.js');
var app = getApp();

Page({
  data: {
    userInfo: {
      avatarUrl: '/static/images/moren.png'
    },
    canIUseGetUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    userInfo_status: 0,
    loginStatus: 0,
    com_name: '',
    account: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // let userInfo = storage.getstorage('userInfo', null);
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({ userInfo_status: 1 });
          if (userInfo != null) {
            that.setData({
              userInfo: userInfo
            })
          }

        }
      }
    })
  },
  onShow: function () {
    // let company_setting = storage.getstorage('company_setting', null);
    if (company_setting != null) {
      this.setData({
        loginStatus: 1,
        com_name: company_setting.name,
        account: company_setting.money,
      });
    } else {
      this.setData({
        loginStatus: 0,
      });
    }
  },
  bindweixin(e) {
    let that = this;
    if (e.detail.userInfo) {
      //微信账号登录
      // util.wxlogin().then((res) => {
      //   that.setData(
      //     userInfo_status: 1,
      //     userInfo: e.detail.userInfo,
      //   });
      //   app.globalData.token = res.token;
      //   app.globalData.openId = res.openId;
      //   that.onShow();
      // });

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

      // util.wxlogin().then((res) => {
      //   that.setData({
      //     userInfo_status: 1,
      //     userInfo: e.detail.userInfo,
      //   });
      //   app.globalData.token = res.token;
      //   app.globalData.openId = res.openId;
      //   wx.navigateTo({
      //     url: url,
      //   })
      // });

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
      url: '/pages/ucenter/login/login'
    });
  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        wx.navigateTo({
          url: '/pages/ucenter/judge/judge?website=' + res.result,
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
            url: '/pages/index/index'
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
})