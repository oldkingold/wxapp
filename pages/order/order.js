const app = getApp();
const order = require("../../utils/home/order.js");
const util = require("../../utils/util.js");

Page({

  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav_selectId: 'menu4',
    nav_list_selectId: 'menu4',
    swipercurrentitemid: 4,
    menu: [{ menu_id: 4, title: "全部",},
      { menu_id: 3, title: "待支付"},
      { menu_id: 2, title: "已完成"},
      { menu_id: 1, title: "已失败"},
      { menu_id: 0, title: "已取消"},],
    orders:[],
    current_ordernum: [0,0,0,0,0],
    loadingMoreHidden: true,
    orderhkShow:true,
    orderhkMoney: 0,
    orderhkId: 0,
  },

  onLoad: function (options) {
    let that = this;
    order.myCardOrder({
      token: app.globalData.token,
      pages: 0,
      type: that.data.swipercurrentitemid,
    }).then(function(res){
      if(res.data) {
        res = res.data;
        for (let i in res) {
          res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
          res[i]['cardInfo'] = JSON.parse(res[i]['cardInfo']);
          that.data.orders.push(res[i]);
        }

        that.setData({
          orders: that.data.orders,
        });
      }
      
    });

  },

  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id']
    this.setData({
      nav_selectId: e.currentTarget.id,
    })
    this.data.swipercurrentitemid=cnum;

    this.onPullDownRefresh();
  },

  // swiperChange: function (e) {
  //   this.setData({
  //     nav_selectId: "menu" + e.detail.currentItemId,
  //   });
  // },

  remit: function(e) {
    this.setData({
      orderhkShow: false,
      orderhkMoney: e.currentTarget.dataset['money'],
      orderhkId: e.currentTarget.dataset['id'],
    });
  },

  confirmPayment: function(e) {
    var oId = e.detail.oId;
    var orders = this.data.orders;
    for (let i in orders) {
      if (orders[i]["id"] == oId) {
        orders[i]["checkStatus"] = 1;
      }
    }
    this.setData({
      orders: orders,
    });
  },

  toOrderdetail: util.throttle(function(e) {
    var OId = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?OId=' + OId,
    })
  }, 2000),

  cancel: function(e) {
    let that = this;
    var OId = e.currentTarget.dataset['id'];
    wx.showModal({
      content: '确定取消订单？',
      success: function(res) {
        if(res.confirm) {
          order.cancelOrder(OId).then((res)=>{
            that.onLoad();
          });
        }
      }
      
    })
  },

  reremit: function() {
    wx.switchTab({
      url: '/pages/discount/discount',
    })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.data.current_ordernum[this.data.swipercurrentitemid] = 0;
    this.setData({
      orders:[],
      loadingMoreHidden: true
    });
    this.requestOrder(this.data.swipercurrentitemid);
  },

  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.data.current_ordernum[this.data.swipercurrentitemid] += 1;
    this.requestOrder(this.data.swipercurrentitemid);
  },

  requestOrder: function(type) {
    var that = this;
    order.myCardOrder({
      token: app.globalData.token,
      pages: that.data.current_ordernum[that.data.swipercurrentitemid],
      type: type,
    }).then(function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (res.data) {
        res = res.data;
        if (res.length > 0) {
          for (let i in res) {
            res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
            res[i]['cardInfo'] = JSON.parse(res[i]['cardInfo']);

            that.data.orders.push(res[i]);
          }

          that.setData({
            orders: that.data.orders,
          });
        }else {
          that.data.current_ordernum[that.data.swipercurrentitemid] -= 1;
          that.setData({
            loadingMoreHidden: false
          });
        }
        
      }

    });
  }

})