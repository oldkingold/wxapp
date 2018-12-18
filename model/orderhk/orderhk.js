const app = getApp();
const api = require('../../config/api.js');

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
    show:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    upload: function() {
      console.log("upload");
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
        }
      })
    },
    //确认汇款
    confirmPayment: function(e) {
      console.log("confirmPayment");
      console.log(e);
      var data = {};
      data['oId'] = e.currentTarget.dataset['id'];
      data['token'] = app.globalData.token; 

      wx.uploadFile({
        url: api.checkOrderCard, 
        filePath: tempFilePaths[0],
        name: 'img',
        formData: data,
        success(res) {
          const data = res.data
          
        }
      })
    },

    cancel: function() {
      this.setData({
        show:true
      });
    }
  }
})
