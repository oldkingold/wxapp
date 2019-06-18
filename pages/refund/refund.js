// pages/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:0,
  },

  onLoad: function(option) {
    this.setData({
      price: option.price
    })
  },

  back: function() {
    wx.navigateBack({
      
    });
  }

})