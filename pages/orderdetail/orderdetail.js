const api = require("../../config/api.js");
const app = getApp();
const util = require('../../utils/util.js');

Page({

  data: {
    rootUrl: api.ApiRootUrl,
    order:[],
    nav:0,

    orderhkShow: true,
    orderhkMoney: 0,
    orderhkId: 0,
  },

  onLoad: function (options) {
    var pages = getCurrentPages();
    var order;
    if (options['nav'] == 0) {
      order = pages[pages.length - 2].data.orders[options['OId']];
    } else if (options['nav'] == 1) {
      order = pages[pages.length - 2].data.bm_orders[options['OId']];
      order['truth_price'] = parseInt(order['price'] / order['truth_num']);
    }
    
    this.setData({
      order: order,
      nav: options['nav']
    });
  },

  showImage: function(e) {
    console.log(e)
    var url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url, 
      urls: [url] 
    })
  },

  remit: function (e) {
    this.setData({
      orderhkShow: false,
      orderhkMoney: e.currentTarget.dataset['money'],
      orderhkId: e.currentTarget.dataset['id'],
    });
  },

  confirmPayment: function(e) {
    console.log(e)
    var oId = e.detail.oId;
    var pages = getCurrentPages();
    var orders = pages[pages.length - 2].data.orders;
    if (this.data.nav == 1) {
      orders = pages[pages.length - 2].data.bm_orders;
    }
    for (let i in orders) {
      if (orders[i]["id"] == oId) {
        if (this.data.nav == 1) {
          orders[i]["status"] = 2;    
        } else if (this.data.nav == 0){
          orders[i]["pay_status"] = 1;
        }
        orders[i]["pay_date"] = e.detail.date;
        orders[i]["pay_img"] = e.detail.img;
        this.setData({
          order: orders[i]
        });
      }
      
    }
  },

  cancel: function (e) {
    var that = this;
    wx.showModal({
      title: '取消订单',
      content: '是否取消订单',
      success(res) {
        if (res.confirm) {
          console.log(e)
          var data = {}
          data['oId'] = e.currentTarget.dataset['id'];
          data['token'] = app.globalData.token;
          data['openId'] = app.globalData.openId;
          if(that.data.nav == 0) {
            util.request(api.cancelOrderVip1, "post", data).then((ress) => {
              var rdata = ress.data;
              if (rdata.code == 200) {
                wx.showToast({
                  title: "取消成功",
                  icon: 'none',
                  duration: 3000,
                });

                var oId = rdata.oId;
                var pages = getCurrentPages();
                var orders = pages[pages.length - 2].data.orders;
                for (let i in orders) {
                  if (orders[i]["id"] == oId) {
                    orders[i]["pay_status"] = 5;
                    orders[i]["updated_at"] = rdata.date;
                    that.setData({
                      order: orders[i]
                    });
                  }
                }

              } else {
                wx.showToast({
                  title: "取消失败",
                  icon: 'none',
                  duration: 3000,
                });
              }
            });
          } else if (that.data.nav == 1) {
            util.request(api.cancelBmOrder, "post", data).then((res)=>{
              var rdata = res.data;
              if (rdata.code == 200) {
                wx.showToast({
                  title: "取消成功",
                  icon: 'none',
                  duration: 3000,
                });
                var oId = rdata.oId;
                var pages = getCurrentPages();
                var orders = pages[pages.length - 2].data.bm_orders;
                for (let i in orders) {
                  if (orders[i]["id"] == oId) {
                    orders[i]["status"] = 5;
                    that.setData({
                      order: orders[i]
                    });
                  }
                }
              }
            })
          }
          
        } else if (res.cancel) {
        
        }
          
      }
    })
    
  },

  refund: function(e) {
    var that = this;
    console.log(e)
    var bm_order_id = e.currentTarget.dataset["id"];
    console.log(bm_order_id)
    var data = {};
    data['bm_id'] = bm_order_id;
    data['token'] = app.globalData.token;
    data['openId'] = app.globalData.openId;
    util.request(api.bm_refund,"post",data).then((res)=>{
      if(res.data.code == 200) {
        var pages = getCurrentPages();
        var orders = pages[pages.length - 2].data.bm_orders;
        for (let i in orders) {
          if (orders[i]["id"] == bm_order_id) {
            orders[i]["status"] = 3;
            that.setData({
              order: orders[i]
            });
          }
        }
        wx.navigateTo({
          url: '/pages/refund/refund?price=' + this.data.order["price"],
        })
      }else {
        wx.showToast({
          title: "申请失败",
          icon: 'none',
          duration: 3000,
        });
      }
    })
  }
})