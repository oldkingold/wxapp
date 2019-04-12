const app = getApp();
const api = require('../../config/api.js');
const util = require('../../utils/util.js');
// model/orderhk/orderhk.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type: Boolean,
      value: true
    },
    money:{
      type: Number,
      value: 0
    },
    orderId: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:true,
    tempFilePaths: [],
    date: new Date().toLocaleDateString(),
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    upload: function() {
      let that = this;
      console.log("upload");
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // that.data.tempFilePaths = res.tempFilePaths
          that.setData({
            tempFilePaths : res.tempFilePaths
          });
        }
      })
    },
    //确认汇款
    confirmPayment: function(e) {
      console.log("confirmPayment");
      console.log(e);
      let that = this;
      var data = {};
      data['oId'] = e.currentTarget.dataset['id'];
      data['token'] = app.globalData.token;
      data['openId'] = app.globalData.openId;
      data['date'] = this.data.date; 
      if (this.data.tempFilePaths.length == 0) {
        util.request(api.checkOrderVip1, "post", data).then((res)=>{
          var rdata = res.data;
          if (rdata.code == 200) {
            wx.showToast({
              title: "提交成功",
              icon: 'none',
              duration: 3000,
            });
            rdata.oId = data['oId'];
            that.triggerEvent('confirmPayment', rdata)
          } else {
            wx.showToast({
              title: "提交失败",
              icon: 'none',
              duration: 3000,
            });
          }
          that.setData({
            show: true
          });
        })
        return;
      }
      // this.triggerEvent('confirmPayment', data)
      wx.uploadFile({
        url: api.checkOrderVip1, 
        filePath: this.data.tempFilePaths[0],
        name: 'img',
        formData: data,
        success(res) {
          const rdata = JSON.parse(res.data)
          if (rdata.code == 200) {
            wx.showToast({
              title: "提交成功",
              icon: 'none',
              duration: 3000,
            });
          }else {
            wx.showToast({
              title: "提交失败",
              icon: 'none',
              duration: 3000,
            });
          }
          rdata.oId = data['oId'];
          that.triggerEvent('confirmPayment', rdata)
          that.setData({
            show: true
          });
        },
        fail(res) {
          wx.showToast({
            title: "网络异常",
            icon: 'none',
            duration: 3000,
          });
        }
      })
    },
    //时间选择器
    bindDateChange: function (e) {
      this.setData({
        date: e.detail.value
      })
    },
    cancel: function() {
      this.setData({
        show:true,
        tempFilePaths: []
      });
    }
  }
})
