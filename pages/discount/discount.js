const api = require('../../config/api.js');
const app = getApp();
const order = require("../../utils/home/order.js");

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
    discountprice: 32780,
    company: '',
    contact: '',
    contactTel: '',
    cardInfo: {usable: 0, remain: 0, using: 0, total: 0},
    isSignin: false,
    isSubmit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function () {
    let that = this;
    that.data.isSubmit = false;
    let company_setting = wx.getStorageSync('company_setting');
    if (company_setting) {
      if (app.globalData.token) {
        order.CardInfo().then((res)=>{
          that.setData({
              cardInfo: res,
              isSignin: true
            });
        });
        // let data = {};
        // data['token'] = app.globalData.token;
        // data['openID'] = app.globalData.openId;

        // wx.request({
        //   url: api.CardInfo,
        //   method: "POST",
        //   data: data,
        //   success: function (res) {
        //     console.log(res.data);
        //     that.setData({
        //       cardInfo: res.data,
        //       isSignin: true
        //     });
        //   }
        // })
      } else {
        that.setData({
          isSignin: false
        });
      }
    } else {
      that.setData({
        isSignin: false
      });
    }
    
    
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

  //添加五人套餐
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
  //添加十人套餐
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
    let gift_num = 0;
    switch (ten_num) {
      case 0: break;
      case 1: break;
      case 2: gift_num = 1; break;
      case 3: gift_num = 3; break;
      case 4: gift_num = 6; break;
      default: gift_num = (ten_num - 3) * 5; break;
    }
    this.setData({
      five_num: five_num,
      ten_num: ten_num,
      gift_num: gift_num,
      total_num: five_num * 5 + ten_num * 10,
      discountprice: five_num * 11920 + ten_num * 20860,
      originalprice: (five_num * 5 + ten_num * 10) * 2980
    });
  },

  bindCompany: function(e) {
    this.setData({
      company: e.detail['value']
    });
  },

  bindContact: function(e) {
    this.setData({
      contact: e.detail['value']
    });
  },

  bindContactTel: function(e) {
    this.setData({
      contactTel: e.detail['value']
    });
  },

  invCompName: function(e) {
    let invoice = this.data.invoice;
    invoice['invCompName'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  taxIdNum: function(e) {
    let invoice = this.data.invoice;
    invoice['taxIdNum'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  compAddr: function(e) {
    let invoice = this.data.invoice;
    invoice['compAddr'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  compTel: function(e) {
    let invoice = this.data.invoice;
    invoice['compTel'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  compBank: function(e) {
    let invoice = this.data.invoice;
    invoice['compBank'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  compBankAccount: function(e) {
    let invoice = this.data.invoice;
    invoice['compBankAccount'] = e.detail['value'];
    this.setData({
      invoice: invoice
    });
  },

  showToast: function(str) {
    wx.showToast({
      title: str,
      icon: 'none',
      duration: 3000,
    });
  },

  submit: function() {
    
    var that = this;
    if (that.data.isSubmit) {
      return;
    }
    that.data.isSubmit = true;
    
    var data = {};

    //验证
    if (that.data.company.length < 1) {
      that.showToast('请输入公司名称');
      return false;
    }

    if (that.data.contact.length < 1) {
      that.showToast('请输入联系人');
      return false;
    }

    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!mobile.exec(that.data.contactTel)) {
      that.showToast('手机号码有误');
      return false;
    }

    if (that.data.invoice['invType'] == "普票") {
      if (that.data.invoice.invCompName.length < 1 || that.data.invoice.taxIdNum.length < 1) {
        that.showToast('请输入发票的公司名称||纳税识别号');
        return false;
      }
    } else if (that.data.invoice['invType'] == "普票") {
      if (that.data.invoice.invCompName.length < 1 || that.data.invoice.taxIdNum.length < 1
        || that.data.invoice.compAddr.length < 1 || that.data.invoice.compTel.length < 1
        || that.data.invoice.compBank.length < 1 || that.data.invoice.compBankAccount.length < 1) {
          that.showToast('请输入发票的公司名称||纳税识别号||公司地址||电话号码||开户银行||银行账号');
          return false;
        }
    }

    data['ten_num'] = that.data.ten_num;
    data['five_num'] = that.data.five_num;
    data['company'] = that.data.company;
    data['contact'] = that.data.contact;
    data['contactTel'] = that.data.contactTel;
    data['invoice'] = that.data.invoice;
    if (app.globalData.token) {
      data['token'] = app.globalData.token;
      data['openID'] = app.globalData.openId;
    }
    
    wx.request({
      url: api.buyCard,
      data: data,
      method: "POST",
      success: function() {
        
      },
      fail: function() {
        
      }
    })
  },

  toDiscountlog: function() {
    if (this.data.isSignin) {
      wx.navigateTo({
        url: '/pages/discountlog/index/index',
      })
    }
  },

  toSignin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }

})