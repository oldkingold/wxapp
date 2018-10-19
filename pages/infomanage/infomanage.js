var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    coms: [{
      id: '1',
      name: '',
      nature: '',
      ein: '',
    },

    ],
    conferees: [{
      id: '',
      name: '',
      tel: '',
      job: '',
    },

    ],
    addconferee: {
      name: '',
      tel: '',
      job: '',
    },
    editconferee: {
      id: '',
      name: '',
      tel: '',
      job: '',
    },
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
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    this.onLoad();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  bind_add_conferee: function (e) {
    // 添加参会人员
    // 添加到本地 page
    var that = this;
    if (!that.check_add_conferee(that.data.addconferee)) {
      return false;
    }
    var varaddconferee = that.data.addconferee;
    var token = app.globalData.token;
    wx.request({
      url: api.addPeople,
      method: 'POST',
      data: {
        token: token,
        name: varaddconferee.name,
        job: varaddconferee.job,
        tel: varaddconferee.tel,
      },
      success: function (r) {
        console.log(r.data);
        if (r.data.code == 200) {
          that.onLoad();
          let selfPersons = wx.getStorageSync('selfPersons');
          let person = { name: varaddconferee.name, job: varaddconferee.job, tel: varaddconferee.tel };
          selfPersons.unshift(person);
          wx.setStorageSync('selfPersons', selfPersons);
        }
      }
    })
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
  check_add_conferee: function (res) {
    // 检验数据的合法性
    var that = this;
    var varaddconferee = res;
    //校验姓名
    if (!that.checek_name(varaddconferee.name)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '姓名不能为空',
      })
      return false;
    }
    //校验职务
    if (!that.checek_name(varaddconferee['job'])) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '职务不能为空',
      })
      return false;
    }
    //校验手机
    if (!that.checek_phone(varaddconferee['tel'])) {
      return false;
    }
    return true;
  },
  checek_name: function (name) {
    //校验姓名
    console.log("{{checek_name}}" + name);
    return (name.length < 1) ? false : true
  },
  checek_phone: function (tel) {
    var that = this;
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!mobile.exec(tel)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '手机号码有误',
      })
      return false;
    }
    return true;
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
    var varconferees = that.data.conferees;
    var varid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          var token = app.globalData.token;
          wx.request({
            url: api.delPeople,
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
    if (!that.check_add_conferee(that.data.editconferee)) {
      return false;
    }
    var editconferee = that.data.editconferee;
    var token = app.globalData.token;
    wx.request({
      url: api.updatePeople,
      method: 'POST',
      data: {
        token: token,
        id: editconferee.id,
        name: editconferee.name,
        job: editconferee.job,
        tel: editconferee.tel,
      },
      success: function (r) {
        that.setData({
          showModal: false
        });
        that.onLoad();
      }
    })

  },

})