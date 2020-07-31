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

    vip_type: -1,  //当前用户等级
    
    balance: 0,   //余额

    

    updateLevelMoney:[],
    need_discountprice: 0,  
    discountprice: 0,  //需支付费用
    select_vip_type: "", //当前选中的会员
  },

  onLoad: function () {
    let that = this;
    that.onShow();

    var pages = getCurrentPages();
    var data = pages[pages.length - 2].data
    var updateLevelMoney = data["card"]["updateLevelMoney"]
    var vip = data["vip"]
    var discountprice = this.data.need_discountprice
    var select_vip_type = this.data.select_vip_type
    if (updateLevelMoney.length > 0) {
      for (let i = 0; i < updateLevelMoney.length; i++) {
        updateLevelMoney[i]["icon"] = vip[updateLevelMoney[i]["level"]]["icon"]
      }
      discountprice = updateLevelMoney[0]["short"]
      select_vip_type = updateLevelMoney[0]["level"]
    }
    that.setData({
      updateLevelMoney: updateLevelMoney,
      need_discountprice: discountprice,
      discountprice: discountprice,
      select_vip_type: select_vip_type
    })
    console.log(data);
  },

  //监听vip选择
  chooseVip: function (e) {
    console.log(e)
    var value = e.detail.value
    var discountprice = this.data.need_discountprice
    var updateLevelMoney = this.data.updateLevelMoney
    var select_vip_type = this.data.select_vip_type
    //需要支付价格
    if (updateLevelMoney.length > 0) {
      for (let i = 0; i < updateLevelMoney.length;i++) {
        console.log(updateLevelMoney[i])
        if (updateLevelMoney[i]["level"] == value) {
          discountprice = updateLevelMoney[i]["short"]
          select_vip_type = updateLevelMoney[i]["level"]
        }
      }
    }else {
      discountprice = 0
    }
    
    this.setData({
      // select_vip_type: parseInt(e.detail.value),
      need_discountprice: discountprice,
      discountprice: discountprice,
      select_vip_type: select_vip_type
    });
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

  //用户信息
  bindMyInput: function(e) {
    var name = e.currentTarget.dataset["name"];
    this.setData({
      [name]: e.detail['value']
    }); 
  },
  //发票信息
  bindInvInput: function(e) {
    this.data.invoice[e.currentTarget.dataset["name"]] = e.detail['value'];
    this.setData({
      invoice: this.data.invoice
    });
  },
  //充值金额
  bindDiscountprice: function(e) {
      this.setData({
        discountprice: e.detail['value']
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
    that.submitdata(); //提交购买数据
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

    if (that.data.discountprice <= 0) {
      that.showToast('请输入充值金额');
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
    
    if (this.data.need_discountprice > this.data.discountprice ) {
      
        that.showToast('充值金额不能达到当前所选等级');
        return false;
      
    }
    
    data['company'] = that.data.company;
    data['contact'] = that.data.contact;
    data['contactTel'] = that.data.contactTel;
    data['invoice'] = that.data.invoice;
    data['discountprice'] = that.data.discountprice;
    data['token'] = app.globalData.token;
    data['openID'] = app.globalData.openId;
    data["VipType"] = that.data.select_vip_type;
    

    console.log(data)
    wx.request({
      url: api.buyVip1,
      data: data,
      method: "POST",
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/discountreceipt/discountreceipt?discountprice=' + that.data.discountprice,
          })
        }
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
  
  vip1Policy: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?website=' + "https://58jz.com.cn/FavouredPolicy",
    })
  }


})