const app = getApp()
const meet = require('../../utils/home/meeting.js');
const api = require('../../config/api.js');

Page({
  data: {
    rooturl: api.ApiRootUrl,
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

    let meeting = meet.meetingDetail(options['meeting']);
    if(meeting) {
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
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      scale: 18,
      name: '兰州·锦江阳光酒店（四星级）',
      address: '兰州城关区东岗西路589号（近民航售票处）'
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
})