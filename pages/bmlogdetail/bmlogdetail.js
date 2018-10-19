var api = require('../../config/api.js');

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
  changebm:function(e) {
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
  }

})
// function meals(id, meals) {
//   for (let i = 0; i < app.globalData.meetingInfo.length; i++) {
//     if (id == app.globalData.meetingInfo[i].id) {
//       let varmeals = app.globalData.meetingInfo[i].meals;
//       let mlist = {};
//       for (let j = 0; j < varmeals.length; j++) {
//         mlist[varmeals[j]['meal_date'].substring(5)] = { name: varmeals[j]['meal_date'].substring(5), data: {} };
//       }
//       for (let j = 0; j < varmeals.length; j++) {
//         let mt = mlist[varmeals[j]['meal_date'].substring(5)]['data'];

//         mt[varmeals[j]['type']] = { status: varmeals[j]['status'], pnum: parseInt(meals[varmeals[j]['meal_date']][varmeals[j]['type']]) };
//       }

//       if (Object.keys(mlist).length == 3) {
//         let n = 1;
//         for (let k in mlist) {
//           if (n == 1) {
//             mlist[k]['name'] = '报到';
//             n = n + 1;
//           } else if (n == 2) {
//             mlist[k]['name'] = '首日';
//             n = n + 1;
//           } else if (n == 3) {
//             mlist[k]['name'] = '次日';
//           }
//         }
//       }
//       return mlist;
//     }
//   }
// }