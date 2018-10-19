var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    timeOpen: true,
    time: '获取验证码',
    timeNum: 60,
    showmsg: '',
    companyBindTel: '',
    smsCode: '',
    biz_id: '',
  },
  onLoad: function (options) {
    this.setData({
      companyBindTel: wx.getStorageSync('companyBindTel')
    })
    if (this.data.companyBindTel == '') {
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
  bind_phone_code: function (e) {
    this.setData({
      smsCode: e.detail.value
    })
  },
  downtime: function (event) {
    (this.data.timeOpen) ? countdown(this) : '';
  },
  to_change_phone_next: function () {
    var that = this;
    if (!(that.check_name(that.data.smsCode))) {
      wx.showModal({
        title: '错误',
        content: '验证码不能为空',
      })
      return false;
    }
    if (!(that.check_name(that.data.biz_id))) {
      wx.showModal({
        title: '错误',
        content: '出错',
      })
      return false;
    }
    var token = app.globalData.token;
    wx.request({
      url: api.telValidateCheck,
      method: 'POST',
      data: {
        token: token,
        smsCode: that.data.smsCode,
        biz_id: that.data.biz_id
      },
      success: function (r) {
        if (r.data.code == 200) {
          wx.navigateTo({
            url: '/pages/setting/changephonenext/changephonenext',
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '验证码过期或错误',
          })
        }
      }
    })
  },
  check_name: function (name) {
    return name.length < 1 ? false : true
  },
})

function countdown(that) {
  var token = app.globalData.token;
  wx.request({
    url: api.telValidateSend,
    method: 'POST',
    data: {
      token: token
    },
    success: function (r) {
      if (r.data.code == 200) {
        wx.setStorageSync('biz_id', r.data.data)
        that.setData({
          biz_id: r.data.data
        })
        var second = that.data.timeNum
        that.data.timeOpen = false
        that.setData({ time: second + '秒后重新发送' })
        var time = setInterval(function () {
          second--
          if (second !== 0) {
            that.setData({
              time: second + '秒后重新发送',
              showmsg: '验证码已发送到' + that.data.companyBindTel + '，请注意查收'
            });
          } else {
            that.setData({
              time: '重新发送'
            });
            clearInterval(time);
            second = that.timeNum;
            that.data.timeOpen = true
          }
        }, 1000)
      } else {
        wx.showModal({
          title: '提示',
          content: '验证码发送错误',
          success: function () {
            wx.navigateBack({
            })
          }
        })
      }
    }
  })
}
