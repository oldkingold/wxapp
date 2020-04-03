const order = require("../../utils/home/order.js");

Page({

  data: {
    card:{
      companyname:"度川网络科技有限公司",
      level:"",
      max_money:0,
      amount:0,
      spend: 0
    }
  },

  onLoad: function (options) {
    
    
  },

  onShow: function() {
    var that = this;
    order.companystate().then((res) => {
      if (res.data) {
        // console.log(res.data)
        let setData = {}
        setData["card"] = {
          companyname: res.data.company_name,
          level: res.data.level,
          spend: res.data.spend
        }

        // for (let i = 1; i < 6; i++) {
        //   if (that.data.vip1[i]["name"] == res.data.level) {
        //     setData["vip_type"] = i
        //     break;
        //   }
        // }

        that.setData(setData)
      } else {
        wx.showModal({
          title: '提示',
          content: '请前往登陆，开启会员卡服务',
          cancelText: '返回首页',
          confirmText: '去登陆',
          confirmColor: '#195ba9',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '/pages/wode/wode'
              })
            }
          }
        })
      }
    })

    

  }

})