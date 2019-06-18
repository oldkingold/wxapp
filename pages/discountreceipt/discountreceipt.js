const api = require('../../config/api.js');
const util = require('../../utils/util.js');
const meeting = require('../../utils/home/meeting.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rooturl: api.ApiRootUrl,
    meetings:[],
    latestCompany:{},
    discountprice: 0,
  },

  onLoad: function (options) {
    let that = this;
    var meetings = wx.getStorageSync("meetings");
    if (!meetings) {
      meeting.meeting().then(function (res) {
        if (res.data) {
          that.setData({
            meetings: res.data,
            discountprice: options.discountprice
          });
          wx.setStorageSync("meetings", res.data);
        }
      });
    }else {
      that.setData({
        meetings: meetings,
        discountprice: options.discountprice
      });
    }
    
  },

  onShow: function () {
    let that = this;
    //获取最近一场会议的报名
    wx.request({
      url: api.mylatestpeixun,
      method: "POST",
      data:{
        token: app.globalData.token
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.setData({
            latestCompany : res.data.data
          });
        }
      }
    })
  },
  
  //跳转我的订单页
  toOrder: util.throttle(function () {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },2000),
  //跳转会议详情页
  toDetail: util.throttle(function (e) {
    wx.navigateTo({
      url: '/pages/detail/detail?meeting=' + e.currentTarget.dataset['meeting'],
    })
  },2000),
  //跳转报名记录
  more: util.throttle(function () {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },2000),
})