const order = require("../../../utils/home/order.js");

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

})