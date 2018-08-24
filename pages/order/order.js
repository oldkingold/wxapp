const app = getApp();

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
  },

  onLoad: function (options) {
  
  },

  nav_select: function (e) {
    var cnum = e.currentTarget.dataset['id'] - 2
    this.setData({
      nav_siv: "menu" + cnum,
      nav_selectId: e.currentTarget.id
    })
  },
})