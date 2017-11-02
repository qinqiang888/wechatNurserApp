
var app = getApp(),
  url = app.globalData.requestUrl,
  sid = app.globalData.sid,
  newversion = app.globalData.newversion,
  version = app.globalData.version,
  source = app.globalData.source,
  currentPage = '1',
  pageSize = '10';
  //timeStr = '';
var app = getApp()
Page({
  data: {
    rechargeItem: '',
    thisyear: "",
    listItem: '',
    currentPage: '1',
    timeStr:''
  },
  recharge: function () {
    wx.redirectTo({ url: "/pages/recharge/recharge" })
  },
  ////充值列表事件处理函数
  rechargeItem: function (current) {
    var userid = wx.getStorageSync('userId');
    var that = this;
    //  var userid = that.data.userid;
    var dt = {
      'function': 'getMyUserAccountList',
      'userid': userid,
      //  '_validate': '1', 
      'type': '0',
      'login_userId_base': userid,
      // "_validate":"1",
      "pageSize": pageSize,
      'currentPage': current.toString(),
      "sid": sid,
      "version": version,
      "newversion": newversion,
      "source": source
    };
    wx.request({
      url: url,
      data: { "encryption": false, "data": JSON.stringify(dt) },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },// 设置请求的 header
      success: function (res) {
        console.log(res)

        console.log(res.data.freezeFee + '-----------')
        if (res.data.code == "0000") {
          var od = res.data;
          var list = od.List;
          if (od.List != 0) {
            var year, date, time;
            var thisyear = new Date;
            thisyear = thisyear.getFullYear();
            for (var i = 0; i < list.length; i++) {
              var newYear = '';
              var operateDate = od.List[i].operateDate,//服务时间
                year = operateDate.split(' ')[0].split('-').slice(0, 1).join(''),//记录年
                date = operateDate.split(' ')[0].split('-').slice(1).join('/'),//日期格式
                time = operateDate.split(' ')[1].split(':').slice(0, 2).join(':');//时间格式
              list[i].date = date;
              list[i].time = time;
              if (that.data.timeStr != year) {
                that.data.timeStr = year;
                newYear = year;
              } else {
                newYear = '';
              }
              list[i].year = newYear;
            }
            var listStr = '';
            if (current != 1) {
              listStr = that.data.listItem.concat(list);
              console.log(listStr)
            } else {
              listStr = list;
            }
            console.log(res.data.List);

          
          }
          that.setData({
              rechargeItem: res.data,
              thisyear: thisyear,
              listItem: listStr
            })
            console.log(listStr)

        }
      }
    })

  },
  onReachBottom: function () {
    this.data.currentPage++;
    var that = this;

    var time = setTimeout(function () {
      that.rechargeItem(that.data.currentPage);
    }, 500);

  },
  onLoad: function () {
    // wx.clearStorage()
    var that = this;
    
    //更新数据
    that.setData({
      rechargeItem: that.data.rechargeItem,
      userid: wx.getStorageSync('userId'),
      currentPage: '1'
    })
     that.rechargeItem(that.data.currentPage);

  }
})