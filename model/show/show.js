Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: String,
      value: true
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    aniEntity: {},
    ani:{},
    show: true,
    timer:{},
    interval_time:500
  },

  attached: function () {
    // 在组件实例进入页面节点树时执行
    var aniEntity = wx.createAnimation({
      duration: this.data.interval_time,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0'
    })

    this.data.aniEntity = aniEntity
    
  },
  
  methods: {
    //开启loading
    Loading: function(){
      var that = this
      
      var animationIndex = 1
      var timer = setInterval(function () {
        that.rotateAni(++animationIndex);
      }, this.data.interval_time);

      this.setData({
        show: false,
        timer: timer
      })
    },
    //开启loading
    Close : function(){
      clearInterval(this.data.timer)
      this.setData({
        show: true
      })
    },
    rotateAni: function(n){
      this.data.aniEntity.rotate(180 * n).step()
      this.setData({
        ani: this.data.aniEntity.export()
      })
    }

  }
})


// //loading实体
// var LoadingEntity = () => {
//   var _ani = wx.createAnimation({
//     duration: 500,
//     timingFunction: 'linear', 
//     delay: 0,
//     transformOrigin: '50% 50% 0'
//   })
//   return { msg: "", show: true, _ani: _ani,ani:{}}
// }

// //开启loading
// var Loading = (msg, that) => {
//   that.data.loading.msg = msg;
//   that.data.loading.show = false;

//   //animation: loading 1s steps(12, end) infinite;
//   that.setData({
//     loading: that.data.loading,
//   })
// }

// //关闭loading
// var Close = (that) => {
//   that.data.loading.msg = '';
//   that.data.loading.show = true;
//   that.setData({
//     loading: that.data.loading,
//   })
// }

// var rotateAni = (that) => {
//   var ani = that.data.loading._ani
//   ani.rotate(180).step()
//   that.data.loading.ani = ani.export()
//   that.setData({
//     loading: that.data.loading,
//   }) 
// }

// module.exports = {
//   Loading: Loading,
//   Close: Close,
//   LoadingEntity: LoadingEntity
// }