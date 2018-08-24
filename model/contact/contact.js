Component({
  
  properties: {
    info: {
      "type": Object,
      "value": {
        employeeTeacherList: [
        ],
        Tel: "0571-89809186",
        fax: "0571-89809185",
        url: "www.58jz.com.cn",
        email: "sll@58jz.com.cn",
        addr: "杭州市西湖区紫萱路158号西城博司4幢8楼",
        postCode: "310013",
      },
    }
  },

  data: {

  },

  methods: {
    phoneCall: function(e) {
      var tel = e.target.dataset['tel'];
      var detail = { tel: tel}
      this.triggerEvent('phoneCall',detail);
    }
  }
})
