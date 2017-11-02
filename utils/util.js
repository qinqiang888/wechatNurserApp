function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//弹框
function wxshowModal(msg){
  wx.showModal({
        title:msg,
        showCancel:false,
        confirmColor:'#1cc6a3'
      })
}


module.exports = {
  formatTime: formatTime,
  wxshowModal:wxshowModal
}
