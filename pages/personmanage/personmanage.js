var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    users: [{
      wxname: '',
      wximage: '',
      wxid: '',
      role: '',
      ctime: '',
      checked: true
    }],
    logs: [{
      time: '',
      operation: ''
    },
    ],
    showModal: false,
    companyAdmin: false
  },
  onLoad: function () {
    var token = app.globalData.token;

    let company_setting = wx.getStorageSync('company_setting');
    this.setData({
      companyAdmin: company_setting == null ? false : company_setting['admin'],
    })
    var that = this;
    wx.request({
      url: api.bdWxusers,
      method: 'POST',
      data: {
        token: token
      },
      success: function (r) {
        console.log(r.data.data);
        that.setData({
          users: r.data.data
        })
      }
    })
  },
 
  /**
* 弹出框蒙层截断touchmove事件
*/
  preventTouchMove: function () {
    return;
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  bind_cancel: function () {
    this.hideModal()
  },
  bind_changebox: function (e) {
    var that = this;
    var openId = e.currentTarget.dataset.wxid;
    var varusers = that.data.users;
    for (var i = 0; i < varusers.length; i++) {
      if (openId == varusers[i].openId) {
        var user = varusers[i];
        varusers[i].checked = !varusers[i].checked
        that.setData({
          users: varusers
        })
        break;
      }
    }
  },
  bind_del: function () {
    var token = app.globalData.token;
    var that = this;
    // 获取当前用户的角色，如果没有权限直接返回
    var varusers = that.data.users;
    var userList = [];
    for (var i = 0; i < varusers.length; i++) {
      if (varusers[i].checked) {
        userList.push(varusers[i]);
      }
    }
    if (userList.length < 1) {
      wx.showModal({
        title: '警告',
        content: '还没有选择用户',
      })
    } else {
      console.log(userList);
      wx.request({
        url: api.bdDel,
        method: 'POST',
        data: {
          token: token,
          openIdList: userList
        },
        success: function (r) {
          if (r.data.code == 200) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 5000,
              complete: function () {
                that.bind_cancel();
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.showToast({
              title: '错误',
              icon: 'none',
              duration: 2000,
              complete: function () {
                that.bind_cancel();
                wx.navigateBack({
                  delta: 1
                })
              }
            })

          }
        },
        complete: function (r) {

        }
      })
    }


  },
  bind_showModal: function () {
    if (!this.data.companyAdmin) {
      wx.showToast({
        title: '您不是管理员!',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        showModal: true
      });
    }
  }

})
