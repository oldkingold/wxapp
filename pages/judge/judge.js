const api = require('../../config/api.js');

Page({

  data: {
    webSite: ''
  },

  onLoad: function (options) {
    if (options.website) {
      if (options.website == 'https://www.58jz.com.cn' || options.website == 'https://58jz.com.cn') {
        this.setData({
          webSite: options.website
        })
      } else {
        if (options.website.indexOf("https://dcwlgroup.com/") != -1 || options.website.indexOf("https://58jz.com.cn/") != -1) {
          
          this.setData({
            webSite: options.website + "?meeting=" +options.meeting
          })
        }else {
          wx.showModal({
            title: '提示',
            content: '错误',
            success: function () {
              wx.navigateBack({
              })
            }
          })
        }
      }
    } else {
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

})