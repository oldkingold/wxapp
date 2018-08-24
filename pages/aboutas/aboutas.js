// var api = require('../../../config/api.js');
Page({
  data: {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  previewImage: function (e) {
    // wx.previewImage({
    //   current: '', // 当前显示图片的http链接     
    //   urls: [api.ApiRootUrl + '/images/wxxcx/companycode.png'], // 需要预览的图片http链接列表
    //   success: function () {

    //   }
    // })
  },
  //拨打电话
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {

      },
      complete: function () {

      }
    })
  },

})
