var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    antureCom: "民营",
    invoicetypes: "暂不开票",
    bmResetSelected: false,
    bmSubbmitSelected: false,
    cominfo: {
      comId: '',
      comName: '',
      comType: '民营',
      invoicType: '暂不开票',
      invoicEin: '',
      invoicComAddr: '',
      invoicComTel: '',
      invoicOpenBank: '',
      invoicBankAccount: '',
    },
  },
  onLoad: function (options) {
    var that = this;
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
    
    if (currentCom.company_type == '国企') {
      this.setData({
        antureCom: currentCom.company_type
      })
    } 

    if (currentCom.tax_type == '普票' || currentCom.tax_type == '专票') {
      this.setData({
        invoicetypes: currentCom.tax_type
      })
    } 
    
    this.setData({
      cominfo: {
        comId: currentCom.id,
        comName: currentCom.name,
        comType: that.data.comType,
        invoicType: that.data.invoicetypes,
        invoicEin: currentCom.tax_id,
        invoicComAddr: currentCom.address,
        invoicComTel: currentCom.tel,
        invoicOpenBank: currentCom.tax_bank,
        invoicBankAccount: currentCom.tax_bank_id,
      }
    })
  },

  bind_changebox: function (e) {
    console.log(e)
    var that = this;
    var name = e.currentTarget.dataset.name;
    var changeboxType = e.currentTarget.dataset.type;
    if (changeboxType == 1) {
      this.setData({
        antureCom: name,
        'cominfo.comType': name
      })
    } else {
      this.setData({
        invoicetypes: name,
        'cominfo.invoicType': name
      })
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
    if (invoicType != '暂不开票' && !that.checek_name(invoicEin)) {
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
