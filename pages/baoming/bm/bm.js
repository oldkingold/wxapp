const app = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const meet = require('../../../utils/home/meeting.js');

Page({
  data: {
    meeting: [],
    id: 0,
    method: 'method',
    com: 'com',
    compName: "",
    compNature: "民营",
    meetPersonlist: [],
    singleRoomNum: 0,
    doubleRoomNum: 0,
    isNotNeedRoom: true,
    arriveDateHolder: "请选择到达时间",
    isArriveDateHolder: false,
    arriveDate: "",
    leaveDateHolder: "请选择离开时间",
    isLeaveDateHolder: false,
    leaveDate: '',

    invCompNamechange: false,
    invoice: {
      invType: "暂不填写",
      invCompName: "",
      taxIdNum: "",
      compAddr: "",
      compTel: "",
      compBank: "",
      compBankAccount: "",
    },

    note: "",
    usedChart: 0,
    selfCompanies: {},
    showCompanys: true,//是否显示公司提示
    showmodel: true,//弹出框是否现实
    showmodeldata: {
      name: '',
      duty: '',
      phone: '',
    }
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    let that = this;
    this.getTopic();
    this.data.id = parseInt(options.id);
    
    let meeting = meet.meetingDetail(this.data.id);
    console.log(meeting);
    that.setData({
      meeting: meeting,
      arriveDate: meeting.end_show,
      leaveDate: meeting.end_date
    });

    //页面从哪跳转过来的
    if (options.method) {
      this.data.method = options.method;
    }

    //存入公司信息
    this.setData({
      selfCompanies: wx.getStorageSync('selfCompanies')
    });
    console.log(this.data.selfCompanies);

    //获取之前的报名信息并存入
    let keyid = that.data.id + 'bm';
    if (this.data.method == "restart" || this.data.method == "change") {
      keyid = 'changebmdata';
    }

    try {
      let value = wx.getStorageSync(keyid)
      if (value) {
        // Do something with return value
        that.setData({
          id: value.id,
          com: value.com,
          compName: value.compName,
          compNature: value.compNature,
          meetPersonlist: value.meetPersonlist,
          singleRoomNum: value.singleRoomNum,
          doubleRoomNum: value.doubleRoomNum,
          isNotNeedRoom: value.isNotNeedRoom,
          invoice: value.invoice,
          note: value.note,
          usedChart: value.usedChart,
          // Contact: value.Contact,
        });
        if (that.data.invoice['invCompName'] == "") {
          that.data.invoice['invCompName'] = that.data.compName;
        }
      }
    } catch (e) {
      // Do something when catch error
      console.log("bm 数据获取失败" + e);
    }
  },
  
  onShow: function () {
    console.log(this.data);
    let that = this;
    let meetPersonlist = that.data.meetPersonlist;

    wx.getStorage({
      key: 'meetPersonListSelected',
      success: function (res) {
        console.log(res)
        let varSelected = res.data;
        if (varSelected.list.length > 0) { 
          wx.removeStorage({
            key: 'meetPersonListSelected'
          })
          that.setData({
            meetPersonlist: varSelected.list,
          })
        }

      },
      fail: function () {
        console.log("meetPersonListSelected 数据获取失败");
      }
    });


  },
  onUnload: function () {
    // 页面关闭
    // 在页面离开前做数据的缓存
    if (this.data.method == 'restart' || this.data.method == 'change') {
      wx.removeStorage('changebmdata');
    } else {
      var keyid = this.data.id + 'bm';
      var compName = this.data;
      try {
        wx.setStorageSync(keyid, compName)
      } catch (e) {
      }
    }

  },

  //输入公司名时展示公司信息
  showCompanys: function () {
    this.setData({
      showCompanys: false,
    });
  },

  hideCompanys: function () {
    this.setData({
      showCompanys: true,
    });
  },

  //选择公司发票信息
  choseCompany: function (e) {
    let index = e.target.dataset['index'];
    let company = this.data.selfCompanies[index];
    let inv = {
      invType: company['tax_type'],
      invCompName: company['name'],
      taxIdNum: company['tax_id'],
      compAddr: company['address'],
      compTel: company['tel'],
      compBank: company['tax_bank'],
      compBankAccount: company['tax_bank_id'],
    };
    this.setData({
      invoice: inv,
      compName: company['name'],
      compNature: company['company_type'],
    });
    console.log(company);
  },
  bindCompNameInput: function (e) {
    this.data.compName = e.detail.value;
    if (!this.data.invCompNamechange) {
      let inv = this.data.invoice;
      inv.invCompName = this.data.compName;
      this.setData({
        invoice: inv
      });
    }
  },
  changeNatureRadio: function (e) {
    this.setData({
      compNature: e.detail.value
    })
  },
  //删除人员
  delMeetPerson: function (e) {
    let that = this;
    let itemIndex = e.target.dataset.itemIndex;
    let meetPersonlist = that.data.meetPersonlist;
    meetPersonlist.splice(itemIndex, 1);
    wx.showModal({
      title: '人员删除确认',
      content: '是否删除？',
      confirmColor: '#007aff',
      cancelColor: '#007aff',
      confirmText: '是',
      cancelText: '否',
      success: function (res) {
        if (res.confirm) {  
          that.setData({
            meetPersonlist: meetPersonlist,
          });
        } else if (res.cancel) {

        }
      }
    })

  },

  bindfocus_singleRoomNum: function (e) {
    this.setData({
      singleRoomNum: '',
    });
  },

  bindblur_singleRoomNum: function (e) {
    let num = parseInt(e.detail.value.substring(0, 3));
    if (isNaN(num)) num = 0;
    this.setData({
      singleRoomNum: num,
    });
    this.clearIsNotNeedRoom();
  },

  bindfocus_doubleRoomNum: function (e) {
    this.setData({
      doubleRoomNum: '',
    });
  },

  bindblur_doubleRoomNum: function (e) {
    let num = parseInt(e.detail.value.substring(0, 3));
    if (isNaN(num)) num = 0;
    this.setData({
      doubleRoomNum: num,
    });
    this.clearIsNotNeedRoom();
  },

  //单间 减
  cutSingleNumber: function () {
    this.setData({
      singleRoomNum: (this.data.singleRoomNum - 1 >= 1) ? this.data.singleRoomNum - 1 : 0,
    });
    this.clearIsNotNeedRoom();
  },
  //单间 加
  addSingleNumber: function () {
    this.setData({
      singleRoomNum: Number(this.data.singleRoomNum) + 1,
    });
    this.clearIsNotNeedRoom();
  },
  //标间 加
  cutDoubleNumber: function () {
    this.setData({
      doubleRoomNum: (this.data.doubleRoomNum - 1 >= 1) ? this.data.doubleRoomNum - 1 : 0,
    });
    this.clearIsNotNeedRoom();
  },
  //标间 加
  addDoubleNumber: function () {
    this.setData({
      doubleRoomNum: Number(this.data.doubleRoomNum) + 1,
    });
    this.clearIsNotNeedRoom();
  },

  BindIsNotNeedRoom: function () {
    let that = this;
    if (!that.data.isNotNeedRoom) {
      that.setData({
        isNotNeedRoom: true,
        singleRoomNum: 0,
        doubleRoomNum: 0,
      })
    }
  },

  clearIsNotNeedRoom() {
    let that = this;
    if (that.data.singleRoomNum + that.data.doubleRoomNum > 0)
      that.setData({
        isNotNeedRoom: false
      });
    if (that.data.singleRoomNum + that.data.doubleRoomNum == 0) {
      that.setData({
        isNotNeedRoom: true
      });
    }
  },

  //到达日期修改
  arriveDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      arriveDate: e.detail.value,
      isArriveDateHolder: false
    });
  },
  //离开日期修改
  leaveDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      leaveDate: e.detail.value,
      isLeaveDateHolder: false
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

  //意见与建议
  valueChange: function (e) {
    let that = this;
    that.setData({
      note: e.detail.value,
      usedChart: e.detail.value.length
    });
  },

  //跳转人员添加页面
  addMemtPersonUrl: function () {
    let that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          let varmeetPersonlist = that.data.meetPersonlist;
          let detail = [];
          for (var i = 0; i < varmeetPersonlist.length; i++) {
            let varmeetPerson = varmeetPersonlist[i];
            varmeetPerson["checked"] = "true";
            detail.push(varmeetPerson);
          }
          wx.setStorage({
            key: 'meetPersonListBefore',
            data: detail,
            success: function (res) {
              wx.navigateTo({
                url: '/pages/baoming/bmAddPerson/bmAddPerson',
                success: function (res) {
                  console.log("数据存储成功")
                },
              })
            }
          })
        } else {
          that.setData({
            showmodel: false
          });
        }
      }
    })
  },

  closeshow: function () {
    this.setData({
      showmodel: true
    });
  },

  showmodelname: function (e) {
    let smd = this.data.showmodeldata;
    smd['name'] = e.detail.value;
    this.setData({
      showmodeldata: smd
    });
  },
  
  showmodelduty: function (e) {
    let smd = this.data.showmodeldata;
    smd['duty'] = e.detail.value;
    this.setData({
      showmodeldata: smd
    });
  },

  showmodelphone: function (e) {
    let smd = this.data.showmodeldata;
    smd['phone'] = e.detail.value;
    this.setData({
      showmodeldata: smd
    });
  },

  showbtn: function () {
    let meetPersonlist = this.data.meetPersonlist;
    let smd = this.data.showmodeldata;
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (smd['name'].length < 2) {
      wx.showToast({
        title: '请填入正确的姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (smd['duty'].length < 2) {
      wx.showToast({
        title: '请填入正确的职务',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!mobile.exec(smd['phone'])) {
      wx.showToast({
        title: '请填入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    meetPersonlist.unshift(this.data.showmodeldata);
    this.setData({
      meetPersonlist: meetPersonlist,
      showmodel: true,
      showmodeldata: {
        name: '',
        duty: '',
        phone: '',
      }
    });
  },

  getTopic: function () {
    wx.setNavigationBarTitle({
      title: '报名表'
    })
  },
  invCompName: function (e) {
    let inv = this.data.invoice;
    inv.invCompName = e.detail.value;
    this.setData({
      invoice: inv
    });
    if (!this.data.invCompNamechange) {
      this.data.invCompNamechange = !this.data.invCompNamechange;
    }
  },
  taxIdNum: function (e) {
    let inv = this.data.invoice;
    inv.taxIdNum = e.detail.value;
    this.setData({
      invoice: inv
    });
  },
  compAddr: function (e) {
    let inv = this.data.invoice;
    inv.compAddr = e.detail.value;
    this.setData({
      invoice: inv
    });
  },
  taxIdNum: function (e) {
    let inv = this.data.invoice;
    inv.taxIdNum = e.detail.value;
    this.setData({
      invoice: inv
    });
  },
  compTel: function (e) {
    let inv = this.data.invoice;
    inv.compTel = e.detail.value;
    this.setData({
      invoice: inv
    });
  },
  compBank: function (e) {
    let inv = this.data.invoice;
    inv.compBank = e.detail.value;
    this.setData({
      invoice: inv
    });
  },
  compBankAccount: function (e) {
    let inv = this.data.invoice;
    inv.compBankAccount = e.detail.value;
    this.setData({
      invoice: inv
    });
  },

  bmReset: function (e) {
    let that = this;
    that.setData({
      compName: "",
      compNature: "民营",
      meetPersonlist: [],
      singleRoomNum: 0,
      doubleRoomNum: 0,
      isNotNeedRoom: true,
      isArriveDateHolder: false,
      isLeaveDateHolder: false,
      invCompNamechange: false,
      invoice: {
        invType: "暂不填写",
        invCompName: "",
        taxIdNum: "",
        compAddr: "",
        compTel: "",
        compBank: "",
        compBankAccount: "",
      },
      note: "",
      usedChart: 0,
    });
    wx.showToast({
      title: '重置成功',
      icon: 'success',
      duration: 2000
    })

  },

  bmSubbmit: function (e) {

    // 提交报名表
    let that = this;

    if (that.data.compName.length < 1) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none',
        duration: 3000,
      });
      return false;
    }

    if (that.data.meetPersonlist.length < 1) {
      wx.showToast({
        title: '请添加参会人员',
        icon: 'none',
        duration: 3000,
      });
      return false;
    }

    if (that.data.leaveDate.length < 1) {
      wx.showToast({
        title: '请填写到达时间',
        icon: 'none',
        duration: 3000,
      });
      return false;
    }

    if (that.data.leaveDate.length < 1) {
      wx.showToast({
        title: '请填写离开时间',
        icon: 'none',
        duration: 3000,
      });
      return false;
    }

    if (that.data.invoice.invType == '普票') {
      if (that.data.invoice.invCompName.length < 1 || that.data.invoice.taxIdNum.length < 1) {
        wx.showModal({
          title: '错误信息',
          content: '请输入发票的公司名称||纳税识别号',
          showCancel: false
        });
        return false;
      }
    }

    if (that.data.invoice.invType == '专票') {
      if (that.data.invoice.invCompName.length < 1 || that.data.invoice.taxIdNum.length < 1
        || that.data.invoice.compAddr.length < 1 || that.data.invoice.compTel.length < 1
        || that.data.invoice.compBank.length < 1 || that.data.invoice.compBankAccount.length < 1) {
        wx.showModal({
          title: '错误信息',
          content: '请输入发票的公司名称||纳税识别号||公司地址||电话号码||开户银行||银行账号',
          showCancel: false
        });
        return false;
      }
    }
    // app.globalData.token
    wx.request({
      url: api.ApiRootUrl + 'wxapp/wxbm',
      data: {
        meetingId: that.data.id,
        compName: that.data.compName,
        compNature: that.data.compNature,
        meetPersonlist: that.data.meetPersonlist,
        singleRoomNum: that.data.singleRoomNum,
        doubleRoomNum: that.data.doubleRoomNum,
        isNotNeedRoom: that.data.isNotNeedRoom,
        arriveDate: that.data.arriveDate,
        leaveDate: that.data.leaveDate,
        invoice: that.data.invoice,
        note: that.data.note,
        token: app.globalData.token,
        openID: app.globalData.openId,
        bmtype: that.data.method,
        com: that.data.com,
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          let receipt = {
            meeting: that.data.meeting,
            invoice: that.data.invoice,
            companyName: that.data.compName,
            meetdate: { start_date: that.data.arriveDate, end_date: that.data.leaveDate }
          }
          wx.setStorageSync('receipt', receipt);
          wx.navigateTo({
            url: '/pages/baoming/receipt/receipt?method=' + that.data.method + "&usertype=" + res.data.usertype,
          })
        }
      },
      fail: function (err) {
        console.log("failed" + err);
      }
    });
  },

  phoneCall: function (e) {
    let tel = e.detail.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})



"XSRF-TOKEN=eyJpdiI6IldrRjJMUzd4Rk01cGRNWnBXVUVORFE9PSIsInZhbHVlIjoibTBQRUpZWmNVZjJObzM3U2xkNHNzc1dibDNyWWczYXZKNWJoKzlIWHlwSmFDeHFlWm9wNEZXN2hDSXhmTmZaRlQzWXdQZEc4STlXYnhFMTZDdVlzRlE9PSIsIm1hYyI6IjM1ZGMwM2ExNjAzYTE4ZTQ4ZDFjZjAzMTE1NmZjNGRlMmU4NmFkYzQ3MDJiZjUyNDA4YTE4NjE5NzkzZDZjMjEifQ%3D%3D; expires=Tue, 30-Oct-2018 03:25:30 GMT; Max-Age=7200; path=/,laravel_session=eyJpdiI6IlRwOG9NNXgwMHM3QkZOdlhnUGs5anc9PSIsInZhbHVlIjoiYkpsYUIwOFduVXJ3ZWJQUjdrZURQK21SNUxmTTZXQlZkeWNNNlJ1TWw5b2FEUGtjXC81V1ZQeVlMMDhaT1VoMzZcL29CWEJ6d2pmN0lMMGQ4K2RPaDJ3UT09IiwibWFjIjoiZTE5YTk1NzQwZDJlYThhYzQzMjExYmFiZDhkZDE5MmQ2NmUyYWMyNmRmMDYwZjY1M2ZjOWQ4YzRiOTYzOTA5YiJ9; expires=Tue, 30-Oct-2018 09:25:30 GMT; Max-Age=28800; path=/; httponly"