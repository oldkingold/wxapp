const app = getApp();
const order = require("../../utils/home/order.js");
const util = require("../../utils/util.js");

Page({

  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav_selectId: 'menu4',
    nav_list_selectId: 'menu4',
    swipercurrentitemid: 4,
    menu: [{ menu_id: 4, title: "全部", num: 0  },
      { menu_id: 3, title: "待支付", num: 0 },
      { menu_id: 2, title: "已完成", num: 0  },
      { menu_id: 1, title: "已失败", num: 0  },
      { menu_id: 0, title: "已取消", num: 0  },],
    orders:[],
    orderhkShow:true,
    orderhkMoney: 0,
    orderhkId: 0,
  },

  onLoad: function (options) {
    let that = this;
    order.myCardOrder().then(function(res){
      for(let i in res) {
        res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
        res[i]['cardInfo'] = JSON.parse(res[i]['cardInfo']);
        for(let j in that.data.menu) {
          if (that.data.menu[j]['menu_id'] == res[i]['status'] || (res[i]['status'] == -1 && that.data.menu[j]['menu_id'] == 0)) {
            that.data.menu[j]['num']++;
            that.data.menu[0]['num']++;
          }
        }
      }
      console.log(that.data.menu);
      console.log(res);
      that.setData({
        orders:res,
        menu: that.data.menu
      });
    });

  },

  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id']
    this.setData({
      nav_selectId: e.currentTarget.id,
      swipercurrentitemid: cnum,
    })
  },

  swiperChange: function (e) {
    this.setData({
      nav_selectId: "menu" + e.detail.currentItemId,
    });
  },

  remit: function(e) {
    console.log(e);
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
  }

})