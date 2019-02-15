const app = getApp();
const util = require('../../utils/util.js');
const meeting = require('../../utils/home/meeting.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: false, // 是否展示类型栏
    menudownShow: true, //类型栏下拉框控制
    rooturl: api.ApiRootUrl,
    nav_selectId: 'menu0',
    nav_siv: 'menu0',
    menu: [],        
    menu_list: [],   //类型栏下拉框 
    meetings: [],
    menu_meetings: [],
    menu_current_item: 0, //当前页面编号
    currentPage: [], //会议分页
    loadingMoreHidden: [], //更多隐藏
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
        console.log(res.data);
        that.setData({
          menu : res.data.menu,
          // menu_meetings: res.data.meeting,
          menu_list: util.split_array(res.data.menu, 6)
        });
      }else {
        that.setData({
          menuShow: true,
        });
      }

      var menu_meetings = [];
      for (let i = 0; i < that.data.menu.length; i++) {
        console.log(that.data.menu[i]["theme_id"]);
        that.data.loadingMoreHidden[i] = true;
        that.data.currentPage.push(0);
        that.requestMeeting(i);
      }

      that.setData({
        loadingMoreHidden: that.data.loadingMoreHidden,
      });
    });
    
  },
  
  onShow: function() {
  
  },

  nav_select: function (e) {
    
    var cnum = e.currentTarget.dataset['id'] -2 
    console.log(cnum + 2)
    this.setData({
      nav_siv: "menu"+cnum,
      nav_selectId: e.currentTarget.id,
      menu_current_item: -1, //清空当前页面的滚动
    })

    this.setData({
      menu_current_item: cnum + 2,
    })
  },

  nav_list_selected (e) {
    // console.log(e);
    var cnum = e.currentTarget.dataset['id'] - 2 >= 0 ? e.currentTarget.dataset['id'] - 2 : 0;
    this.setData({
      nav_siv: "menu" + cnum,
      nav_selectId: "menu" + e.currentTarget.dataset['id'],
      nav_list_selected: cnum + e.currentTarget.dataset['id'],
    })
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

  //下拉
  onPullDownRefresh: function () {
    var that = this;
    wx.showLoading({
      title: '刷新',
      mask: true,
    })
    var page = that.data.menu_current_item;
    that.data.currentPage[page] = 0;
    that.data.menu_meetings[page] = [];
    that.data.loadingMoreHidden[page] = true;
    that.setData({
      loadingMoreHidden: that.data.loadingMoreHidden
    });
    that.requestMeeting(page);
    
  },
  //上拉
  onReachBottom: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var page = that.data.menu_current_item;

    that.data.currentPage[page] += 1;
    console.log(that.data.currentPage);
    that.requestMeeting(page);

  },

  requestMeeting: function(page) {
    var that = this;
    // var menu_meetings = that.data.menu_meetings;
    meeting.meeting({
      page: that.data.currentPage[page],
      theme_id: parseInt(that.data.menu[page]["theme_id"])
    }).then(function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (res.data) {
        if (res.data.length === 0) {
          that.data.currentPage[page] -= 1;
          that.data.loadingMoreHidden[page] = false;
          that.setData({
            loadingMoreHidden: that.data.loadingMoreHidden,
          });
          return;
        }
        for (let key in res.data) {
          that.data.meetings[key] = res.data[key];
          if (!that.data.menu_meetings[page]) {
            that.data.menu_meetings[page] = [];
          }
          that.data.menu_meetings[page].push(key);
        }
        that.setData({
          meetings: that.data.meetings,
          menu_meetings: that.data.menu_meetings
        });
        console.log(that.data.menu_meetings)
        wx.setStorageSync("meetings", that.data.meetings);
      }
    });
  }
})