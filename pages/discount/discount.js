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
    discountprice: 0,  //需支付费用
    balance: 0,   //余额
    vip1:[
      {"name": "注册用户", "icon": "", "bg": ""},
      {"name": "普通用户", "icon": "", "bg": ""},
      { "name": "普通会员", "icon": "common.png", "bg": "common_bg.png" },
      { "name": "银牌会员", "icon": "silver.png", "bg": "silver_bg.png" },
      { "name": "金牌会员", "icon": "gold.png", "bg": "gold_bg.png" },
    ],
    select_vip_type: 2, //当前选中的会员

  },

  onLoad: function () {
    let that = this;
    that.onShow();
  },

  onShow: function () {
    let that = this;
    
    // util.loginState().then((res)=>{
    //   console.log("---------------"+res)
    // })

    order.myVip1Type().then((res) => {
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

    let company_setting = wx.getStorageSync('company_setting');
    if (company_setting) {
      that.setData({
        company: company_setting["name"]
      });
      order.myVip1Info().then((res) => {
        if (res.data.code == 200) {
          var data = JSON.parse(decodeURIComponent(decode.base64_decode(res.data.data)));
          var vip_type = 1;
          for(let i = 0; i < 5; i++) {
            if (that.data.vip1[i]["name"] == data.level) {
              vip_type = i;
              break;
            }
          }
          if (vip_type == 0) {
            that.data.select_vip_type = 1;
            that.data.discountprice = 11920;
          }else if (vip_type == 1) {
            that.data.select_vip_type = 2;
            that.data.discountprice = that.data.vip1[2].pay_in_advance;
          } else if (vip_type == 2) {
            that.data.select_vip_type = 3;
            that.data.discountprice = that.data.vip1[3].pay_in_advance - data.remainder;
          } else if (vip_type == 3){
            that.data.select_vip_type = 4;
            that.data.discountprice = that.data.vip1[4].pay_in_advance - data.remainder;
          }else {
            that.data.select_vip_type = 4;
          }
          this.setData({
            vip_type: vip_type,
            select_vip_type: that.data.select_vip_type,
            balance: data.remainder,
            discountprice: that.data.discountprice
          })
        }else {
          that.setData({
            vip_type: 0,
            discountprice: 11920,
            balance : 0,
            select_vip_type: 1,
          });
        }
      });
    } else {

      that.setData({
        vip_type: -1,
        discountprice: 11920,
        balance: 0,
        select_vip_type: 1,
      });
    }
    
  },

  //监听vip选择
  chooseVip: function (e) {
    //需要支付价格
    if (e.detail.value == "1") {
      this.data.discountprice = 11920;
    }else if (this.data.vip_type < 2) {
      this.data.discountprice = this.data.vip1[parseInt(e.detail.value)].pay_in_advance;
    } else if ((this.data.vip_type == 2 && parseInt(e.detail.value) > 2) || (this.data.vip_type == 3 && parseInt(e.detail.value) > 3)) {
      this.data.discountprice = this.data.vip1[parseInt(e.detail.value)].pay_in_advance - this.data.balance;
    } else {
      this.data.discountprice = 0;
    }
    
    this.setData({
      select_vip_type: parseInt(e.detail.value),
      discountprice: this.data.discountprice,
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
    // if ((this.data.vip_type == 2 && this.data.select_vip_type > 2) || (this.data.vip_type == 3 && this.data.select_vip_type > 3)) {
    //   if ((this.data.vip1[this.data.select_vip_type].pay_in_advance - this.data.balance > this.data.vip1[this.data.select_vip_type].recharge_point ? this.data.vip1[this.data.select_vip_type].pay_in_advance - this.data.balance : this.data.vip1[this.data.select_vip_type].recharge_point) < e.detail['value']) {

        
    //     this.setData({
    //       discountprice: e.detail['value']
    //     });
    //   }else {
    //     this.setData({
    //       discountprice: this.data.discountprice
    //     });
    //   }
    // }else {
      this.setData({
        discountprice: e.detail['value']
      });
    // }
    
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
        that.onShow();
        that.submitdata(); //提交购买数据
      });
    } else if (e.detail.userInfo && userInfo) {
      that.submitdata(); //提交购买数据
    } else {
      wx.showModal({
        title: "用户未授权",
        content: '请授权允许微信登录后进行套餐购买',
        showCancel: false,
      })
      return ;
    }
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
      that.showToast('手机号码有误d');
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
    
    if ((this.data.vip_type == 2 && this.data.select_vip_type > 2) || (this.data.vip_type == 3 && this.data.select_vip_type > 3)) {
      if ((this.data.vip1[this.data.select_vip_type].pay_in_advance - this.data.balance > this.data.vip1[this.data.select_vip_type].recharge_point ? this.data.vip1[this.data.select_vip_type].pay_in_advance - this.data.balance : this.data.vip1[this.data.select_vip_type].recharge_point) > this.data.discountprice) {
        that.showToast('充值金额不足');
        return false;
      }
    }
    
    data['company'] = that.data.company;
    data['contact'] = that.data.contact;
    data['contactTel'] = that.data.contactTel;
    data['invoice'] = that.data.invoice;
    data['discountprice'] = that.data.discountprice;
    data['token'] = app.globalData.token;
    data['openID'] = app.globalData.openId;
    data["VipType"] = that.data.vip1[that.data.select_vip_type].name;
    
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


  toSignin: util.throttle(function (e) {
    console.log(e)
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");

    if (e.detail.userInfo && !userInfo) {
      util.wxlogin().then((res) => {
        app.globalData.token = res.token;
        app.globalData.openId = res.openId;
        that.onShow();
        if (!res.companyName) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
        
      });
    } else if (e.detail.userInfo && userInfo) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.showModal({
        title: "用户未授权",
        content: '请授权允许微信登录后进行套餐购买',
        showCancel: false,
      })
      return;
    }
  }, 2000),
  
  vip1Policy: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?website=' + "https://58jz.com.cn/FavouredPolicy",
    })
  }
  // util.throttle(function() {
    // wx.navigateTo({
    //   url: '/pages/login/login',
    // })
  // },2000),

})