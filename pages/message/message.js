const app = getApp();
const api = require("../../config/api.js");
const util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [
      
    ]
  },

  onLoad: function (options) {
    var rex = /0\d{2,3}-\d{7,8}/g;
     
    var message = wx.getStorageSync("message");
    console.log(message);
    for (let index in message) {
      var info = message[index]['info'];
      //将电话与其他文字分割开，以数组形式重新拼接
      console.log(info);
      var arr = info.split(rex);
      var phone = info.match(rex);
      for (let i in phone) {
        arr.splice(i * 2 + 1, 0, phone[i])
      }
      message[index]['info'] = arr;
      message[index]['date'] = message[index]['date'].substring(0, 10);
    }
    //刷新
    this.setData({
      message: message
    });
    
  },

  onUnload: function() {
    this.readAll()
  },

  phonecall: function (e) {
    let tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  readAll: function () {
    var that = this;
    var data = {};
    data['token'] = app.globalData.token;
    data['openId'] = app.globalData.openId;
    util.request(api.message_all, "post", data).then((res) => {
      if (res.data.code == 200) {
        var message = that.data.message;
        for(let i in message) {
          message[i].read = 1;
        }
        that.setData({
          message: message
        })
      }
    });

  },
  
  readMessage: function (e) {
    var that = this;

    var data = {};
    data['token'] = app.globalData.token;
    data['openId'] = app.globalData.openId;
    data['id'] = e.currentTarget.dataset["id"];
    util.request(api.message_read, "post", data).then((res) => {
      if(res.data.code = 200){
        var message = that.data.message;
        message[e.currentTarget.dataset["index"]].read = 1;
        that.setData({
          message: message
        })
      }
    });
  }



})