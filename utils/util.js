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

const formatTimeToSevenDay = datestr => {
  let date = new Date(datestr);
  let now = new Date();
  let distance = now.getTime() - date.getTime();
  let hours = 7 * 24 - parseInt(distance / (3600 *1000));
  let day = hours / 24;
  let hour = hours % 24; 
  if (parseInt(hour) == 0) {
    return parseInt(day) + "天";
  }
  return parseInt(day) + "天" + parseInt(hour) + "小时";
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

//更新小程序
function updateProgram() {
  if (wx.canIUse("getUpdateManager")) {
    console.log("+++++++++++++++++++++++++++");
    //检查是否存在新版本
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {//如果有新版本

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })

        })

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
  }
}

function wxlogin() {
  return new Promise(function (resolve, reject) {
    let code = null;
    console.log("wx.login +++++++++++++++++++++++++++++++ wx.login");
    console.log((new Date()).valueOf());
    wx.login({
      success: function (ress) {
        console.log("wx.login +++++++++++++++++++++++++++++++ wx.login");
        console.log((new Date()).valueOf());
        if (ress.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (userInfo) {
              console.log("wx.login2222 +++++++++++++++++++++++++++++++ wx.login2222");
              console.log((new Date()).valueOf());
              wx.setStorageSync('userInfo', userInfo.userInfo);
              wx.request({
                url: api.Wxlogin,
                method: 'POST',
                data: { 'code': ress.code, 'encryptedData': userInfo.encryptedData, 'iv': userInfo.iv },
                success: function (res) {
                  console.log("wx.login2222 +++++++++++++++++++++++++++++++ wx.login2222");
                  console.log((new Date()).valueOf());
                  console.log(res);
                  // saveSession(res.header["Set-Cookie"]);
                  wx.setStorageSync("token", res.data.token);
                  wx.setStorageSync("openId", res.data.openId);
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
                    wx.setStorageSync('selfCompanies', res.data.selfCompanies ? res.data.selfCompanies : []);
                    wx.setStorageSync('selfPersons', res.data.selfPersons ? res.data.selfPersons : []);
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
            }
          })
        }
      }
    });
    // login().then((res) => {
    //   code = res.code;
    //   return getUserInfo();
    // }).then((userInfo) => {
    //   console.log("wx.login2222 +++++++++++++++++++++++++++++++ wx.login2222");
    //   console.log(Date());
    //   wx.setStorageSync('userInfo', userInfo.userInfo);
    //   wx.request({
    //     url: api.Wxlogin,
    //     method: 'POST',
    //     data: { 'code': code, 'encryptedData': userInfo.encryptedData, 'iv': userInfo.iv },
    //     success: function (res) {
    //       console.log("wx.login2222 +++++++++++++++++++++++++++++++ wx.login2222");
    //       console.log(Date());
    //       console.log(res);
    //       // saveSession(res.header["Set-Cookie"]);
    //       wx.setStorageSync("token", res.data.token);
    //       wx.setStorageSync("openId", res.data.openId);
    //       if (res.data) {
    //         let bind_setting = { company: res.data.bind_company, name: res.data.bind_name, tel: res.data.bind_tel };
    //         wx.setStorageSync('bind_setting', bind_setting);
    //         if (res.data.companyName && res.data.companyBindTel) {
    //           let money = res.data.companyAdd - res.data.companyReduce > 0 ? res.data.companyAdd - res.data.companyReduce : 0;
    //           let company_setting = { name: res.data.companyName, tel: res.data.companyBindTel, money: money, admin: res.data.companyAdmin };
    //           wx.setStorageSync('company_setting', company_setting);
    //         } else {
    //           wx.removeStorageSync('company_setting');
    //         }
    //         wx.setStorageSync('selfCompanies', res.data.selfCompanies ? res.data.selfCompanies : []);
    //         wx.setStorageSync('selfPersons', res.data.selfPersons ? res.data.selfPersons : []);
    //         wx.setStorageSync('companyBindTel', res.data.companyBindTel);
    //         resolve(res.data);
    //       } else {
    //         reject(false);
    //       }
    //     },
    //     fail: function (err) {
    //       reject(err);
    //     }
    //   })
    // });
  })

  
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    console.log("wx.login +++++++++++++++++++++++++++++++ wx.login");
    console.log(Date());
    wx.login({
      
      success: function (res) {
        console.log("wx.login +++++++++++++++++++++++++++++++ wx.login");
        console.log(Date());
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

//函数节流
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

//request
function request(url, method,data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url:url,
      method: method,
      data:data,
      success: function (res) {
        // console.log(res)
        resolve(res)
      },
      fail: function (res) {
        // console.log(res);
        reject(res);
      }
    });
  });
}

module.exports = {
  formatTimeToSevenDay: formatTimeToSevenDay,
  formatTime: formatTime,
  split_array: split_array,
  bouncer: bouncer,
  wxlogin: wxlogin, //登陆
  loadFontFace: loadFontFace, //加载字体
  updateProgram: updateProgram, //更新小程序
  throttle: throttle, //函数节流
  request: request,
}
