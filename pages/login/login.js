var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var Mcaptcha = require('../../utils/mcaptcha.js');

var app = getApp();

Page({
  data: {
    companyName:'度川研发部',
    phone:'',
    pwd: '',
    cptCode:'',
    code:'',
    phoneCode: '',
    phoneCodeID:'',
    time: '获取验证码',
    timeOpen: true,
    timeNum : 60,
    reg: false,
    _num: 1,
    inputType: true,
    _eye:true,
    appwidth:'',
    showmsg:'',
    header_cookie:"",
    cvs: {
      width: 100,
      height: 35
    },
  },
  onLoad: function (options) {
    var that=this;
    // 页面初始化 options为页面跳转所带来的参数
    if (options.compName) {
      this.setData({
        companyName: options.compName
      });
    }
    var codestr = codeString();
    this.data.code = codestr;
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: this.data.cvs.width,
      height: this.data.cvs.height,
      code: codestr,
    })
  },

  //刷新图形验证码
  onTap() {
    this.data.code = codeString();
    this.mcaptcha.refresh(this.data.code);
  },

  //显示或隐藏密码
  pasortext: function (event){
    this.setData({
      inputType : !this.data.inputType,
      _eye: !this.data._eye,
      pwd: this.data.pwd,
    });
  },
  //切换登录方式
  passwordBtn: function (event){
    this.data.code = codeString();
    this.mcaptcha.refresh(this.data.code);
    this.setData({
      _num: event.target.dataset.num,
      inputType: !this.data.inputType
    })
  },
  bind_phone: function (event) {
    this.data.phone = event.detail.value
  },
  bind_pwd: function (event) {
    this.data.pwd = event.detail.value
  },
  bind_cptCode: function (event) {
    this.data.cptCode = event.detail.value
  },
  bind_phone_code: function (event) {
    this.data.phoneCode = event.detail.value
  },
  bind_companyname: function(e) {
    this.data.companyName = e.detail.value
  },

  //手机验证码请求事件
  downtime: function (event){
    (this.data.timeOpen) ? countdown(this) : ''
  },
  
  login: function (event) {
    wx.showLoading({
      mask: true
    });
    var that = this;
    if (this.data._num == 1) {
      //本地判断验证码是否正确
      if (!(that.data.code.toLowerCase() == that.data.cptCode.toLowerCase())) {
        wx.showModal({
          title: '错误信息',
          content: '验证码输入错误',
          showCancel: false
        });
        wx.hideLoading();
        return false;
      }
      wx.request({
        url: api.Company_Login,
        method:'post',
        data:{
          openId: app.globalData.openId,
          companyName: that.data.companyName,
          password: that.data.pwd,
          token: app.globalData.token,
        },
        success:function(res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              icon: 'success',
              duration: 4000,
              mask:true,
              title: '企业账号绑定成功',
            })
            //账号登录，并跳转页面
            util.wxlogin().then((res) => {
              app.globalData.token = res.token;
              app.globalData.openId = res.openId;
              wx.switchTab({
                url: "/pages/wode/wode",
              })
            });           
          } else if (res.data.code == 201) {
            wx.showModal({
              title: '错误信息',
              content: res.data.data,
              showCancel: false
            });
          }
          
        }
      })

    } else if (this.data._num == 2) {
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
          } else if (res.data.code == 201) {
            wx.showModal({
              title: '错误提示',
              content: res.data.data,
              showCancel: false
            });
          } 
          
        }
      })
    }
  },
})

function codeString() {
  var codeString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFG"
    + "HIJKLMNOPQRSTUVWXYZ";
  var code = '';
  for (var i = 1; i <= 4; i++) {
    code += codeString.substr(Math.random() * 62, 1);
  }
  return code;
}

function countdown(that) {
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!mobile.exec(that.data.phone)) {
    wx.showToast({
      icon: 'none',
      duration: 1500,
      title: '手机号码有误',
    })
    return false;
  }
  wx.request({
    url: api.Companysms_Login,
    data: {
      tel: that.data.phone,
      openId: app.globalData.openId,
      token: app.globalData.token,
      action: 'login',
    },
    method: 'POST',
    success:function(res) {
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
        that.setData({ time: second + '秒后重新发送' })
        var phone = that.data.phone
        var myphone = phone.substr(3, 4);
        var lphone = phone.replace(myphone, "****");
        var time = setInterval(function () {
          second--
          if (second !== 0) {
            that.setData({
              time: second + '秒后重新发送',
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
        
      }else if (res.data.code == 201) {
        wx.showModal({
          title: '错误提示',
          content: res.data.data,
          showCancel: false
        })
      }
    }
  });
  
}