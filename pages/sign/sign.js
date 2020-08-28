var util = require('../../utils/util.js');
var api = require('../../config/api.js');
// var Mcaptcha = require('../../utils/mcaptcha.js');

var app = getApp();

Page({
  data: {
    companyName: '',
    password: '',
    repassword: '',
    contact:"",
    phone: '',
    phoneCode:"",
    phoneCodeID: '',
    time: '获取验证码',
    timeOpen: true,
    timeNum: 60,
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
  bind_phone: function (e) {
    this.data.phone = e.detail.value
  }, 
  bind_contact: function(e) {
    this.data.contact = e.detail.value
  },
  bind_phone_code: function (e) {
    this.data.phoneCode = e.detail.value
  },

  //登陆
  login: util.throttle(function (e) {
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

    if (that.data.contact == "") {
      wx.showModal({
        showCancel: false,
        content: '请填写联系人姓名',
      })
      return false;
    }

    if (that.data.phone == "" ) {
      wx.showModal({
        showCancel: false,
        content: '请填写手机号码',
      })
      return false;
    }

    if (that.data.phoneCodeID == "" || that.data.phoneCode == "") {
      wx.showModal({
        showCancel: false,
        content: '请填写验证码',
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
        "contact": that.data.contact,
        "phone": that.data.phone,
        "phoneCodeID": that.data.phoneCodeID,
        "phoneCode": that.data.phoneCode,
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
  },1500),

  //手机验证码请求事件
  downtime: function (e) {
    (this.data.timeOpen) ? countdown(this) : ''
  },

})

function countdown(that) {
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (that.data.phone == "") {
    wx.showModal({
      title: '提示',
      content: "请填写手机号码",
      showCancel: false
    });
    return false;
  } else if (!mobile.exec(that.data.phone)) {
    wx.showModal({
      title: '提示',
      content: "请填写正确的手机号码",
      showCancel: false
    });
    return false;
  }
  wx.request({
    url: api.Companysms_Register,
    data: {
      tel: that.data.phone,
      openId: app.globalData.openId,
      token: app.globalData.token,
      action: 'register',
      companyName: that.data.companyName,
    },
    method: 'POST',
    success: function (res) {
      var myreg = /[\^]/;
      if (res.data.code == 200) {
        if (!myreg.test(res.data.data)) {
          wx.showModal({
            title: '错误提示',
            content: "请求次数过多，请稍后再试",
            showCancel: false
          });
          return false;
        }
        that.data.phoneCodeID = res.data.data
        var second = that.data.timeNum
        that.data.timeOpen = false
        that.setData({ time: second + '秒' })
        var phone = that.data.phone
        var myphone = phone.substr(3, 4);
        var lphone = phone.replace(myphone, "****");
        var time = setInterval(function () {
          second--
          if (second !== 0) {
            that.setData({
              time: second + '秒',
              showmsg: '验证码已发送到' + lphone + '，请注意查收'
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

      } else if (res.data.code == 403) {
        wx.showModal({
          title: '错误提示',
          content: res.data.data,
          showCancel: false
        })
      } else if (res.data.code == 202) {
        wx.showModal({
          // title: '错误提示',
          content: res.data.data,
          success: function (e) {
            if (e.confirm == true) {
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }
          }
        })
      }
    }
  });

}