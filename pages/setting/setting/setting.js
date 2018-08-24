// var api = require('../../../config/api.js');
// var util = require('../../../utils/util.js');
// var storage = require('../../../services/storage.js');
var app = getApp();
Page({
  data: {
    companySetting: null,
    companyAdmin: false,
    isChanged: false,
    bindCompany: '',
    bindTel: '',
    bindName: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    // let company_setting = storage.getstorage('company_setting', null);
    // let bind_setting = storage.getstorage('bind_setting', null);

    this.setData({
      companySetting: company_setting,
      companyAdmin: company_setting == null ? false : company_setting['admin'],
      bindCompany: bind_setting == null ? '' : bind_setting['company'],
      bindName: bind_setting == null ? '' : bind_setting['name'],
      bindTel: bind_setting == null ? '' : bind_setting['tel'],
    })

  },
  onUnload: function () {
    if (this.data.isChanged) {
      var token = app.globalData.token;
      var com = this.data.bindCompany;
      var name = this.data.bindName;
      var tel = this.data.bindTel;
      // wx.request({
      //   url: api.updateBind,
      //   method: 'POST',
      //   data: {
      //     token: token,
      //     com: com,
      //     name: name,
      //     tel: tel
      //   },
      //   success: function (r) {
      //     if (r.data.code != 200) {
      //       wx.showModal({
      //         showCancel: false,
      //         title: '提示',
      //         content: '错误'
      //       })
      //       return false;
      //     }
      //     let bind_setting = { company: com, name: name, tel: tel };
      //     storage.put('bind_setting', bind_setting, 60 * 60 * 15);
      //     // app.globalData.bindCompany = com;
      //     // app.globalData.bindName = name;
      //     // app.globalData.bindTel = tel;
      //   }
      // })
    }
  },
  bind_unbundling: function () {
    if (this.data.companyAdmin) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '管理员不能解绑'
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '确定解绑企业账号？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            var token = app.globalData.token;
            // wx.request({
            //   url: api.companyUnbind,
            //   method: 'POST',
            //   data: {
            //     token: token,
            //   },
            //   success: function (r) {
            //     if (r.data.code == 200) {
            //       wx.showToast({
            //         title: '解绑成功',
            //         icon: 'success',
            //         duration: 1500
            //       })
            //       // 之后应该重新调用登录方法并清除缓存
            //       util.wxlogin().then((res) => {
            //         app.globalData.token = res.token;
            //         app.globalData.openId = res.openId;
            //       });
            //     }
            //   }
            // })
          }
        }
      })

    }

  },
  bind_comName: function (e) {
    this.setData({
      bindCompany: e.detail.value,
      isChanged: true
    })
  },
  bind_confereeName: function (e) {
    this.setData({
      bindName: e.detail.value,
      isChanged: true
    })
  },
  bind_phone: function (e) {
    this.setData({
      bindTel: e.detail.value,
      isChanged: true
    })
  },
})
