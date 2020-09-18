var api = require('../../config/api.js');
const util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    themeList: [{ 'name': '已报名' }, { 'name': '已取消' }],
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    bmMeetingLog: [],
    refresh: '',
  },
  onLoad: function (options) {
    //刷新页面
    this.data.refresh = 'refresh';
  },
  onShow: function () {
    if (this.data.refresh == 'refresh') {
      let that = this;
      let token = app.globalData.token;
      let openId = app.globalData.openId;
      wx.request({
        url: api.myPeixuns,
        method: "POST",
        data: {
          token: token,
          openId: openId,
          stas: 1,
        },
        success: function (e) {
          console.log(e)
          let bmMeetingLog = that.data.bmMeetingLog;
          if (e.data.res.length == 0) {
            bmMeetingLog[0] = false;
          } else {
            bmMeetingLog[0] = e.data.res;
          }
          that.setData({
            bmMeetingLog: bmMeetingLog,
          })
        }
      })
      wx.request({
        url: api.myPeixuns,
        method: "POST",
        data: {
          token: token,
          openId: openId,
          stas: 0,
        },
        success: function (e) {
          console.log(e)
          let bmMeetingLog = that.data.bmMeetingLog;
          if (e.data.res.length == 0) {
            bmMeetingLog[1] = false;
          }else {
            bmMeetingLog[1] = e.data.res;
          }
          
          that.setData({
            bmMeetingLog: bmMeetingLog,
          })
        }
      })
      this.data.refresh = '';
    }
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    this.setData({
      currentTab: e.detail.current,
    });
    this.checkCor();
  },

  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 600
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //重新报名，更改报名
  changebm: util.throttle(function(e) {
    let id = e.target.id;
    let coms = this.data.bmMeetingLog[this.data.currentTab][id];
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
    }else{
      changebmdata['isNotNeedRoom'] = true;
    }
    // changebmdata['mealList'] = meals(coms['meet'], coms['meals']);
    // console.log(coms['meals']);
    console.log(changebmdata['mealList']);
    changebmdata['isNotNeedMeal'] = coms['isNotNeedMeal'];
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
      url: e.target.dataset['id'],
    })
  }, 2000),
  //取消报名
  canclebm: util.throttle(function(e) {
    let that = this;
    let id = e.target.id;
    let coms = this.data.bmMeetingLog[0][id]['com']
    wx.showModal({
      title: '取消报名',
      content: '是否取消本次会议报名',
      success:function(e) {
        if (e.confirm == true) {
          wx.request({
            url: api.myPxscancle,
            method:"POST",
            data: {
              token: app.globalData.token,
              openId: app.globalData.openId,
              com: coms,
            },
            success:function(res) {
              that.data.refresh = 'refresh';
              that.onShow();
            }
          })
        }
      }
    })
  }, 2000),
  //跳转报名详情页
  tobmlogdetail: util.throttle(function(e) {
    let num = this.data.currentTab;
    let tobmlogdetail = this.data.bmMeetingLog[num][e.currentTarget.id];
    wx.setStorageSync('tobmlogdetail', tobmlogdetail);
    wx.navigateTo({
      url: '/pages/bmlogdetail/bmlogdetail',
    })
  },2000),
  
})