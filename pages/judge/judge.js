Page({

  data: {
    webSite: ''
  },

  onLoad: function (options) {
    if (options.website) {
      if (options.website == 'https://www.58jz.com.cn') {
        this.setData({
          webSite: options.website
        })
      } else {
        var is_wjx = options.website.indexOf("www.wjx.cn");
        if (is_wjx == -1) {
          wx.showModal({
            title: '提示',
            content: '错误',
            success: function () {
              wx.navigateBack({
              })
            }
          })
        }
        this.setData({
          webSite: options.website
        })
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