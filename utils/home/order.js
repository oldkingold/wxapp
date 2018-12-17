const api = require('../../config/api.js');
const app = getApp();

function CardInfo() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.CardInfo,
      method: "POST",
      data: {
        token: app.globalData.token,
      },
      success: function (res) {
        let r = res.data;
        if (r.code == 200) {
          resolve(r.data)
        }else {
          reject(r);
        }
        
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}

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
  CardInfo: CardInfo,
}