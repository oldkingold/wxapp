const util = require('./utils/util.js');
const order = require("./utils/home/order.js");

App({
  onLaunch: function () {
    var that = this;
    // 获取基本信息
    wx.getSystemInfo({
      complete: function (e) {
        that.globalData.systemInfo = { height: e.windowHeight };
      }
    });

    //账号登录
    util.wxlogin().then((res) => {
      //获取用户信息
      order.companystate().then((res) => {
        if (res.data.code == 200) {
          that.globalData.card = res.data.data;
        }
      })
    });

    // util.loadFontFace();

  },
  globalData: {
    userInfo: null,
    systemInfo: null,
    token: '',
    openId: "",
    card:{},
    vip: {
      "钻石会员": { "icon": "diamond" },
      "白金会员": { "icon": "platinum" },
      "金卡会员": { "icon": "gold" },
      "银卡会员": { "icon": "silver" },
      "普通会员": { "icon": "common" },
    },
  }
})