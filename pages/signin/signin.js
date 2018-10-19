var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    meetingList: [],
  },
  onLoad: function (options) {
    var that = this;
    var token = app.globalData.token;
    wx.request({
      url: api.allSigns,
      method: 'POST',
      data: {
        token: token
      },
      success: function (r) {
        if (r.data.code == 200) {
          console.log(r.data.data)
          that.setData({
            meetingList: r.data.data
          })
        }
      }
    })

  },
  scanCode: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.errMsg == 'scanCode:ok') {
          wx.navigateTo({
            url: '/pages/signining/signining?meetingId=' + res.result,
          })
        }
      }
    })
  },
  goJudge: function (e) {
    var meeting_id = e.currentTarget.dataset['meeting_id'];
    if (!meeting_id) {
      wx.showModal({
        title: '提示',
        content: '评价时间未到或已过期',
        success: function () {
          wx.navigateBack({
          })
        }
      })
    }
    var meeting = null;
    var meetingList = this.data.meetingList
    for (var i = 0; i < meetingList.length; i++) {
      if (meetingList[i].id == meeting_id) {
        meeting = meetingList[i];
        break;
      }
    }
    if (!meeting) {
      wx.showModal({
        title: '提示',
        content: '评价时间未到或已过期',
        success: function () {
          wx.navigateBack({
          })
        }
      })
    }
    var scene = meeting.scene[0];
    if (!scene) {
      wx.showModal({
        title: '提示',
        content: '评价时间未到或已过期错误',
        success: function () {
          wx.navigateBack({
          })
        }
      })
    }
    var question_begin = Date.parse(scene.question_begin);
    var question_end = Date.parse(scene.question_end);
    var now_time = Date.parse(new Date());
    if (now_time >= question_begin && now_time <= question_end) {
      wx.navigateTo({
        url: '/pages/judge/judge?website=' + scene.question_url,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '评价时间未到或已过期',
        success: function () {
          wx.navigateBack({
          })
        }
      })
    }

  }
})