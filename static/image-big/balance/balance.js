var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    balance: '0',
    totalRecharge: '0',
    totalSpent: '0',
    appHeight: app.globalData.systemInfo.height,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    themeList: [{ 'name': '消费记录' }, { 'name': '充值记录' }],
    showModal:true,
    list: [
      [],
      []
    ]
  },
  onLoad: function (options) {
    var that = this;
    var token = app.globalData.token;
    wx.request({
      url: api.moneyChange,
      method: 'POST',
      data: {
        token: token,
      },
      success: function (r) {
        if(r.data.code==200) {
          that.setData({
            totalRecharge: parseFloat(r.data.add_all),
            totalSpent: parseFloat(r.data.reduce_all),
            balance: parseFloat(r.data.add_all) - parseFloat(r.data.reduce_all),
            list: [r.data.reduce_details, r.data.add_details]
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '未知错误',
            success: function () {
              wx.navigateBack({
              })
            }
          })
        }
      }
    })
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var that = this;
    this.setData({
      currentTab: e.detail.current,
    });
    var all = that.data.list;
    var currentTab = that.data.currentTab;
    var calc = 200 * all[currentTab].length + 80;
    that.setData({
      winHeight: calc
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
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  bind_showModal:function(){
    this.setData({
      showModal: true
    });
  }

})