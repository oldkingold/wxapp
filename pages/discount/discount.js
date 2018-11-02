// pages/discount/discount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice: {
      invType: "暂不填写",
      invCompName: "",
      taxIdNum: "",
      compAddr: "",
      compTel: "",
      compBank: "",
      compBankAccount: "",
    },
    five_num: 1,
    ten_num: 1,
    total_num: 15,
    gift_num: 0,
    originalprice: 44700,
    discountprice: 32780
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  //切换发票信息
  listenerRadioGroup: function (e) {
    let that = this;
    let invoice = that.data.invoice;
    invoice.invType = e.detail.value;
    that.setData({
      invoice: invoice
    })
  },

  taocan_five: function (e) {
    let that = this;
    let five_num = this.data.five_num;
    let operator = e.currentTarget.dataset['operator'];
    switch (operator) {
      case "-": 
        five_num = five_num - 1 > 0 ? five_num - 1 : 0; 
        break;
      case "+": 
        five_num = five_num + 1;
        break;
      default: ;
    }
    this.data.five_num = five_num;
    this.change();
  },

  taocan_ten: function (e) {
    let ten_num = this.data.ten_num;
    let operator = e.currentTarget.dataset['operator'];
    switch (operator) {
      case "-":
        ten_num = ten_num - 1 > 0 ? ten_num - 1 : 0;
        break;
      case "+":
        ten_num = ten_num + 1;
        break;
      default: ;
    }
    this.data.ten_num = ten_num;
    this.change();
  },

  change: function() {
    let five_num = this.data.five_num;
    let ten_num = this.data.ten_num;
    
    this.setData({
      five_num: five_num,
      ten_num: ten_num,

    });
  }

})