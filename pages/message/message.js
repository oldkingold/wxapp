// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [
      {
        date:"2018.09.12",
        info:"您购买的5人次套餐已确认，可在套餐力查看详情，感谢您的支持！"
      },{
        date: "2018.09.12",
        info: "0571-82734365您申诉的什么什么什么会议报名参会3人0571-82796365实际参会2人，已核实不通过，如有疑问请联系客服0571-82737365，感谢您的支持！"
      }
    ]
  },

  onLoad: function (options) {
    var rex = /0\d{2,3}-\d{7,8}/g;
    var message = this.data.message;
    for (let index in message) {
      var info = message[index]['info'];
      //将电话与其他文字分割开，以数组形式重新拼接
      var arr = info.split(rex);
      var phone = info.match(rex);
      for(let i in phone) {
        arr.splice(i * 2 + 1, 0, phone[i])
      }
      message[index]['info'] = arr;
    }
    //刷新
    this.setData({
      message: message
    });
  },

  phonecall: function (e) {
    let tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
  
})