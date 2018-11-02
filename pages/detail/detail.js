const app = getApp()
const meet = require('../../utils/home/meeting.js');
const api = require('../../config/api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    rooturl: api.ApiRootUrl,
    companyInfo: [],
    chxz: {},
    kctg: {},
    select_index: '0',
    meeting:[]
  },
  onLoad: function (options) {
    
    var testData = [{
      'title': 'chxz',
    },
    {
      'title': 'kctg',
    }];

    var that = this;

    meet.companyInfo().then(function(res) {
      // that.data.companyInfo = res.split("\n");
      that.setData({
        companyInfo: res.split("\n")
      });
    })

    let meeting = meet.meetingDetail(options['meeting']);
    if(meeting) {
      
      meeting.course.introduction = meeting.course.introduction.replace(/<img/g,'<img style="max-width: 100%;height:auto"')
      if (meeting.hotel) {
        meeting.hotel.routes = JSON.parse(meeting.hotel.routes);
        meeting.hotel.jwd = meeting.hotel.jwd.split(",");
      }
      
      meeting.introduction = meeting.introduction.split("\n");
      let start_date = new Date(meeting.start_date.replace(/-/g,"/"));
      let bddate = start_date.getDate();
      let end_date = new Date(meeting.end_date.replace(/-/g, "/"));
      start_date.setTime(start_date.getTime() + 24 * 60 * 60 * 1000);
      end_date.setTime(end_date.getTime() - 24 * 60 * 60 * 1000);
      meeting.pxdate = start_date.getFullYear() + "年" + (start_date.getMonth() + 1) + "月" + start_date.getDate() + "-" + end_date.getDate() + "日（" + bddate + "日报道）";

      meeting.teach_introduction = [];
      meeting.teach_article = {};
      meeting.teach_book = "";
      meeting.teach_assess = [];
      if (meeting.teachers_num == 1) {
        meeting.teach_introduction = meeting.teachers.introduction.split("\n");
        meeting.teach_book = meeting.teachers.books;
        meeting.teach_assess.push(meeting.teachers.assess);
        
        let articles = JSON.parse(meeting.teachers.articles);
        for (let key in articles) {
          meeting.teach_article[key] = articles[key];
        }
      }else {
        for (let i = 0; i < meeting.teachers_num; i ++) {
          let introductions = meeting.teachers[i].introduction.split("\n");
          for (let j = 0; j < introductions.length; j++) {
            meeting.teach_introduction.push(introductions[j]);
          }
          meeting.teach_book += meeting.teachers[i].books;
          meeting.teach_assess.push(meeting.teachers[i].assess);

          let articles = JSON.parse(meeting.teachers[i].articles);
          for (let key in articles) {
            meeting.teach_article[key] = articles[key];
          }
        }
      }

      let saledetail = meeting.sale.sale.split("\n"); 
      for (let key in saledetail) {
        saledetail[key] = util.bouncer(saledetail[key].split(/([0-9]{1,3}人及以上)|([0-9]\.[0-9]{1,2}折)/));
      }
      for (let key in saledetail) {
        let sd = {};
        for (let i in saledetail[key]) {
          sd[saledetail[key][i]] = /([0-9]{1,3}人及以上)|([0-9]\.[0-9]{1,2}折)/.test(saledetail[key][i]);  
        }
        saledetail[key] = sd;
      }

      meeting.saledetail = saledetail;

      console.log(meeting);
      that.setData({
        meeting: meeting
      });
    }
    
    for (var i = 0; i < testData.length; i++) {
      if (testData[i].title == 'chxz') {
        that.setData({
          "chxz": testData[i]
        })
      } else if (testData[i].title == 'kctg') {
        that.setData({
          "kctg": testData[i]
        })
      }
    }

  },

  makeCall: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },

  goMap: function (e) {
    let that = this;
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 18,
      name: that.data.meeting.hotel.name + "(" + that.data.meeting.hotel.star + ")",
      address: that.data.meeting.hotel.address
    })
  },

  detailClick: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    // var detail_img = "'" + index + '.detail_img' + "'";
    // var detail_direction = "'" + index + '.detail_direction' + "'";
    // that.setData({
    //   'chxz.detail_img': e.currentTarget.dataset.direction == 'down' ? 'detail-top' : 'detail-down',
    //   'chxz.detail_direction': e.currentTarget.dataset.direction == 'down' ? 'top' : 'down',
    //   'chxz.detail_show': e.currentTarget.dataset.direction == 'down' ? true : false
    // })
    if (this.data.select_index == index) {
      this.setData({
        'select_index': 0
      })
    } else {
      this.setData({
        'select_index': index
      })
    }
  },

  bindweixin: function (e) {
    let that = this;
    let userInfo = wx.getStorageSync("userInfo");
    
    if (e.detail.userInfo && !userInfo) {
      util.wxlogin().then((res) => {
        app.globalData.token = res.token;
        app.globalData.openId = res.openId;
        wx.navigateTo({
          url: '/pages/baoming/bm/bm?id=' + that.data.meeting.id,
        })
      });
    } else if (e.detail.userInfo && userInfo) {
      wx.navigateTo({
        url: '/pages/baoming/bm/bm?id=' + that.data.meeting.id,
      })
    }else {
      wx.showModal({
        title: "用户未授权",
        content: '请授权允许微信登录后进行报名',
        showCancel: false,
      })
    }
  },
})