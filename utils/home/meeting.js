const api = require('../../config/api.js');

//获取会议主题
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
        console.log(res);
        reject(res);
      }

    })
  });
}

//获取会议
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
        console.log(res);
        reject(res);
      }

    })
  });
}

//获取某一场会议
function meetingDetail(id) {
  let meetings = wx.getStorageSync("meetings");

  if (meetings) {
    return meetings[id];
  }else {
    return null;
  }

}

function companyInfo() {
  let companyInfo = wx.getStorageSync("companyInfo");
  
    return new Promise(function (resolve, reject) {
      if (!companyInfo) {
        wx.request({
          url: api.companyInfo,
          method: "GET",
          success: function (res) {
            wx.setStorageSync("companyInfo", res.data);
            resolve(res.data)
          },
          fail: function (res) {
            reject(res);
          }
        })
      } else {
        resolve(companyInfo)
      }
    });
  
}

module.exports = {
  themes: themes,
  meeting: meeting,
  meetingDetail: meetingDetail,
  companyInfo: companyInfo,
}