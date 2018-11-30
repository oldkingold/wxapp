const api = require('../../config/api.js');

//获取会议主题
function themes() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.Theme,
      method: "GET",
      success: function(res) {
        // console.log(res)
        resolve(res)
      },
      fail: function(res) {
        console.log(res);
        reject(res);
      }

    })
  });
}

//获取会议
function meeting() {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.Meeting,
      method: "GET",
      success: function (res) {
        // console.log(res)
        resolve(res)
      },
      fail: function (res) {
        console.log(res);
        reject(res);
      }

    })
  });
}

//获取某一场会议
function meetingDetail(id) {
  let meetings = wx.getStorageSync("meetings");

  if (meetings) {
    return meetings[id];
  }else {
    return null;
  }

}

function companyInfo() {
  let companyInfo = wx.getStorageSync("companyInfo");
  
    return new Promise(function (resolve, reject) {
      if (!companyInfo) {
        wx.request({
          url: api.companyInfo,
          method: "GET",
          success: function (res) {
            wx.setStorageSync("companyInfo", res.data);
            resolve(res.data)
          },
          fail: function (res) {
            reject(res);
          }
        })
      } else {
        resolve(companyInfo)
      }
    });
  
}

//添加公司人员
function add_self_person(person,token) {
  //校验姓名
  if (person.name.length < 1) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '姓名不能为空',
    })
    return false;
  }
  //校验职务
  if (person.job.length < 1) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '职务不能为空',
    })
    return false;
  }
  //校验手机
  if (!checek_phone(person.tel)) {
    return false;
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.addPeople,
      method: 'POST',
      data: {
        token: token,
        name: person.name,
        job: person.job,
        tel: person.tel,
      },
      success: function (res) {
        if (res.data.code == 200) {
          resolve(JSON.parse(res.data.data))
        } else if (res.data.code == 202) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.data,
          })
        }else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}
//修改参会人员信息
function edit_self_person(person, token) {
  //校验姓名
  if (person.name.length < 1) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '姓名不能为空',
    })
    return false;
  }
  //校验职务
  if (person.job.length < 1) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '职务不能为空',
    })
    return false;
  }
  //校验手机
  if (!checek_phone(person.tel)) {
    return false;
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.updatePeople,
      method: 'POST',
      data: {
        token: token,
        name: person.name,
        job: person.job,
        tel: person.tel,
        id: person.id,
      },
      success: function (res) {
        if (res.data.code == 200){
          resolve(JSON.parse(res.data.data))
        } else if (res.data.code == 202) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.data,
          })
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}
//删除公司人员
function del_self_person(personid, token) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: api.delPeople,
      method: 'POST',
      data: {
        token: token,
        id: personid,
      },
      success: function (res) {
        if (res.data.code == 200) {
          resolve(res)
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        reject(res);
      }
    })
  });
}
//检验手机格式
function checek_phone(tel) {
  var that = this;
  var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!mobile.exec(tel)) {
    wx.showModal({
      showCancel: false,
      title: '提示',
      content: '手机号码有误',
    })
    return false;
  }
  return true;
}

module.exports = {
  themes: themes,
  meeting: meeting,
  meetingDetail: meetingDetail,
  companyInfo: companyInfo,
  checek_phone: checek_phone,
  add_self_person: add_self_person,
  edit_self_person: edit_self_person,
  del_self_person: del_self_person,
}