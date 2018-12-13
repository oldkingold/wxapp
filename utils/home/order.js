const api = require('../../config/api.js');
const app = getApp();

function myCardOrder() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.CardOrder,
      method: "POST",
      data: {
        token: app.globalData.token,
      },
      success:function(res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}

function myUsedRecord() {
  return new Promise(function (resolve, reject) { 
    wx.request({
      url: api.UsedRecord,
      method: "POST",
      data: {
        token: app.globalData.token,
      },
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}

module.exports = {
  myCardOrder: myCardOrder,
  myUsedRecord: myUsedRecord,
}