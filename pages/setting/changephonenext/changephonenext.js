var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    timeOpen: true,
    time: '获取验证码',
    timeNum: 60,
    showmsg: '',

    newBindTel: '',
    smsCode: '',
    biz_id: '',
  },
  onLoad: function (options) {
    var s_biz_id = wx.getStorageSync('biz_id');
    if (s_biz_id == '') {
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
  bind_new_phone: function (e) {
    this.setData({
      newBindTel: e.detail.value
    });
  },
  bind_phone_code: function (e) {
    this.setData({
      smsCode: e.detail.value
    });
  },
  downtime: function (event) {
    (this.data.timeOpen) ? countdown(this) : ''
  },
  confirm: function () {
    var that = this;
    if (that.data.newBindTel == '') {
      wx.showModal({
        title: '错误',
        content: '手机不能为空',
      })
      return false;
    }
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    console.log(that.data.newBindTel)
    if (!mobile.exec(that.data.newBindTel)) {
      wx.showModal({
        title: '错误',
        content: '手机号码有误',
      })
      return false;
    }
    if (that.data.smsCode == '') {
      wx.showModal({
        title: '错误',
        content: '验证码不能为空',
      })
      return false;
    }
    var token = app.globalData.token;
    wx.request({
      url: api.telCheck,
      method: 'POST',
      data: {
        token: token,
        smsCode: that.data.smsCode,
        biz_id: that.data.biz_id,
      },
      success: function (r) {
        if (r.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: '修改成功',
            success: function () {
              // 调用重新登陆的方法 刷新公司绑定的手机信息
              util.wxlogin().then((res) => {
                app.globalData.token = res.token;
                app.globalData.openId = res.openId;
                wx.switchTab({
                  url: '/pages/wode/wode',
                })
              });
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '验证码错误或过期',
            success: function () { }
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
  if (that.data.newBindTel == '') {
    wx.showModal({
      title: '错误',
      content: '手机不能为空',
    })
    return false;
  }
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!mobile.exec(that.data.newBindTel)) {
    wx.showModal({
      title: '错误',
      content: '手机号码有误',
    })
    return false;
  }
  var token = app.globalData.token;
  wx.request({
    url: api.telSend,
    method: 'POST',
    data: {
      token: token,
      tel: that.data.newBindTel
    },
    success: function (r) {
      if (r.data.code == 200) {
        wx.setStorageSync('biz_id', r.data.data)
        that.setData({
          biz_id: r.data.data
        })
        var second = that.data.timeNum
        that.data.timeOpen = false
        that.setData({
          time: second + '秒后重新发送'
        })
        var time = setInterval(function () {
          second--
          if (second !== 0) {
            that.setData({
              time: second + '秒后重新发送',
              showmsg: '验证码已发送到' + that.data.newBindTel + '，请注意查收'
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
          success: function () { }
        })
      }
    }
  })
}