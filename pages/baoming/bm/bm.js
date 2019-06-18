const app = getApp();
const util = require('../../../utils/util.js');
const decode = require('../../../utils/decode.js');
const api = require('../../../config/api.js');
const meet = require('../../../utils/home/meeting.js');
const order = require("../../../utils/home/order.js");

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
    },
    // cardInfo:false

    // Vip1
    bm_num: 0, //报名人数
    Vip1_info:{},
    Vip1_tab: {
      img: "",
      level_name: "",
      level_id: "",
      level_price: 0,
      ye_btn: 3,
      zz_btn: true,
      qt_btn: false,
      ye_tip: "",
      ye_cz_show: ""
    } ,
    // Vip1
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    let that = this;
    this.getTopic();
    this.data.id = parseInt(options.id);
    
    let meeting = meet.meetingDetail(this.data.id);
    
    that.setData({
      meeting: meeting,
      arriveDate: meeting.end_show,
      leaveDate: meeting.end_date
    });
    
    // order.CardInfo().then((res) => {
    //   if (res) {
    //     that.setData({
    //       cardInfo: res,
    //     });
    //   }
    // });

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
          bm_num: value.bm_num
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
            bm_num: varSelected.list.length > that.data.bm_num ? varSelected.list.length : that.data.bm_num,
          })
        }

      },
      fail: function () {
        console.log("meetPersonListSelected 数据获取失败");
      }
    });

    //vip1模块处理
    order.myVip1Info().then((res) => {
      if (res.data.code == 200) {
        var data = JSON.parse(decodeURIComponent(decode.base64_decode(res.data.data)));
        this.setData({
          Vip1_tab: Vip1(this.data.bm_num, this.data.meeting, data, this.data.Vip1_tab),
          Vip1_info: data
        })
        if (this.data.Vip1_tab.ye_btn == 1) {
          this.data.invoice.invType = "不开票";
          this.setData({
            invoice: this.data.invoice
          })
        }
      }else {
        that.data.Vip1_tab.level_price = that.data.meeting.price;
        this.setData({
          Vip1_tab: that.data.Vip1_tab
        })
      }
    });
  },

  onUnload: function () {
    // 页面关闭
    // 在页面离开前做数据的缓存
    if (this.data.method == 'restart' || this.data.method == 'change') {
      wx.removeStorageSync('changebmdata');
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

  //设置主联系人
  mainContact: function (e) {
    var that = this;
    var itemIndex = e.currentTarget.dataset.itemIndex; 
    var meetPersonlist = that.data.meetPersonlist;  
    
    if (meetPersonlist[itemIndex].main_contact === 0) {
      meetPersonlist[itemIndex]['main_contact'] = 2-1;
    }else {
      meetPersonlist[itemIndex].main_contact = 0;
    }

    let num = 0;
    for(let i = 0;i < meetPersonlist.length; i++) {
      if(meetPersonlist[i].main_contact === 1){
        num++;
      }
    }
    if(num > 3) {
      wx.showToast({
        title: '主联系人最多设置3个人！',
        icon: 'none',
        duration: 2000
      })
      meetPersonlist[itemIndex].main_contact = 0;
    }
    
    this.setData({
      meetPersonlist: meetPersonlist
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
            bm_num: meetPersonlist.length > that.data.bm_num ? meetPersonlist.length : that.data.bm_num,
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
  //标间 减
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
  //报名人数 减
  bm_num_cut: function () {
    var bm_num = this.data.bm_num;
    bm_num = bm_num - 1 >= 0 ? bm_num - 1 : 0;

    this.setData({
      Vip1_tab: Vip1(bm_num, this.data.meeting, this.data.Vip1_info, this.data.Vip1_tab),
      bm_num: bm_num
    })
    if (this.data.Vip1_tab.ye_btn == 1) {
      this.data.invoice.invType = "不开票";
      this.setData({
        invoice: this.data.invoice
      })
    }
  },
  //报名人数 加
  bm_num_add: function () {
    var bm_num = this.data.bm_num;
    bm_num = bm_num + 1;

    this.setData({
      Vip1_tab: Vip1(bm_num, this.data.meeting, this.data.Vip1_info, this.data.Vip1_tab),
      bm_num: bm_num
    })
    if (this.data.Vip1_tab.ye_btn == 1) {
      this.data.invoice.invType = "不开票";
      this.setData({
        invoice: this.data.invoice
      })
    }
  },
  //vip1付款方式
  pay_mode: function (e) {
    console.log(e.currentTarget.dataset.mode)
    var mode = e.currentTarget.dataset.mode;
    if (this.data.Vip1_tab.level_id < 5) {
      return;
    }
    if (mode == "ye") {
      if (this.data.Vip1_tab.ye_btn == 2) {
        this.data.Vip1_tab.ye_btn = 1;
        this.data.Vip1_tab.zz_btn = false;
        this.data.Vip1_tab.qt_btn = false;
        this.data.invoice.invType = "不开票";
      }

    } else if (mode == "zz") {
      if (!this.data.Vip1_tab.zz_btn) {
        if (this.data.Vip1_tab.ye_btn == 1) {
          this.data.Vip1_tab.ye_btn = 2;
        }
        this.data.Vip1_tab.zz_btn = true;
        this.data.Vip1_tab.qt_btn = false;
      }
      
    } else if (mode == "qt") {
      if (!this.data.Vip1_tab.qt_btn) {
        if (this.data.Vip1_tab.ye_btn == 1) {
          this.data.Vip1_tab.ye_btn = 2;
        }
        this.data.Vip1_tab.zz_btn = false;
        this.data.Vip1_tab.qt_btn = true;
      }
    }

    
    this.setData({
      Vip1_tab: this.data.Vip1_tab,
      invoice: this.data.invoice
    })
  },

  //购买vip1
  to_buy_Vip1: function () {
    wx.switchTab({
      url: '/pages/discount/discount',
    })
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
    if (this.data.Vip1_tab.ye_btn != 1) {
      let invoice = that.data.invoice;
      invoice.invType = e.detail.value;
      that.setData({
        invoice: invoice
      })
    }
    
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
  addMemtPersonUrl: util.throttle(function () {
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
  }, 2000),

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

  bmReset: util.throttle(function (e) {  
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
      bm_num: 0,
    });
    order.myVip1Info().then((res) => {

      var data = JSON.parse(decodeURIComponent(decode.base64_decode(res.data)));
      this.setData({
        Vip1_tab: Vip1(this.data.bm_num, this.data.meeting, data, this.data.Vip1_tab),
        Vip1_info: data
      })
      if (this.data.Vip1_tab.ye_btn == 1) {
        this.data.invoice.invType = "不开票";
        this.setData({
          invoice: this.data.invoice
        })
      }
    });
    wx.showToast({
      title: '重置成功',
      icon: 'success',
      duration: 2000
    })

  }, 2000),

  bmSubbmit: util.throttle(function (e) {
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
    wx.showLoading({
      mask: true
    });
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
        bm_num: that.data.bm_num,
        pay_mode: pay_mode(that.data.Vip1_tab)
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          let receipt = {
            // companyCard: res.data.companyCard,
            meeting: that.data.meeting,
            invoice: that.data.invoice,
            companyName: that.data.compName,
            meetdate: { start_date: that.data.arriveDate, end_date: that.data.leaveDate },
            pay: res.data.pay ? res.data.pay : { "used" : that.data.bm_num * that.data.Vip1_tab.level_price}
          }
          wx.setStorageSync('receipt', receipt);
          wx.navigateTo({
            url: '/pages/baoming/receipt/receipt?method=' + that.data.method + "&pay_mode=" + pay_mode(that.data.Vip1_tab),
          })
        } else if (res.data.code == 400){
          wx.showToast({
            title: '请选择转账或其他支付，或请联系客服',
            icon: 'none',
            duration: 3000,
          });
          that.onShow();
        }
        
      },
      fail: function (err) {
        console.log("failed" + err);
      }
    });
  }, 2000),

  phoneCall: function (e) {
    let tel = e.detail.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }

})

