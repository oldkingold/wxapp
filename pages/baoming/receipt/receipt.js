var app = getApp();
// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// var storage = require('../../../services/storage.js');

Page({
  data: {
    meeting: {},
    mealList: '',
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
    companyName: ''
  },

  onLoad: function (options) {
    // this.getTopic();
    console.log(options);
    let that = this;
    that.data.method = options.method;
    that.data.usertype = options.usertype;
    let receipt = storage.getstorage('receipt', {});
    storage.remove('receipt');

    let meals = receipt['meals'];
    let mealstr = '';
    for (let date in meals) {
      for (let type in meals[date]['data']) {
        if (meals[date]['data'][type]['pnum'] != 0) {
          if (type == 'dinner') {
            mealstr += date.substring(3) + "号晚餐, ";
          } else if (type == 'launch') {
            mealstr += date.substring(3) + "号中餐, ";
          }

        }

      }
    }
    console.log(receipt);
    that.setData({
      meeting: receipt['meeting'],
      invoice: receipt['invoice'],
      mealList: mealstr.substring(0, mealstr.length - 2),
      companyName: receipt['companyName'],
      meetdate: receipt['meetdate'],
    });
    if (that.data.usertype != 'typeuser') {
      let content = {
        newolduser: {
          'cnt': "系统检测到你是度川老用户，注册公司账号可管理报名信息。",
          'cbtn': '去注册',
        }, olduser: {
          'cnt': "系统检测到你是度川老用户，请绑定公司账号管理公司报名信息。",
          'cbtn': "去绑定",
        }, newuser: {
          'cnt': "系统检测到你是度川新用户，请注册公司账号管理公司报名信息。",
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
                      url: '../../ucenter/login/login?compName=' + that.data.companyName,
                    })
                  } else if (that.data.usertype == 'newolduser') {
                    wx.navigateTo({
                      url: '../../ucenter/sign/sign?compName=' + that.data.companyName,
                    })
                  } else if (that.data.usertype == 'newuser') {
                    wx.navigateTo({
                      url: '../../ucenter/sign/sign?compName=' + that.data.companyName,
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
  onShow: function () {


  },
  onUnload: function () {
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
        url: "../../index/index",
      })
    }

  }
  // getTopic: function () {
  //   wx.setNavigationBarTitle({
  //     title: '报名表'
  //   })
  // },

})  