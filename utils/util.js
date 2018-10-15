/*
*数组分割
*/
const split_array = (arr,len) => {
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
      storage.put('userInfo', userInfo.userInfo, 60 * 60 * 15);
      wx.request({
        url: api.Wxlogin,
        method: 'POST',
        data: { 'code': code, 'encryptedData': userInfo.encryptedData, 'iv': userInfo.iv },
        success: function (res) {
          console.log(res)
          if (res.data) {
            let bind_setting = { company: res.data.bind_company, name: res.data.bind_name, tel: res.data.bind_tel };
            storage.put('bind_setting', bind_setting, 60 * 60 * 15);
            if (res.data.companyName && res.data.companyBindTel) {
              let money = res.data.companyAdd - res.data.companyReduce > 0 ? res.data.companyAdd - res.data.companyReduce : 0;
              let company_setting = { name: res.data.companyName, tel: res.data.companyBindTel, money: money, admin: res.data.companyAdmin };
              storage.put('company_setting', company_setting, 60 * 60 * 15);
            } else {
              storage.remove('company_setting');
            }
            storage.put('selfCompanies', res.data.selfCompanies, 60 * 60 * 15);
            storage.put('selfPersons', res.data.selfPersons, 60 * 60 * 15);
            storage.put('companyBindTel', res.data.companyBindTel, 60 * 60 * 15);
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

module.exports = {
  formatTime: formatTime,
  split_array: split_array,
  bouncer: bouncer,
}
