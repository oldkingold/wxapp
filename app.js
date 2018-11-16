var util = require('./utils/util.js');

App({
  onLaunch: function () {
    var that = this;
    // 获取基本信息
    wx.getSystemInfo({
      complete: function (e) {
        console.log(e);
        that.globalData.systemInfo = { height: e.windowHeight };
      }
    });

    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //账号登录
          util.wxlogin().then((res) => {
            that.globalData.token = res.token;
            that.globalData.openId = res.openId;
          });
        }
      }
    })

    util.loadFontFace();
  },
  globalData: {
    userInfo: null,
    systemInfo: null,
    token: '',
    openId: "",
  }
})