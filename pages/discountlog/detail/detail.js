Page({

  data: {
    usedRecords: []
  },

  onLoad: function (options) {
    var pages = getCurrentPages();
    var usedRecords = pages[pages.length - 2].data.usedRecords[options['OId']];
    this.setData({
      usedRecords: usedRecords
    });
    console.log(usedRecords);
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },
})