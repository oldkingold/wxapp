var api = require('../../config/api.js');
const meet = require('../../utils/home/meeting.js');
Page({
  data: {
    companyInfo: [],
  },
  onLoad: function (options) {
    var that = this;
    meet.companyInfo().then(function (res) {
      // that.data.companyInfo = res.split("\n");
      that.setData({
        companyInfo: res.split("\n")
      });
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: '', // 当前显示图片的http链接     
      urls: [api.ApiRootUrl + '/images/wxxcx/companycode.png'], // 需要预览的图片http链接列表
      success: function () {

      }
    })
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
  copy: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.value,
      success: function (res) {
        wx.showToast({
          title: e.currentTarget.dataset.key + '复制成功',
          icon: "none"
        });
      }
    });
  },
})
