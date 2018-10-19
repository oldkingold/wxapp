var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    antureCom: [{
      name: '民营',
      checked: true,
    },
    {
      name: '国企',
      checked: false,
    }],
    invoicetypes: [{
      name: '普票',
      checked: false,
    },
    {
      name: '专票',
      checked: true,
    }],
    bmResetSelected: false,
    bmSubbmitSelected: false,
    cominfo: {
      comId: '',
      comName: '',
      comType: '民营',
      invoicType: '专票',
      invoicEin: '',
      invoicComAddr: '',
      invoicComTel: '',
      invoicOpenBank: '',
      invoicBankAccount: '',
    },
  },
  onLoad: function (options) {
    var varid = options.id
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 1000
    });
    var selfCompanyInfo = wx.getStorageSync('selfCompanyInfo');
    var currentCom = null;
    for (var i = 0; i < selfCompanyInfo.length; i++) {
      if (selfCompanyInfo[i].id == varid) {
        currentCom = selfCompanyInfo[i];
        break;
      }
    }
    if (currentCom.company_type=='民营') {
      this.setData({
        antureCom: [{
          name: '民营',
          checked: true,
        },
        {
          name: '国企',
          checked: false,
        }]
      })
    } else if (currentCom.company_type=='国企') {
      this.setData({
        antureCom: [{
          name: '民营',
          checked: false,
        },
        {
          name: '国企',
          checked: true,
        }]
      })
    }else{
      this.setData({
        antureCom: [{
          name: '民营',
          checked: true,
        },
        {
          name: '国企',
          checked: false,
        }]
      })
    }
    if (currentCom.tax_type=='普票') {
      this.setData({
        invoicetypes: [{
          name: '普票',
          checked: true,
        },
        {
          name: '专票',
          checked: false,
        }]
      })
    } else{
      this.setData({
        invoicetypes: [{
          name: '普票',
          checked: false,
        },
        {
          name: '专票',
          checked: true,
        }]
      })
    }
    this.setData({
      cominfo: {
        comId: currentCom.id,
        comName: currentCom.name,
        comType: currentCom.company_type,
        invoicType: currentCom.tax_type,
        invoicEin: currentCom.tax_id,
        invoicComAddr: currentCom.address,
        invoicComTel: currentCom.tel,
        invoicOpenBank: currentCom.tax_bank,
        invoicBankAccount: currentCom.tax_bank_id,
      }
    })
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
              'cominfo.comType': name
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
              'cominfo.invoicType': name
            })
            console.log("{{name}}" + name);
            break;
          }
        }
      }
    }
  },
  bmSubbmit: function (e) {
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
    var comName = that.data.cominfo.comName;
    var comType = that.data.cominfo.comType;
    var invoicType = that.data.cominfo.invoicType;
    var invoicEin = that.data.cominfo.invoicEin;
    var invoicComAddr = that.data.cominfo.invoicComAddr;
    var invoicComTel = that.data.cominfo.invoicComTel;
    var invoicOpenBank = that.data.cominfo.invoicOpenBank;
    var invoicBankAccount = that.data.cominfo.invoicBankAccount;
    console.log(comName);
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
      url: api.updateCompany,
      method: 'POST',
      data: {
        token: token,
        id: that.data.cominfo.comId,
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
        if (r.data.code == 200) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '修改成功',
            complete: function(){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }else if (r.data.code == 198) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '添加公司重复',
          })
        }else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '错误',
            complete: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
    })
  },

  bind_comName: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.comName': value
    })
  },
  bind_invoicEin: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.invoicEin': value
    })
  },
  bind_invoicComAddr: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.invoicComAddr': value
    })
  },
  bind_invoicComTel: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.invoicComTel': value
    })
  },
  bind_invoicOpenBank: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.invoicOpenBank': value
    })
  },
  bind_invoicBankAccount: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      'cominfo.invoicBankAccount': value
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
})
