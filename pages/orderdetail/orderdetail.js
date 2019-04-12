const api = require("../../config/api.js");

Page({

  data: {
    rootUrl: api.ApiRootUrl,
    order:[],
  },

  onLoad: function (options) {
    var pages = getCurrentPages();
    var order = pages[pages.length - 2].data.orders[options['OId']];
    this.setData({
      order: order
    });
  },

  showImage: function(e) {
    wx.showLoading({
      mask:true
    })
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, 
      urls: [url] 
    })
  },

})