const api = require('../../config/api.js');

function themes() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.Theme,
      method: "GET",
      success: function(res) {
        // console.log(res)
        resolve(res)
      },
      fail: function(res) {
        // console.log(res);
        reject(res);
      }

    })
  });
}

function meeting() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.Meeting,
      method: "GET",
      success: function (res) {
        // console.log(res)
        resolve(res)
      },
      fail: function (res) {
        // console.log(res);
        reject(res);
      }

    })
  });
}

function meetingDetail(id) {
  let meetings = wx.getStorageSync("meetings");

  if (meetings) {
    return meetings[id];
  }else {
    return null;
  }

}

module.exports = {
  themes: themes,
  meeting: meeting,
  meetingDetail: meetingDetail,
}