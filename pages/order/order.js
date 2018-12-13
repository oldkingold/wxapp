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
  },

  onLoad: function (options) {
    let that = this;
    order.myCardOrder().then(function(res){
      for(let i in res) {
        res[i]['remainDate'] = util.formatTimeToSevenDay(res[i]['created_at']);
        res[i]['cardInfo'] = JSON.parse(res[i]['cardInfo']);
        for(let j in that.data.menu) {
          if (that.data.menu[j]['menu_id'] == res[i]['status']) {
            that.data.menu[j]['num']++;
            that.data.menu[0]['num']++;
          }
        }
      }
      console.log(that.data.menu);
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

})