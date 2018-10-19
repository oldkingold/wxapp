var api = require('../../config/api.js');
var app = getApp();

var canvasw = 0;
var canvash = 0;
var context = null;
var is_none = true;
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;//设备宽度
    canvash = res.windowHeight;
  }
});
Page({
  data: {
    compName: '',
    name: '',
    phone: '',
    num: '',
    meetingId: '',
    showModal: false,
    pen: 5, //画笔粗细默认值
    color: 'blue', //画笔颜色默认值
    time: 10,
  },
  onLoad: function (options) {
    context = wx.createCanvasContext('myCanvas');  // 初始化画布
    var meetingId = options.meetingId == null ? '' : options.meetingId;
    var meetingInfo = wx.getStorageSync('meetingInfo');
    if (meetingInfo == '' || meetingId == '') {
      wx.showModal({
        title: '提示',
        content: '无此场会议',
        success: function () {
          wx.switchTab({
            url: '/pages/wode/wode',
          })
        }
      })
    }
    var is_meeting = false;
    for (var i = 0; i < meetingInfo.length; i++) {
      if (meetingId == meetingInfo[i].id) {
        is_meeting = true;
        break;
      }
    }
    if (!is_meeting) {
      wx.showModal({
        title: '提示',
        content: '错误',
        success: function () {
          wx.switchTab({
            url: '/pages/wode/wode',
          })
        }
      })
    }
    var compName = wx.getStorageSync('companyName');
    this.setData({
      meetingId: meetingId,
      compName: compName
    })
  },
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  //手指触摸动作开始
  touchStart: function (e) {
    is_none = false;
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()
    this.context.setStrokeStyle(this.data.color)
    this.context.setLineWidth(this.data.pen)
    this.context.setLineCap('round') // 让线条圆润 
    this.context.beginPath()
  },
  //手指触摸后移动
  touchMove: function (e) {
    is_none = false;
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    this.context.moveTo(this.startX, this.startY)
    this.context.lineTo(startX1, startY1)
    this.context.stroke()
    this.startX = startX1;
    this.startY = startY1;
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  //手指触摸动作结束
  touchEnd: function () {

  },
  cleardraw: function () { //清除画布

    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
    is_none = true;
  },
  toRegister: function () {
    var that = this;
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    var numb_type = /^[1-9]*[1-9][0-9]*$/;
    var re = new RegExp(numb_type);
    if (that.data.compName.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请输入公司名',
        showCancel: false
      });
      return false;
    } else if (that.data.name.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false
      });
      return false;
    } else if (!mobile.exec(that.data.phone)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '手机号码有误',
      })
      return false;
    } else if (!numb_type.exec(that.data.num)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '人数有误',
      })
      return false;
    }
    this.setData({
      showModal: true,
    });
  },
  bind_register: function () {
    if (this.startX == 0 || is_none == true) {
      wx.showModal({
        title: '提示',
        content: '签名内容不能为空！',
        showCancel: false
      });
      return false;
    }
    var that = this;
    var token = app.globalData.token;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        //存入服务器
        wx.uploadFile({
          url: api.liveSign, //接口地址
          filePath: res.tempFilePath,
          name: 'sign_img',
          formData: {                 //HTTP 请求中其他额外的 form data
            token: token,
            compName: that.data.compName,
            meeting_id: that.data.meetingId,
            name: that.data.name,
            phone: that.data.phone,
            num: that.data.num
          },
          success: function (res) {
            var r = JSON.parse(res.data)
            if (r.code == 200) {
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '签到成功',
                success: function (e) {
                  wx.navigateBack({
                  })
                }
              })
            }
          },
          fail: function (res) {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '错误',
              success: function (e) {
                wx.redirectTo({
                  url: '/pages/wode/wode',
                })
              }
            })
          }
        });
      }
    }, that)
  },
  bind_compName: function (e) {
    this.setData({
      compName: e.detail.value
    });
  },
  bind_name: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  bind_phone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  bind_person_num: function (e) {
    this.setData({
      num: e.detail.value
    });
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
  }
})
