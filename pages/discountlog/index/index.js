const order = require("../../../utils/home/order.js");

Page({

  data: {
  
  },

  onLoad: function (options) {
    order.myUsedRecord().then((res)=>{
      console.log(res);
    });
  },

})