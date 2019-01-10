var api = require('../../config/api.js');
const util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    bmMeetingLog:{},
  },

  onLoad: function (options) {
       
  },
  
  onShow: function () {
    // 页面显示
    let bmMeetingLog = wx.getStorageSync('tobmlogdetail');
    // storage.remove('tobmlogdetail');
    this.setData({
      bmMeetingLog: bmMeetingLog,
    });
  },
  onUnload:function() {
    wx.removeStorageSync('tobmlogdetail');
  },
  //取消报名
  canclebm: function () {
    let coms = this.data.bmMeetingLog['com']
    wx.showModal({
      title: '取消报名',
      content: '是否取消本次会议报名',
      success: function (e) {
        if (e.confirm == true) {
          wx.request({
            url: api.myPxscancle,
            method: "POST",
            data: {
              token: app.globalData.token,
              openId: app.globalData.openId,
              com: coms,
            },
            success: function (res) {
              console.log(res);
              //返回报名记录界面
            }
          })
        }
      }
    })
  },
  changebm: util.throttle(function(e) {
    let coms = this.data.bmMeetingLog;
    let changebmdata = {};
    changebmdata['id'] = coms['meet'];
    changebmdata['com'] = coms['com'];
    changebmdata['compName'] = coms['comname'];
    changebmdata['compNature'] = coms['compNature'];
    changebmdata['meetPersonlist'] = coms['attendees'];
    changebmdata['singleRoomNum'] = coms['singleRoomNum'];
    changebmdata['doubleRoomNum'] = coms['doubleRoomNum'];
    if (changebmdata['singleRoomNum'] + changebmdata['doubleRoomNum'] > 0) {
      changebmdata['isNotNeedRoom'] = false;
    } else {
      changebmdata['isNotNeedRoom'] = true;
    }
    // changebmdata['mealList'] = meals(coms['meet'], coms['meals']);
    // changebmdata['isNotNeedMeal'] = coms['isNotNeedMeal'];
    changebmdata['invoice'] = {
      invType: coms['invoice']['anture'],
      invCompName: coms['invoice']['compName'],
      taxIdNum: coms['invoice']['invoiceId'],
      compAddr: coms['invoice']['compAddr'],
      compTel: coms['invoice']['compTel'],
      compBank: coms['invoice']['openBank'],
      compBankAccount: coms['invoice']['bankAccount'],
    };
    changebmdata['note'] = coms['note'];
    changebmdata['usedChart'] = coms['note'].length;

    wx.setStorageSync('changebmdata', changebmdata);
    wx.navigateTo({
      url: "/pages/baoming/bm/bm?id=" + coms['meet'] +"&method=" + e.target.dataset['id'],
    })
  }, 2000),

})