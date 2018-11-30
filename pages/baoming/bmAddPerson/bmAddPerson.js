var app = getApp();
var api = require('../../../config/api.js');
const meeting = require('../../../utils/home/meeting.js');
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
                varSelected[j].id = addmeetPersonlist[i].id;
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
          wx.removeStorage({key: 'meetPersonListBefore'})
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

  onUnload: function () {
    let that = this;
    let varmeetPersonlist = that.data.addmeetPersonlist;
    let orderPersonlist = that.data.orderPersonlist;
    let list = [];
    let detail = {};
    for (var i = 0; i < orderPersonlist.length; i++) {
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
    if (!that.check_repeat(e.detail.value.inputphone, that.data.addmeetPersonlist)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '重复添加',
      })
      return false;
    }


    let varname = e.detail.value.inputname;
    let varduty = e.detail.value.inputduty;
    let varphone = e.detail.value.inputphone;
    let person = { name: varname, job: varduty, tel: varphone }

    meeting.add_self_person(person, app.globalData.token).then(function (res) {
      if (res) {
        let selfPersons = wx.getStorageSync('selfPersons');
        let person = { id: res.id, name: res.name, job: res.job, tel: res.tel };
        selfPersons.unshift(person);
        wx.setStorageSync('selfPersons', selfPersons);
        let varmeetPersonlist = that.data.addmeetPersonlist;
        person.checked = false;
        varmeetPersonlist.unshift(person);
        that.setData({
          addmeetPersonlist: varmeetPersonlist,
          inputname: "",
          inputduty: "",
          inputphone: "",
        });
      }
    });

  },

  changeChecked: function (e) {
    let that = this;
    let varmeetPerson = that.data.addmeetPersonlist[e.currentTarget.dataset.index];
    // 有序数组，解决报名 排序问题
    let orderPersonlist = that.data.orderPersonlist;
    varmeetPerson.checked = !varmeetPerson.checked;

    if (varmeetPerson.checked) {
      orderPersonlist.push({ id: varmeetPerson['id'], 'name': varmeetPerson['name'], 'phone': varmeetPerson['tel'], 'duty': varmeetPerson['job'], checked: varmeetPerson.checked, main_contact: 0});
      that.setData({
        orderPersonlist: orderPersonlist
      })
    } else {
      if (orderPersonlist.length > 0)
        for (let i = 0; i < orderPersonlist.length; i++) {
          if (varmeetPerson.id == orderPersonlist[i].id) {
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