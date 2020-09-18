var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    compName: '',
    code: '',
    companyId: 9,
    bindTel: '',
    biz_id: '720705830511340677^0',
    loginErrorCount: 0,
    timeOpen: true,
    time: '获取验证码',
    timeNum: 60,
    msg: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  bindCompNameInput: function (e) {
    this.setData({
      compName: e.detail.value
    });
  },
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    });
  },
  downtime: function (event) {
    (this.data.timeOpen) ? countdown(this) : '';
  },
  toreset: function () {
    var that = this;
    if (this.data.compName.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '公司用户名不能为空',
        showCancel: false
      });
      return false;
    }
    if (this.data.code.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '验证码不能为空',
        showCancel: false
      });
      return false;
    }
    var token = app.globalData.token;
    wx.request({
      url: api.smsForgetPwd2,
      data: {
        token: token,
        biz_id: that.data.biz_id,
        smsCode: that.data.code
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/reset2/reset2?companyid=' + that.data.companyId,
          })
        }else{
          wx.showModal({
            title: '错误信息',
            content: '验证码有误',
            showCancel: false
          });
          return false;
        }
      }
    });

  }
})

function countdown(that) {
  if (that.data.compName.length < 1) {
    wx.showModal({
      title: '错误信息',
      content: '公司用户名不能为空',
      showCancel: false
    });
    return false;
  }
  var token = app.globalData.token;
  wx.request({
    url: api.smsForgetPwd1,
    data: {
      token: token,
      companyName: that.data.compName
    },
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.data.code == 200) {
        that.setData({
          companyId: res.data.comapny_id,
          bindTel: res.data.bind_tel,
          biz_id: res.data.data
        })
        var second = that.data.timeNum
        that.data.timeOpen = false
        that.setData({ time: second + '秒后重新发送' })
        var time = setInterval(function () {
          second--
          if (second !== 0) {
            that.setData({
              time: second + '秒后重新发送',
              msg: '验证码已发送到' + res.data.bind_tel + '，请注意查收'
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
      } else if (res.data.code == 201) {
        wx.showModal({
          title: '错误信息',
          content: '没有该公司账户',
          showCancel: false
        });
        return false;
      }
    }
  });

}