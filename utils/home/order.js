const api = require('../../config/api.js');
const app = getApp();
const util = require('../../utils/util.js');


function CardInfo(data) {
  // return util.request(api.CardInfo,"post",data)
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

function myCardOrder(data) {
  return util.request(api.CardOrder, "post", data);
  // return new Promise(function (resolve, reject) {
  //   wx.request({
  //     url: api.CardOrder,
  //     method: "POST",
  //     data: {
  //       token: app.globalData.token,
  //     },
  //     success:function(res) {
  //       resolve(res.data)
  //     },
  //     fail: function (res) {
  //       reject(res);
  //     }
  //   })
  // });
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

function cancelOrder(OId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.cancelOrder,
      method: "POST",
      data: {
        OId: OId,
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
/***************************************************** */
function myVip1Info() {
  return util.request(api.myVip1Info,"post",{
    token: app.globalData.token,
    openId: app.globalData.openId,
  });
}
module.exports = {
  //套餐方法,暂时弃用
  myCardOrder: myCardOrder,
  myUsedRecord: myUsedRecord,
  CardInfo: CardInfo,
  cancelOrder: cancelOrder,
  //Vip1方法
  myVip1Info: myVip1Info,
}