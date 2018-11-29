var api = require('../../config/api.js');
const meeting = require('../../utils/home/meeting.js');
var app = getApp();
Page({
  data: {
    coms: [{id: '1',name: '',nature: '',ein: ''}],
    conferees: [{id: '',name: '',tel: '',job: ''}],
    addconferee: {name: '',tel: '',job: ''},
    editconferee: {id: '',name: '',tel: '',job: ''},
    showModal: false,
  },
  onLoad: function (options) {
    var token = app.globalData.token;
    var that = this;
    wx.request({
      url: api.manageInfo,
      method: 'POST',
      data: {
        token: token
      },
      success: function (r) {
        console.log(r.data);
        wx.setStorageSync('selfCompanyInfo', r.data.company);
        wx.setStorageSync('selfPersonInfo', r.data.person);
        that.setData({
          coms: r.data.company,
          conferees: r.data.person,
        })
      }
    })
  },
  onShow: function () {
    // 页面显示
    this.onLoad();
  },

  bind_add_conferee: function (e) {
    // 添加参会人员
    var that = this;
    meeting.add_self_person(that.data.addconferee, app.globalData.token).then(function (res) {
      if (res) {
        let selfPersons = wx.getStorageSync('selfPersons');
        let person = { id: res.id, name: res.name, job: res.job, tel: res.tel };
        selfPersons.push(person);
        wx.setStorageSync('selfPersons', selfPersons);
        that.setData({
          conferees: selfPersons,
          addconferee: {name: '',tel: '',job: ''}
        })
      }
    });
  },
  bind_conf_name: function (e) {
    // 添加参会人员姓名
    var that = this;
    var name = e.detail.value;
    var varaddconferee = that.data.addconferee;
    varaddconferee['name'] = name;
    that.setData({
      addconferee: varaddconferee
    })
  },
  bind_conf_duty: function (e) {
    // 添加参会人员职务
    var that = this;
    var job = e.detail.value;
    var varaddconferee = that.data.addconferee;
    varaddconferee['job'] = job;
    that.setData({
      addconferee: varaddconferee
    })
  },
  bind_conf_phone: function (e) {
    // 添加参会人员手机
    var that = this;
    var tel = e.detail.value;
    var varaddconferee = that.data.addconferee;
    varaddconferee['tel'] = tel;
    that.setData({
      addconferee: varaddconferee
    })
  },
  edit_conf_name: function (e) {
    // 添加参会人员姓名
    var that = this;
    var name = e.detail.value;
    var varaddconferee = that.data.editconferee;
    varaddconferee['name'] = name;
    that.setData({
      editconferee: varaddconferee
    })
  },
  edit_conf_duty: function (e) {
    // 添加参会人员职务
    var that = this;
    var job = e.detail.value;
    var varaddconferee = that.data.editconferee;
    varaddconferee['job'] = job;
    that.setData({
      editconferee: varaddconferee
    })
  },
  edit_conf_phone: function (e) {
    // 添加参会人员手机
    var that = this;
    var tel = e.detail.value;
    var varaddconferee = that.data.editconferee;
    varaddconferee['tel'] = tel;
    that.setData({
      editconferee: varaddconferee
    })
  },

  bind_del_com: function (e) {
    var that = this;
    var varcoms = that.data.coms;
    var varid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        var token = app.globalData.token;
        wx.request({
          url: api.delComapny,
          method: 'POST',
          data: {
            token: token,
            id: varid
          },
          success: function (r) {
            that.onLoad();
          }
        })
      }
    })
  },
  
  bind_del_conferee: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          meeting.del_self_person(e.currentTarget.dataset.id, app.globalData.token).then(function (res) {
            let selfPersons = wx.getStorageSync('selfPersons');
            for (let key in selfPersons) {
              if (selfPersons[key].id == e.currentTarget.dataset.id) {
                selfPersons.splice(key, 1);
              }
            }
            wx.setStorageSync('selfPersons', selfPersons);
            that.setData({
              conferees: selfPersons,
            })
          });
        }
      }
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
    return false;
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  bind_edit_cancel: function () {
    this.hideModal()
  },
  bind_edit_conferee: function (e) {
    var that = this;
    var confereeid = e.currentTarget.dataset.id;
    // 根据参会人员id 查询信息
    var conferees = that.data.conferees;
    if (confereeid.length < 1) {
      console.log("{{confereeid}}" + confereeid);
      wx.showToast({
        title: '出错',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    for (var i = 0; i < conferees.length; i++) {
      if (confereeid == conferees[i].id) {
        that.setData({
          editconferee: conferees[i]
        });
      }
    }
    this.setData({
      showModal: true
    });
  },
  bind_edit_confirm: function (e) {
    var that = this;
    meeting.edit_self_person(that.data.editconferee, app.globalData.token).then(function (res) {
      if (res) {
        that.setData({
          showModal: false
        });
        let selfPersons = wx.getStorageSync('selfPersons');
        for(let key in selfPersons) {
          if(selfPersons[key].id == res.id) {
            selfPersons[key].name = res.name;
            selfPersons[key].job = res.job;
            selfPersons[key].tel = res.tel;
          }
        }
        wx.setStorageSync('selfPersons', selfPersons);
        that.setData({
          conferees: selfPersons,
        })
      }
    });
  },

})