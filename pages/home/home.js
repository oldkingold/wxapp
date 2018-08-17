const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav_selectId: 'menu0',
    nav_siv: 'menu0',
    nav_list_selectId: 'menu0',
    menu: [{ menu_id: 0, title: "全部" }, 
          { menu_id: 1, title: "财税" },
          { menu_id: 2, title: "管理" },
          { menu_id: 3, title: "法务" },
          { menu_id: 4, title: "造价" },
          { menu_id: 5, title: "财税财税"},
          { menu_id: 6, title: "合同" },
          { menu_id: 7, title: "财税" },
          { menu_id: 8, title: "财税" },
          { menu_id: 9, title: "财税" },
          { menu_id: 10, title: "财税" },
          { menu_id: 11, title: "财税" },
          { menu_id: 12, title: "财税" },],
    menu_list: [],
    menudownShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.systemInfo['height']);
    console.log(util.split_array(this.data.menu,6));
    this.data.menu_list = util.split_array(this.data.menu, 6);
    this.setData({
      menu_list: util.split_array(this.data.menu, 6)
    });
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id'] -2 
    this.setData({
      nav_siv: "menu"+cnum,
      nav_selectId: e.currentTarget.id
    })
  },
  nav_list_selected (e) {
    // console.log(e);
    var cnum = e.currentTarget.dataset['id'] - 2 >= 0 ? e.currentTarget.dataset['id'] - 2 : 0;
    this.setData({
      nav_siv: "menu" + cnum,
      nav_selectId: "menu" + e.currentTarget.dataset['id']
    })
  },
  menuDown: function (e) {
    console.log(e);
    var menudownShow = !this.data.menudownShow;
    this.setData({
      menudownShow: menudownShow
    });
  },
  toBaoming: function (e) {
    wx.navigateTo({
      url: '../baoming/bm/bm',
    })
  }
})