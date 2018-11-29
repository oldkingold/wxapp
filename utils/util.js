var api = require('../config/api.js');
/*
*数组分割
*/
const split_array = (arr, len) => {
  let arrlen = arr.length;
  let newarr = [];
  for (let i = 0; i < arrlen; i += len) {
    newarr.push(arr.slice(i, i + len));
  }
  return newarr;
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function bouncer(arr) {
  // Don't show a false ID to this bouncer.
  return arr.filter(function (val) {
    return !(!val || val === "");
  });
}

function wxlogin() {
  return new Promise(function (resolve, reject) {
    let code = null;
    login().then((res) => {
      code = res.code;
      return getUserInfo();
    }).then((userInfo) => {
      wx.setStorageSync('userInfo', userInfo.userInfo);
      wx.request({
        url: api.Wxlogin,
        method: 'POST',
        data: { 'code': code, 'encryptedData': userInfo.encryptedData, 'iv': userInfo.iv },
        success: function (res) {
          console.log(res)
          // saveSession(res.header["Set-Cookie"]);
          if (res.data) {
            let bind_setting = { company: res.data.bind_company, name: res.data.bind_name, tel: res.data.bind_tel };
            wx.setStorageSync('bind_setting', bind_setting);
            if (res.data.companyName && res.data.companyBindTel) {
              let money = res.data.companyAdd - res.data.companyReduce > 0 ? res.data.companyAdd - res.data.companyReduce : 0;
              let company_setting = { name: res.data.companyName, tel: res.data.companyBindTel, money: money, admin: res.data.companyAdmin };
              wx.setStorageSync('company_setting', company_setting);
            } else {
              wx.removeStorageSync('company_setting');
            }
            wx.setStorageSync('selfCompanies', res.data.selfCompanies);
            wx.setStorageSync('selfPersons', res.data.selfPersons);
            wx.setStorageSync('companyBindTel', res.data.companyBindTel);
            resolve(res.data);
          } else {
            reject(false);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  })
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

/*加载字体*/
function loadFontFace() {
  wx.loadFontFace({
    family: "PingFang Medium",
    source: 'url("' + api.ApiRootUrl + 'fonts/PingFang Medium.ttf")',
    success(res) {
      console.log(res.status)
    },
    fail: function (res) {
      console.log(res.status)
    },
    complete: function (res) {
      console.log(res.status)
    }
  });
}

/*
session处理
*/
var sessionId = "laravel_session";

function saveSession(cookie) {
  console.log(cookie);
  let patt1 = new RegExp(sessionId + '\=(.*?);');

  let match = cookie.match(patt1);
  let session = match[1];

  console.log(session)
}

function removeSession() {

}

function checkSession() {

}

module.exports = {
  formatTime: formatTime,
  split_array: split_array,
  bouncer: bouncer,
  wxlogin: wxlogin, //登陆
  loadFontFace: loadFontFace //加载字体
}
