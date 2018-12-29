const api = require('../../../config/api.js');
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
    usertype: "",
    companyName: '',
    companyCard:{},
    adverShow: true,
    adverRedio: false,
    toMore: false,
  },

  onLoad: function (options) {
    console.log(options);
    let that = this;
    that.data.method = options.method;
    that.data.usertype = options.usertype;
    let receipt = wx.getStorageSync('receipt', {});
    // wx.removeStorageSync('receipt');
    if (receipt['meeting'].hotel) {
      receipt['meeting'].hotel.jwd = receipt['meeting'].hotel.jwd.split(",");
    }
    
    console.log(receipt);
    that.setData({
      meeting: receipt['meeting'],
      invoice: receipt['invoice'],
      companyName: receipt['companyName'],
      meetdate: receipt['meetdate'],
      companyCard: receipt['companyCard']
    });

    if (receipt['companyCard']['status'] == 0 
      || (receipt['companyCard']['status'] == 1 && receipt['companyCard']['remainder'] < receipt['companyCard']['using'])) {
      let adverShow = wx.getStorageSync("adverShow");
      if (adverShow) {
        this.setData({
          adverShow: adverShow
        });
      } else {
        this.setData({
          adverShow: false
        });
      }
    }

    if (that.data.usertype != 'typeuser' && that.data.adverShow) {
      let content = {
        newolduser: {
          'cnt': "系统检测到您是度川老用户，注册公司账号可管理报名信息。",
          'cbtn': '去注册',
        }, olduser: {
          'cnt': "系统检测到您是度川老用户，请绑定公司账号管理公司报名信息。",
          'cbtn': "去绑定",
        }, newuser: {
          'cnt': "系统检测到您是度川新用户，请注册公司账号管理公司报名信息。",
          'cbtn': "去注册",
        }
      };

      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            wx.showModal({
              content: content[that.data.usertype]['cnt'],
              confirmText: content[that.data.usertype]['cbtn'],
              // confirmColor: "",
              success: function (e) {
                if (e.confirm) {
                  if (that.data.usertype == 'olduser') {
                    wx.navigateTo({
                      url: '/pages/login/login?compName=' + that.data.companyName,
                    })
                  } else if (that.data.usertype == 'newolduser') {
                    wx.navigateTo({
                      url: '/pages/sign/sign?compName=' + that.data.companyName,
                    })
                  } else if (that.data.usertype == 'newuser') {
                    wx.navigateTo({
                      url: '/pages/sign/sign?compName=' + that.data.companyName,
                    })
                  }
                }
              }
            })
          }
        }
      });

    }

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
      url: '/pages/discount/discount',
    })
  },

  cancel: function () {
    this.setData({
      adverShow:true,
    });
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
  }

})  