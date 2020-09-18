var api = require('../../config/api.js');
var Mcaptcha = require('../../utils/mcaptcha.js');
var app = getApp();
Page({
  data: {
    companyId: '',
    psd: '',
    respsd: '',
    cptCode: '',
    code: '',
    cvs: {
      width: 100,
      height: 35
    },
  },
  onLoad: function (options) {
    if (!options.companyid || options.companyid == 0) {
      wx.showModal({
        title: '提示',
        content: '错误',
        showCancel: false,
        complete: function () {
          wx.navigateBack({
          })
        }
      });
      return false;
    }
    var that = this;
    that.setData({
      companyId: options.companyid,
    })
    var codestr = codeString();
    console.log(codestr);
    this.data.code = codestr;
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: this.data.cvs.width,
      height: this.data.cvs.height,
      code: codestr,
    })
  },
  onTap() {
    this.data.code = codeString();
    this.mcaptcha.refresh(this.data.code);
  },
  reset: function () {
    var that = this;
    if (that.data.psd.length < 6) {
      wx.showModal({
        title: '错误信息',
        content: '密码不得少于6位',
        showCancel: false
      });
      return false;
    } else if (that.data.psd != that.data.respsd) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '密码两次不一致有误',
      });
      return false;
    } else if (that.data.cptCode.toLowerCase() != that.data.code.toLowerCase()) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '验证码有误',
      });
      return false;
    }
    var token = app.globalData.token;
    wx.request({
      url: api.smsForgetPwd3,
      data: {
        token: token,
        companyId: that.data.companyId,
        psd: that.data.psd,
        respsd: that.data.respsd
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==200){
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '密码修改成功',
            success:function(res){
              wx.switchTab({
                url: '/pages/wode/wode',
              })
            }
          });
        }else if(res.data.code==201) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.data
          });
          return false;
        }
      }
    })
  },
  bindrespsd: function (e) {
    this.setData({
      respsd: e.detail.value
    });
  },
  bindpsd: function (e) {
    this.setData({
      psd: e.detail.value
    });
  },

  bindCodeInput: function (e) {
    this.setData({
      cptCode: e.detail.value
    });
  },
  downtime: function (event) {
    (this.data.timeOpen) ? countdown(this) : ''
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