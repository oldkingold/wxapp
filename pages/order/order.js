const app = getApp();
const order = require("../../utils/home/order.js");
const util = require("../../utils/util.js");

Page({

  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav: 0, // 0充值订单   1报名订单
    nav_selectId: 0,
    menu: ["全部","待支付","已完成","已取消","已退款"],
    orders:[],
    current_ordernum: [0,0,0,0,0],
    loadingMoreHidden: true,
    orderhkShow:true,
    orderhkMoney: 0,
    orderhkId: 0,
  },

  onLoad: function () {
    let that = this;
    that.onPullDownRefresh();
  },

  //切换充值订单 和 报名订单
  nav: function (e) {
    var nav = e.currentTarget.dataset['id'];
    console.log(nav);
    console.log(!nav);
    this.setData({
      nav: nav
    })
  },

  //
  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id']
    this.setData({
      nav_selectId: cnum,
    })

    this.onPullDownRefresh();
  },

  remit: function(e) {
    this.setData({
      orderhkShow: false,
      orderhkMoney: e.currentTarget.dataset['money'],
      orderhkId: e.currentTarget.dataset['id'],
    });
  },

  confirmPayment: function(e) {
    console.log(e)
    var oId = e.detail.oId;
    var orders = this.data.orders;
    for (let i in orders) {
      if (orders[i]["id"] == oId) {
        orders[i]["pay_status"] = 1;
        orders[i]["pay_date"] = e.detail.date;
        orders[i]["pay_img"] = e.detail.img;
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
    this.data.current_ordernum[this.data.nav_selectId] = 0;
    this.setData({
      orders:[],
      loadingMoreHidden: true
    });
    this.requestOrder(this.data.nav_selectId);
  },

  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.data.current_ordernum[this.data.nav_selectId] += 1;
    this.requestOrder(this.data.nav_selectId);
  },

  requestOrder: function(type) {
    var that = this;
    order.myVip1Order({
      openId: app.globalData.openId,
      token: app.globalData.token,
      pages: that.data.current_ordernum[type],
      type: that.data.menu[type],
    }).then(function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      console.log(res.data)
      if (res.data.code == 200) {
        res = res.data.data;
        console.log(res.length > 0);
        if (res.length > 0) {
          for (let i in res) {
            res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
            // res[i]['cardInfo'] = JSON.parse(res[i]['cardInfo']);
            if (res[i]['order_type'] == "普通会员") {
              res[i]['order_type_img'] = "common"
            } else if (res[i]['order_type'] == "银牌会员") {
              res[i]['order_type_img'] = "silver"
            } else if (res[i]['order_type'] == "金牌会员") {
              res[i]['order_type_img'] = "gold"
            }
            that.data.orders.push(res[i]);
          }

          that.setData({
            orders: that.data.orders,
          });
        }else {
          console.log("dd");
          that.data.current_ordernum[type] -= 1;
          that.setData({
            loadingMoreHidden: false
          });
        }
      }
    });
  }

})