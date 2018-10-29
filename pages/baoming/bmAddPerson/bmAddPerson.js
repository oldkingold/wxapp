var app = getApp();
var api = require('../../../config/api.js');

Page({
  data: {
    inputname: "",
    inputduty: "",
    inputphone: "",
    addmeetPersonlist: [],
    orderPersonlist: []
  },

  onLoad: function () {

    let that = this;
    //获取历史参会人员信息
    that.data.addmeetPersonlist = wx.getStorageSync('selfPersons');

    let addmeetPersonlist = that.data.addmeetPersonlist;
    let orderPersonlist = that.data.orderPersonlist;
    let addList = [];

    wx.getStorage({
      key: 'meetPersonListBefore',
      success: function (res) {
        let varSelected = res.data;
        if (varSelected.length > 0) {
          for (let j = 0; j < varSelected.length; j++) {
            for (let i = 0; i < addmeetPersonlist.length; i++) {
              if (varSelected[j].phone == addmeetPersonlist[i].tel && varSelected[j].name == addmeetPersonlist[i].name && varSelected[j].duty == addmeetPersonlist[i].job) {
                addmeetPersonlist[i].checked = true;
                break;
              } else if (i == addmeetPersonlist.length - 1) {
                addList.unshift({ name: varSelected[j]['name'], tel: varSelected[j]['phone'], job: varSelected[j]['duty'], checked: true })
              }
            }
          }
          if (addList.length > 0) {
            for (let _i = 0; _i < addList.length; _i++) {
              addmeetPersonlist.unshift(addList[_i])
            }
          }
          wx.removeStorage({
            key: 'meetPersonListBefore'
          })
          that.setData({
            addmeetPersonlist: addmeetPersonlist,
            orderPersonlist: varSelected
          })
        } else {
          that.setData({
            addmeetPersonlist: addmeetPersonlist,
          })
        }

      },
      fail: function () {
        console.log("meetPersonListBefore 数据获取失败");
      }
    });
  },
  onShow: function () {

  },
  onUnload: function () {
    let that = this;
    let varmeetPersonlist = that.data.addmeetPersonlist;
    let orderPersonlist = that.data.orderPersonlist;
    let list = [];
    let detail = {};
    for (var i = 0; i < orderPersonlist.length; i++) {
      if (i == orderPersonlist.length)
        break;
      let varmeetPerson = orderPersonlist[i];
      if (varmeetPerson["checked"]) {
        delete varmeetPerson["checked"];
        list.push(varmeetPerson);
      }
    }
    detail.list = list
    detail.route = 'pages/baoming/bmAddPerson/bmAddPerson'
    wx.setStorage({
      key: 'meetPersonListSelected',
      data: detail,
    })
  },
  
  //清空
  addReset: function (e) {
    let that = this;
    that.setData({
      inputname: "",
      inputduty: "",
      inputphone: "",
    });
  },
  //保存
  addSave: function (e) {
    let that = this;
    let varname = e.detail.value.inputname;
    let varduty = e.detail.value.inputduty;
    let varphone = e.detail.value.inputphone;

    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (varname.length < 1 || varduty.length < 1) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '姓名或职务必填',
      })
    }else if (!mobile.exec(varphone)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '手机号码有误',
      })
    }
    else if (!that.check_repeat(varphone, that.data.addmeetPersonlist)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '重复添加',
      })
    }else {

      let varmeetPerson = { name: varname, job: varduty, tel: varphone, checked: false };

      let varmeetPersonlist = that.data.addmeetPersonlist;
      // 有序数列
      let orderPersonlist = that.data.orderPersonlist;
      orderPersonlist.push({ name: varmeetPerson['name'], duty: varmeetPerson['job'], phone: varmeetPerson['tel'], checked: false });

      varmeetPersonlist.unshift(varmeetPerson);

      that.setData({
        addmeetPersonlist: varmeetPersonlist,
        orderPersonlist: orderPersonlist,
        inputname: "",
        inputduty: "",
        inputphone: "",
      });

      var token = app.globalData.token;
      wx.request({
        url: api.addPeople,
        method: 'POST',
        data: {
          token: token,
          name: varmeetPerson.name,
          job: varmeetPerson.job,
          tel: varmeetPerson.tel,
        },
        success: function (r) {
          console.log(r.data);
          if (r.data.code == 200) {
            wx.setStorageSync('selfPersons', varmeetPersonlist);
          }
        }
      })

    }
  },

  changeChecked: function (e) {
    let that = this;
    console.log("{{e}}" + e.currentTarget.dataset.index);
    let itemIndex = e.currentTarget.dataset.index;
    let varmeetPerson = that.data.addmeetPersonlist[itemIndex];
    // 有序数组，解决报名 排序问题
    let orderPersonlist = that.data.orderPersonlist;

    varmeetPerson.checked = !varmeetPerson.checked;
    if (varmeetPerson.checked) {
      orderPersonlist.push({ 'name': varmeetPerson['name'], 'phone': varmeetPerson['tel'], 'duty': varmeetPerson['job'], checked: varmeetPerson.checked });
      that.setData({
        orderPersonlist: orderPersonlist
      })
    } else {
      if (orderPersonlist.length > 0)
        for (let i = 0; i < orderPersonlist.length; i++) {
          if (varmeetPerson.tel == orderPersonlist[i].phone && varmeetPerson.name == orderPersonlist[i].name) {
            orderPersonlist.splice(i, 1);
            that.setData({
              orderPersonlist: orderPersonlist
            })
          }
        }
    }
    that.setData({
      addmeetPersonlist: that.data.addmeetPersonlist
    })
  },

  //提交
  buttomSubbmit: function (e) {
    wx.navigateBack({
      url: '/pages/baoming/bm/bm',
    })
  },

  check_repeat: function (aim, targetList) {
    for (var i = 0; i < targetList.length; i++) {
      if (targetList[i].phone == aim)
        return false
    }
    return true;
  }

})  