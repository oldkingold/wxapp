const api = require('../../config/api.js');
const app = getApp();
const order = require("../../utils/home/order.js");
const util = require('../../utils/util.js');
const decode = require('../../utils/decode.js');

Page({

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
    company: '',
    contact: '',
    contactTel: '',

    
    isSignin: false,
    company_setting: false,

    vip_type: 0,  //当前用户等级
    discountprice: 32780,  //需支付费用
    balance: 0,   //余额
    vip1:[
      {"name": "注册用户", "icon": "", "bg": ""},
      {"name": "普通用户", "icon": "", "bg": ""},
      { "name": "普通会员", "icon": "common.png", "bg": "common_bg.png" },
      { "name": "银牌会员", "icon": "silver.png", "bg": "silver_bg.png" },
      { "name": "金牌会员", "icon": "gold.png", "bg": "gold_bg.png" },
    ]

  },

  onLoad: function () {
    let that = this;
    order.myVip1Type().then((res)=>{
      console.log(res.data)
      for (let i = 1; i < 5; i++) {
        for (let j = 0; j < res.data.length; j++) {
          if (that.data.vip1[i]["name"] == res.data[j].level) {
            that.data.vip1[i]["pay_in_advance"] = res.data[j].pay_in_advance;
            that.data.vip1[i]["recharge_point"] = res.data[j].recharge_point;
            break;
          }
        }
        
      }

      that.setData({
        vip1: that.data.vip1,
      });
    });
  },

  onShow: function () {
    let that = this;
    let company_setting = wx.getStorageSync('company_setting');
    if (company_setting) {
      order.myVip1Info().then((res) => {
        if (res.data.code == 200) {
          var data = JSON.parse(decodeURIComponent(decode.base64_decode(res.data.data)));
          var vip_type = 1;
          for(let i = 1; i < 5; i++) {
            if (that.data.vip1[i]["name"] == data.level) {
              vip_type = i;
              break;
            }
          }
          this.setData({
            vip_type: vip_type,
            balance: data.remainder
          })
        }else {
          that.setData({
            vip_type: 0
          });
        }
      });
    } else {
      
    }
    
  },
  //监听vip选择
  chooseVip: function (e) {
    console.log(e);
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

  submit: util.throttle(function(e) {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");

    if (e.detail.userInfo && !userInfo) {
      util.wxlogin().then((res) => {
        app.globalData.token = res.token;
        app.globalData.openId = res.openId;
        that.submitdata();
      });
    } else if (e.detail.userInfo && userInfo) {
      //
      that.submitdata();
    } else {
      wx.showModal({
        title: "用户未授权",
        content: '请授权允许微信登录后进行套餐购买',
        showCancel: false,
      })
      return ;
    }
    // wx.navigateTo({
    //   url: '/pages/discountreceipt/discountreceipt',
    // })
    // return ;
    
  },2000),

  submitdata: function() {

    let that = this;
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
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/discountreceipt/discountreceipt?discountprice=' + that.data.discountprice,
          })
        }

      },
      fail: function () {

      }
    })
  },

  toDiscountlog: util.throttle(function() {
    if (this.data.isSignin) {
      wx.navigateTo({
        url: '/pages/discountlog/index/index',
      })
    }
  }, 2000),

  toSignin: util.throttle(function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },2000),

})