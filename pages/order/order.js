const app = getApp();
const order = require("../../utils/home/order.js");
const util = require("../../utils/util.js");

Page({

  data: {
    screenHeight: app.globalData.systemInfo['height'],
    nav_selectId: 'menu0',
    nav_siv: 'menu0',
    nav_list_selectId: 'menu0',
    menu: [{ menu_id: 0, title: "全部" },
    { menu_id: 1, title: "待支付" },
    { menu_id: 2, title: "已完成" },
    { menu_id: 3, title: "已失败" },
    { menu_id: 4, title: "已取消" },],
    orders:[],
  },

  onLoad: function (options) {
    let that = this;
    order.myCardOrder().then(function(res){
      for(let i in res) {
        res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
      }
      that.setData({
        orders:res,
      });
    });

  },

  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id'] - 2
    this.setData({
      nav_siv: "menu" + cnum,
      nav_selectId: e.currentTarget.id
    })
  },
})