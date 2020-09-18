var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newPwd: "",
    lastid: "",
    lastnum: "",
  },

  onLoad: function (options) {
    this.data.lastid = options.lastid
    this.data.lastnum = options.lastnum
    if (this.data.lastid == '') {
      wx.showModal({
        title: '提示',
        content: '错误',
        success: function () {
          wx.navigateBack({
          })
        }
      })
    }
  },

  bind_new_pwd: function(e){
    this.setData({
      newPwd: e.detail.value
    });
  },

  confirm: function () {
    var that = this;
    if (that.data.newPwd.length <= 7) {
      wx.showModal({
        title: '错误',
        content: '密码至少是8位',
      })
      return false;
    }

    wx.request({
      url: api.pwdChange,
      method: 'POST',
      data: {
        token: app.globalData.token,
        openId: app.globalData.openId,
        newPwd: that.data.newPwd,
        lastnum: that.data.lastnum,
        lastid: that.data.lastid,
      },
      success: function (r) {
        if (r.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '修改成功',
            success: function () {
              // 调用重新登陆的方法 刷新公司绑定的手机信息
              wx.switchTab({
                url: '/pages/wode/wode',
              })

            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '错误',
            success: function () { }
          })
        }
      }})

  }
})