var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    antureCom: [
      {name: '民营',checked: true},
      {name: '国企',checked: false},
    ],
    invoicetypes: [
      {name: '普票',checked: false},
      {name: '专票',checked: true},
    ],
    bmResetSelected: false,
    bmSubbmitSelected: false,
    comName: '',
    // 公司性质
    comType: '民营',
    // 发票类型
    invoicType: '专票',
    invoicEin: '',
    invoicComAddr: '',
    invoicComTel: '',
    invoicOpenBank: '',
    invoicBankAccount: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  bind_changebox: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var changeboxType = e.currentTarget.dataset.type;
    if (changeboxType == 1) {
      // 公司性质
      var varusers = that.data.antureCom;
      for (var i = 0; i < varusers.length; i++) {
        if (name == varusers[i].name) {
          var user = varusers[i];
          if (!varusers[i].checked) {
            varusers[i].checked = !varusers[i].checked;
            varusers[1 - i].checked = !varusers[1 - i].checked;
            that.setData({
              antureCom: varusers,
              comType: name
            })
            break;
          }
        }
      }
    } else {
      // 发票类型
      var varusers = that.data.invoicetypes;
      for (var i = 0; i < varusers.length; i++) {
        if (name == varusers[i].name) {
          var user = varusers[i];
          if (!varusers[i].checked) {
            varusers[i].checked = !varusers[i].checked;
            varusers[1 - i].checked = !varusers[1 - i].checked;
            that.setData({
              invoicetypes: varusers,
              invoicType: name
            })
            break;
          }
        }
      }
    }
  },
  bmSubbmit: function (e) {
    // 做提交动作
    let that = this;
    var bmResetSelected = that.data.bmResetSelected;
    var bmSubbmitSelected = that.data.bmSubbmitSelected;
    that.setData({
      bmSubbmitSelected: !bmSubbmitSelected,
    });
    if (!bmSubbmitSelected && bmResetSelected) {
      that.setData({
        bmResetSelected: !bmResetSelected,
      });
    }
    var comName = that.data.comName;
    var comType = that.data.comType;
    var invoicType = that.data.invoicType;
    var invoicEin = that.data.invoicEin;
    var invoicComAddr = that.data.invoicComAddr;
    var invoicComTel = that.data.invoicComTel;
    var invoicOpenBank = that.data.invoicOpenBank;
    var invoicBankAccount = that.data.invoicBankAccount;
    console.log("{{invoicType}}" + invoicType);
    if (!that.checek_name(comName)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '公司名称不能为空',
      })
      return false;
    }
    if (!that.checek_name(invoicEin)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '纳税识别号不能为空',
      })
      return false;
    }
    if (invoicType == '专票') {
      if (!that.checek_name(invoicComAddr)) {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '公司地址不能为空',
        })
        return false;
      }
      if (!that.checek_tel(invoicComTel)) {
        return false;
      }
      if (!that.checek_name(invoicOpenBank)) {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '开户银行不能为空',
        })
        return false;
      }
      if (!that.checek_name(invoicBankAccount)) {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '银行账号不能为空',
        })
        return false;
      }
    }
    var token = app.globalData.token;
    wx.request({
      url: api.addCompany,
      method: 'POST',
      data: {
        token: token,
        name: comName,
        company_type: comType,
        tax_type: invoicType,
        tax_id: invoicEin,
        address: invoicComAddr,
        tel: invoicComTel,
        tax_bank: invoicOpenBank,
        tax_bank_id: invoicBankAccount,
      },
      success: function (r) {
        console.log(r.data);
        if(r.data.code == 200)
        {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '增加成功',
          })
          wx.navigateBack({
            delta:1,
          });
        }else if (r.data.code == 198) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '添加公司重复',
          })
        }else{
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '错误',
          })
        }
        // wx.setStorageSync('selfCompanyInfo', r.data.company);
        // wx.setStorageSync('selfPersonInfo', r.data.person);
        // that.setData({
        //   coms: r.data.company,
        //   conferees: r.data.person
        // })
      }
    })
  },
  bind_comName: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      comName: value
    })
  },
  bind_invoicEin: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      invoicEin: value
    })
  },
  bind_invoicComAddr: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      invoicComAddr: value
    })
  },
  bind_invoicComTel: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      invoicComTel: value
    })
  },
  bind_invoicOpenBank: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      invoicOpenBank: value
    })
  },
  bind_invoicBankAccount: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      invoicBankAccount: value
    })
  },
  checek_name: function (name) {
    //校验姓名
    console.log("{{checek_name}}" + name);
    return (name.length < 1) ? false : true
  },
  checek_tel: function (phone) {
    var that = this;
    var mobile = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[358]\d{9})$)/;
    if (!mobile.exec(phone)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '电话号码有误',
      })
      return false;
    }

    return true;
  },
  bmReset: function (e) {
    console.log("{{bmReset}}");
    this.setData({
      antureCom: [
        {name: '民营',checked: true},
        {name: '国企',checked: false},
      ],
      invoicetypes: [
        {name: '普票',checked: false},
        {name: '专票',checked: true},
      ],
      bmResetSelected: false,
      bmSubbmitSelected: false,
      comName: '',
      comType: '民营',
      invoicType: '专票',
      invoicEin: '',
      invoicComAddr: '',
      invoicComTel: '',
      invoicOpenBank: '',
      invoicBankAccount: '',
    })
  }
})
