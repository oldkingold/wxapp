const order = require("../../../utils/home/order.js");
const util = require("../../../utils/util.js");

Page({

  data: {
    usedRecords:[]
  },

  onLoad: function (options) {
    let that = this;

    order.myUsedRecord().then((res)=>{
      console.log(res);
      that.setData({
        usedRecords: res
      });
    });
  },

  todetail: util.throttle(function(e) {
    console.log(e);
    var OId = e.currentTarget.dataset['oid'];
    wx.navigateTo({
      url: '/pages/discountlog/detail/detail?OId='+ OId,
    })
  },2000),

})