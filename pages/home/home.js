const app = getApp();
const util = require('../../utils/util.js');
const meeting = require('../../utils/home/meeting.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav_selectId: 'menu0',
    nav_siv: 'menu0',
    nav_list_selectId: 'menu0',
    menu: [],        
    menu_list: [],   //类型栏下拉框
    menuShow: false, // 是否展示类型栏
    menudownShow: true, //类型栏下拉框控制
    rooturl: api.ApiRootUrl,
    meetings: [],
    menu_meetings: [],
    swipercurrentitemid: 0,
    scrolltop:0,
    topview:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查更新
    util.updateProgram();
    //会议主题
    meeting.themes().then(function(res) {
      if (res.data.menu.length > 1) {
        console.log(res.data.meeting);
        that.setData({
          menu : res.data.menu,
          menu_meetings: res.data.meeting,
          menu_list: util.split_array(res.data.menu, 6)
        });
      }else {
        that.setData({
          menuShow: true,
          screenHeight: that.data.screenHeight + 42
        });
      }
    });

    meeting.meeting().then(function(res) {
      if (res.data) {
        that.setData({
          meetings: res.data,
        });
        console.log(res.data);
        wx.setStorageSync("meetings", res.data);
      }
    });
   
  },
  
  onShow: function() {
  
  },

  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id'] -2 
    this.setData({
      nav_siv: "menu"+cnum,
      nav_selectId: e.currentTarget.id,
      swipercurrentitemid: cnum + 2,
    })
  },
  nav_list_selected (e) {
    // console.log(e);
    var cnum = e.currentTarget.dataset['id'] - 2 >= 0 ? e.currentTarget.dataset['id'] - 2 : 0;
    this.setData({
      nav_siv: "menu" + cnum,
      nav_selectId: "menu" + e.currentTarget.dataset['id'],
      swipercurrentitemid: cnum + e.currentTarget.dataset['id'],
    })
  },
  //左右滑动事件
  swiperChange (e) {
    console.log(e.detail.currentItemId);
    this.setData({
      nav_selectId: "menu" + e.detail.currentItemId,
    });
  },

  menuDown: function (e) {
    console.log(e);
    var menudownShow = !this.data.menudownShow;
    this.setData({
      menudownShow: menudownShow
    });
  },

  //跳转到详情页
  toDetail: function (e) {
    // console.log(e.currentTarget.dataset['meeting']);
    wx.navigateTo({
      url: '../detail/detail?meeting=' + e.currentTarget.dataset['meeting'],
    })
  },

  toBaoming: function (e) {
    wx.navigateTo({
      url: '../baoming/bm/bm',
    })
  },

  topperUpdate: function(e) {
    
  },
  
  scrollstart: function() {
    if (this.data.topview == 0) {
      this.setData({
        scrolltop: 1,
        topview:40
      });
    }
  },

  scrollend: function () {
    
  }
})