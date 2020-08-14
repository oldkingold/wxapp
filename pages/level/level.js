const order = require("../../utils/home/order.js");
const util = require('../../utils/util.js');
var app = getApp();

Page({

  data: {
    card:{
      companyname:"度川网络科技有限公司",
      level:"",
      maxmoney:0,
      amount:0,
      spend: 0,
      rightsAnimation:null,
      rightsShow:false
    },
    vip:{
      "钻石会员": { "icon": "diamond" },
      "白金会员": { "icon": "platinum" },
      "金卡会员": { "icon": "gold" },
      "银卡会员": { "icon": "silver" },
      "普通会员": { "icon":"common"},
    }
    
  },

  onLoad: function (options) {
    if (app.globalData.openId == "") {
      
    }
  },

  onShow: function() {
    var that = this;
    order.companystate().then((res) => {
      if (res.data.code == 200) {
        // console.log(res.data)
        let setData = {}
        setData["card"] = res.data.data
        if (setData["card"].maxmoney == "MAX") {
          setData["card"]["coverWidth"] = 1 * 480
        }else {
          var point = setData["card"].spend / setData["card"].nextmoney;
          if(point > 1) {
            point = 1
          }
          setData["card"]["coverWidth"] = point * 480
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
                url: '/pages/home/home'
              })
            }
          }
        })
      }
    })

    

  },
  //权益详细
  rights: function(e){
    var index = e.currentTarget.dataset.index;
    var rights = this.data.card.rights;
    wx.showModal({
      title: rights[index]["name"],
      content: rights[index]["Introduction"],
      showCancel: false,
    })
  }, 
  //收起展开动画
  rightsShow: util.throttle(function(){
    var height
    if (this.data.rightsShow) {
      this.setData({
        rightsShow:false
      })
      height = "240rpx";
    }else {
      this.setData({
        rightsShow: true
      })
      if(this.data.card.rights.length > 8) {
        height = "565rpx";
      } else if (this.data.card.rights.length > 4) {
        height = "410rpx";
      }else {
        height = "240rpx";
      }
      
    }
    var ani = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 100
    })
    ani.height(height).step()
    this.setData({
      rightsAnimation: ani.export()
    })
  },400),
  todiscount: function() {
    wx.navigateTo({
      url: '/pages/discount/discount',
    })
  },
  toNotices: function() {
    wx.navigateTo({
      url: '/pages/notices/notices',
    })
  }

})