var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    compName: '',
    new_psd: '',
    old_psd:'',
    phone:'',
    code: '',
    biz_id:'',

    loginErrorCount: 0,
    timeOpen: true,
    time: '获取验证码',
    timeNum: 60,
    msg:''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    if(options.compName) {
      this.setData({
        compName: options.compName
      });
    }
  },
  startRegister: function () {
    var that = this;

    if (!checkdata(this)) {
      return false;
    }

    console.log({
      companyName: that.data.compName,
      password: that.data.new_psd,
      openId: app.globalData.openId,
      tel: that.data.phone,
      smsCode: that.data.code,
      biz_id: that.data.biz_id,
      token: app.globalData.token,
    });

    wx.request({
      url: api.CompanyRegister,
      data: {
        companyName: that.data.compName,
        password: that.data.new_psd,
        openId: app.globalData.openId,
        tel: that.data.phone,
        smsCode: that.data.code,
        biz_id: that.data.biz_id,
        token: app.globalData.token,
      },
      method: 'POST',
      success: function (res) {
        console.log(res);        
        if (res.data.code == 200) {
          //注册成功
          wx.navigateBack({})
        }else if(res.data.code == 199) {
          wx.showModal({
            title: '错误信息',
            content: '出错',
            showCancel: false
          });     
        }else if (res.data.code == 201) {
          wx.showModal({
            title: '错误提示',
            content: res.data.data,
            showCancel: false
          });
        }else if (res.data.code == 202) {
          wx.showModal({
            title: '注册成功',
            content: res.data.data,
            showCancel: false,
            success:function(){
              wx.switchTab({
                url: "/pages/wode/wode",
              })
            }
          });
          
        }

        // if (res.data.code == 200) {
        //   that.setData({
        //     'loginErrorCount': 0
        //   });
        //   wx.setStorage({
        //     key: "token",
        //     data: res.data.data.token,
        //     success: function () {
        //       wx.switchTab({
        //         url: '/pages/ucenter/index/index'
        //       });
        //     }
        //   });

        // }
        // console.log(res.data.data.token)
      }
    });
  },

  bindCompNameInput: function (e) {
    this.data.compName = e.detail.value;
  },

  bindnew_psd: function (e) {
    this.data.new_psd = e.detail.value;
  },

  bindold_psd: function (e) {
    this.data.old_psd = e.detail.value;
  },

  bindphone: function (e) {
    this.data.phone = e.detail.value;
  },

  bindCodeInput: function (e) {
    this.data.code = e.detail.value;
  },

  downtime: function (event) {
    if (!checkdata(this)) {
      console.log("出错");
      return false;
    }
    (this.data.timeOpen) ? countdown(this) : '';
  },


})

function checkdata(that) {
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;

  if (that.data.compName.length < 3) {
    wx.showToast({
      icon: 'none',
      duration: 1500,
      title: '用户名不得少于3位',
    })
    return false;
  } else if (that.data.new_psd != that.data.old_psd) {
    wx.showToast({
      icon: 'none',
      duration: 1500,
      title: '两次密码输入不一致',
    })
    return false;
  } else if (that.data.new_psd.length < 6) {
    wx.showToast({
      icon: 'none',
      duration: 1500,
      title: '确认密码不得少于6位',
    })
    return false;
  } else if (!mobile.exec(that.data.phone)) {
    wx.showToast({
      icon: 'none',
      duration: 1500,
      title: '手机号码有误',
    })
    return false;
  }else {
    return true;
  }
}

function countdown(that) {
  wx.request({
    url: api.Companysms_Register,
    data: {
      tel: that.data.phone,
      openId: app.globalData.openId,
      token: app.globalData.token,
      action: 'register',
      companyName: that.data.compName,
    },
    method: 'POST',
    success:function(res) {
      var myreg = /[\^]/;
      console.log(res);
      console.log(!myreg.test(res.data.data));
      if (res.data.code == 200) {
        if (!myreg.test(res.data.data)) {
          wx.showModal({
            title: '错误提示',
            content: "请求次数过多，请稍后再试",
            showCancel: false
          });
          return false;
        }
        that.data.biz_id = res.data.data;
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
              msg: '验证码已发送到' + lphone + '，请注意查收'
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
          title: '错误提示',
          content: res.data.data,
          showCancel: false
        });
      }     
    }
  });
  
}