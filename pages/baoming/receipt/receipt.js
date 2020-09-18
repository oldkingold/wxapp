const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');
Page({
  data: {
    rooturl: api.ApiRootUrl,
    meeting: {},
    invoice: {
      invType: "暂不填写",
      invCompName: "",
      taxIdNum: "",
      compAddr: "",
      compTel: "",
      compBank: "",
      compBankAccount: "",
    },
    Contact: {
      Tel: "0571-89809186",
      fax: "0571-89809186",
      url: "www.58jz.com.cn",
      email: "12@58jz.com.cn",
      addr: "杭州市西湖区紫萱路158号西城博司4幢8楼",
      postCode: "310013",
    },
    method: "method",
    companyName: '',
    adverShow: false,
    adverRedio: false,
    toMore: false,
    pay_mode: "",
    pay: {}
  },

  onLoad: function (options) {
    console.log(options);
    let that = this;
    that.data.method = options.method;
    let receipt = wx.getStorageSync('receipt', {});
    // wx.removeStorageSync('receipt');
    if (receipt['meeting'].hotel) {
      receipt['meeting'].hotel.jwd = receipt['meeting'].hotel.jwd.split(",");
    }

    if (options.pay_mode == "ye" || wx.getStorageSync("adverShow")) {
      that.data.adverShow = true
    }

    console.log(receipt);
    that.setData({
      meeting: receipt['meeting'],
      invoice: receipt['invoice'],
      companyName: receipt['companyName'],
      meetdate: receipt['meetdate'],
      pay: receipt['pay'],
      pay_mode: options.pay_mode,
      adverShow: that.data.adverShow,
    });
  },

  onUnload: function () {
    if (!this.data.toMore) {
      if (this.data.method == 'restart' || this.data.method == 'change') {
        let pages = getCurrentPages();//当前页面
        console.log(pages);
        let prevPage = pages[1];//上一页面
        prevPage.setData({//直接给上移页面赋值
          refresh: 'refresh',
        });
        wx.navigateBack({

        })
      } else { 
        wx.switchTab({
          url: "/pages/home/home",
        })
        
      }
    }
  },

  goMap: function (e) {
    let that = this;
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 18,
      name: that.data.meeting.hotel.name + "(" + that.data.meeting.hotel.star + ")",
      address: that.data.meeting.hotel.address
    })
  },

  more: function () {
    this.data.toMore = true;
    wx.switchTab({
      url: '/pages/level/level',
    })
  },

  tipconfirm: function () {
    if (!this.data.adverRedio) {
      wx.setStorageSync("adverShow", true);
      this.setData({
        adverRedio: true,
      });
    }else {
      wx.removeStorageSync("adverShow");
      this.setData({
        adverRedio: false,
      });
    }
  },

  phoneCall: function (e) {
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  //跳转我的订单页
  toOrder: util.throttle(function () {
    wx.navigateTo({
      url: '/pages/order/order?nav=1',
    })
  }, 2000),

})  