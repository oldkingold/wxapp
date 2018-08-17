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

module.exports = {
  formatTime: formatTime,
  split_array: split_array,
}
