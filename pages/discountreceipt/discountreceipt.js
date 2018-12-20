const api = require('../../config/api.js');
const meeting = require('../../utils/home/meeting.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooturl: api.ApiRootUrl,
    meetings:[],
  },

  onLoad: function (options) {
    let that = this;
    var meetings = wx.getStorageSync("meetings");
    if (!meetings) {
      meeting.meeting().then(function (res) {
        if (res.data) {
          that.setData({
            meetings: res.data,
          });
          wx.setStorageSync("meetings", res.data);
        }
      });
    }else {
      that.setData({
        meetings: meetings,
      });
    }
    
  },

  onShow: function () {
    
  },
  
  //跳转我的订单页
  toOrder :function () {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },
  //跳转会议详情页
  toDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?meeting=' + e.currentTarget.dataset['meeting'],
    })
  },
  //跳转报名记录
  more: function () {
    wx.navigateTo({
      url: '/pages/bmlog/bmlog',
    })
  },
})