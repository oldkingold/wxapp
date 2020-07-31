const app = getApp();
const order = require("../../utils/home/order.js");
const util = require("../../utils/util.js");

Page({

  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav: 0, // 0充值订单   1报名订单
    login: 0,

    nav_selectId: 0,
    // menu: ["全部", "待支付","汇款确认中","已完成","已取消"],
    menu: ["全部"],
    orders:[],
    current_ordernum: [0,0,0,0,0],
    loadingMoreHidden: true,

    bm_nav_selectId: 0,
    // bm_menu: ["全部", "待支付", "已完成", "已取消","已退款"],
    bm_menu: ["全部"],
    bm_orders: [],
    bm_current_ordernum: [0, 0, 0, 0, 0],
    bm_loadingMoreHidden: true,

    orderhkShow:true,
    orderhkMoney: 0,
    orderhkId: 0,

    balance: {"remainder": 0, "using": 0, "used": 0},

    lock: false //处理长按事件问题
  },

  onLoad: function () {
    let that = this;
    // let company_setting = wx.getStorageSync('company_setting');
    // if (company_setting) {
      this.onPullDownRefresh();
      order.myVip1Balance().then((res) => {
        if (res.data.code == 200) {
          that.setData({
            balance: { "remainder": res.data.remainder, "using": res.data.using, "used": res.data.used }
          })
        }
      })
    // } else { 
    //   that.setData({
    //     nav: 1,
    //     login: 1, // 未登录公司账号
    //   })
    //   this.onPullDownRefresh();
    // }
    
  },

  onShow: function () {
    let that = this;
    
    this.setData ({
      orders: this.data.orders,
      bm_orders: this.data.bm_orders
    })
  },

  //切换充值订单 和 报名订单
  nav: function (e) {
    var nav = e.currentTarget.dataset['id'];
    console.log(nav);
    console.log(!nav);
    this.setData({
      nav: nav
    })
    this.onPullDownRefresh();
  },

  //
  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id']
    if(this.data.nav == 0) {   //充值订单
      this.setData({
        nav_selectId: cnum,
      })
    } else if (this.data.nav == 1){  //报名订单
      this.setData({
        bm_nav_selectId: cnum,
      })
    }
    
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
    if (this.data.nav == 1) {
      orders = this.data.bm_orders;
    }
    for (let i in orders) {
      if (orders[i]["id"] == oId) {
        if (this.data.nav == 1) {
          if (e.detail.err == 200) {
            orders[i]["status"] = 2;
          }else {
            this.onPullDownRefresh();
            return;
          }
        } else if (this.data.nav == 0) {
          if (e.detail.err == 200) {
            orders[i]["pay_status"] = 1;
          }else {
            this.onPullDownRefresh();
            return;
          }
        }
        orders[i]["pay_date"] = e.detail.date;
        orders[i]["pay_img"] = e.detail.img;
      }
    }
    
    if (this.data.nav == 1) {
      this.setData({
        bm_orders: orders,
      });
    } else if (this.data.nav == 0) {
      this.setData({
        orders: orders,
      });
    }
  },

  toOrderdetail: util.throttle(function(e) {
    //防止长按时被触发
    if (this.data.lock) {
      return;
    }

    var OId = e.currentTarget.dataset['id'];
    if (this.data.nav == 0) {   //充值订单
      wx.navigateTo({
        url: '/pages/orderdetail/orderdetail?OId=' + OId + "&nav=0",
      })
    } else if (this.data.nav == 1) {  //报名订单
      wx.navigateTo({
        url: '/pages/orderdetail/orderdetail?OId=' + OId + "&nav=1",
      })
    }
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
    
    if (this.data.nav == 0) {   //充值订单
      this.data.current_ordernum[this.data.nav_selectId] = 0;
      this.setData({
        orders: [],
        loadingMoreHidden: true
      });
      this.requestOrder(this.data.nav_selectId);      
    } else if (this.data.nav == 1) {  //报名订单
      this.data.bm_current_ordernum[this.data.bm_nav_selectId] = 0;
      this.setData({
        bm_orders: [],
        bm_loadingMoreHidden: true
      });
      this.requestBm(this.data.bm_nav_selectId)
    }
    
  },

  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    if (this.data.nav == 0) {   //充值订单
      this.data.current_ordernum[this.data.nav_selectId] += 1;
      this.requestOrder(this.data.nav_selectId);
    } else if (this.data.nav == 1) {  //报名订单
      this.data.bm_current_ordernum[this.data.bm_nav_selectId] += 1;
      this.requestBm(this.data.bm_nav_selectId)
    }
    
  },
  //会员订单请求
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
  },
  //报名订单请求
  requestBm: function (type) {
    var that = this;
    // myBmOrders
    order.myBmOrders({
      openId: app.globalData.openId,
      token: app.globalData.token,
      pages: that.data.bm_current_ordernum[type],
      type: that.data.bm_menu[type],
    }).then(function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (res.data.code == 200) {
        res = res.data.data;
        console.log(res);
        if (res.length > 0) {
          for (let i in res) {
            that.data.bm_orders.push(res[i]);
          }
          that.setData({
            bm_orders: that.data.bm_orders,
          });
        } else {
          that.data.bm_current_ordernum[type] -= 1;
          that.setData({
            bm_loadingMoreHidden: false
          })
        }
        
      }
    })
  },
  touchend: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 50);
    }
  },
  //复制到剪切板
  copy: function (e) {
    //长按加锁
    this.setData({ lock: true });
    wx.setClipboardData({
      data: e.currentTarget.dataset.value,
      success: function (res) {
        wx.showToast({
          title: e.currentTarget.dataset.key + '复制成功',
          icon: "none"
        });
      }
    });
  },
})