//vip模块控制 
function Vip1(bm_num, meeting, vip1_info, Vip1_tab) {
  var icons = {
    6: "common",
    7: "silver",
    8: "gold",
  };

  Vip1_tab.level_name = vip1_info['level']
  Vip1_tab.level_id = vip1_info['id']

  for (let i = 0; i < meeting["vip1"].length; i++) {
    if (meeting["vip1"][i]["level"] == vip1_info['id']) {
      Vip1_tab.level_price = meeting["vip1"][i]["price"];
    }
  }

  if (vip1_info['id'] > 5) {
    Vip1_tab.img = icons[vip1_info['id']];
    if (vip1_info["remainder"] > bm_num * Vip1_tab.level_price) {
      Vip1_tab.ye_btn = 1;  
      Vip1_tab.zz_btn = false;
      Vip1_tab.qt_btn = false;
      Vip1_tab.ye_tip = "剩余¥" + vip1_info["remainder"];
      Vip1_tab.ye_cz_show = true;
      
    } else {
      Vip1_tab.ye_btn = 3;  //不能点击
      if (!Vip1_tab.qt_btn) {
        Vip1_tab.zz_btn = false;
        Vip1_tab.qt_btn = true;
      }
      Vip1_tab.ye_tip = "剩余¥" + vip1_info["remainder"] + ",余额不足,";
      Vip1_tab.ye_cz_show = false;
    }
  } else {
    Vip1_tab.ye_btn = 3;  //不能点击
    if (!Vip1_tab.qt_btn) {
      Vip1_tab.zz_btn = true;
      Vip1_tab.qt_btn = false;
    }
    Vip1_tab.ye_tip = "余额不足";
    Vip1_tab.ye_cz_show = false;
  }

  return Vip1_tab;
}
//上传支付方式
function pay_mode(vip_tab) {
  
  if (vip_tab.ye_btn == 1) {
    return "ye";
  }

  if (vip_tab.qt_btn == true) {
    return "qt";
  }

  return "zz";
}