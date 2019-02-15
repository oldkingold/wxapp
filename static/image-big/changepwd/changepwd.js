var api = require('../../../config/api.js');
var Mcaptcha = require('../../../utils/mcaptcha.js');
var app = getApp();
Page({
  data: {
    newCom: {
      prePwd: '',
      newPwd: '',
      newPwd2: '',
      cptCode: '',
    },
    _eye: true,
    pwd: "",
    new_eye: true,
    new_pwd: "",
    timeOpen: true,
    code: '',
    cvs: {
      width: 100,
      height: 35
    },
  },
  onLoad: function (options) {
    var codestr = codeString();
    this.setData({
      code: codestr
    })
    // this.data.code = codestr;
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
  bind_pre_pwd: function (e) {
    var newCom = this.data.newCom
    newCom['prePwd'] = e.detail.value
    this.setData({
      newCom: newCom
    });
  },
  bind_new_pwd: function (e) {
    var newCom = this.data.newCom
    newCom['newPwd'] = e.detail.value
    this.setData({
      newCom: newCom
    });
  },
  bind_new_pwd2: function (e) {
    var newCom = this.data.newCom
    newCom['newPwd2'] = e.detail.value
    this.setData({
      newCom: newCom
    });
  },
  bind_cptCode: function (e) {
    var newCom = this.data.newCom
    newCom['cptCode'] = e.detail.value
    this.setData({
      newCom: newCom
    });
  },
  downtime: function (event) {
    (this.data.timeOpen) ? countdown(this) : ''
  },
  pasortext: function (event) {
    var newCom = this.data.newCom
    var ty = event.currentTarget.dataset.ty;
    this.setData({
      inputType: !this.data.inputType,
      _eye: !this.data._eye,
      newCom: newCom
    });
  },
  pasortext2: function (event) {
    var newCom = this.data.newCom
    this.setData({
      newinputType: !this.data.newinputType,
      new_eye: !this.data.new_eye,
      newCom: newCom
    });
  },
  confirm: function () {
    var that = this;
    var varprePwd = that.data.newCom.prePwd;
    var varnewPwd = that.data.newCom.newPwd;
    var varnewPwd2 = that.data.newCom.newPwd2;
    var varcptCode = that.data.newCom.cptCode;
    if (!(that.check_name(varprePwd) && that.check_name(varnewPwd) && that.check_name(varnewPwd2) && that.check_name(varcptCode))) {
      wx.showModal({
        title: '错误',
        content: '数据不能为空',
      })
      return false;
    }
    if (!that.check_double_pwd(varnewPwd, varnewPwd2)) {
      wx.showModal({
        title: '错误',
        content: '两次密码不一致',
      })
      return false;
    }
    if (that.data.code.toLowerCase() != varcptCode.toLowerCase()) {
      wx.showModal({
        title: '错误',
        content: '验证码错误',
      })
      return false;
    }
    if (varprePwd == varnewPwd) {
      wx.showModal({
        title: '错误',
        content: '新密码不能与原密码相同',
      })
      return false;
    }

    var token = app.globalData.token;
    wx.request({
      url: api.companyChangePsw,
      method: 'POST',
      data: {
        token: token,
        oldPwd: varprePwd,
        newPwd: varnewPwd
      },
      success: function (r) {
        if (r.data.code != 200) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '错误'
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '修改成功',
            showCancel: true,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  },
  check_name: function (name) {
    return name.length < 1 ? false : true
  },
  check_double_pwd: function (pre, current) {
    return pre == current ? true : false;
  }

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
