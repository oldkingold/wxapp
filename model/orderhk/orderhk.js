// model/orderhk/orderhk.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type: Boolean,
      value: true
    }
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
    upload: function() {
      console.log("upload");
    },
    confirmPayment: function() {
      console.log("confirmPayment");
    },
    cancel: function() {
      this.setData({
        show:true
      });
    }
  }
})
