// pages/serviceTimes/serviceTimes.js
var app = getApp();
var globalData = app.globalData;
var ajaxUrls = globalData.requestUrl;
var source = globalData.source;
var sid = globalData.sid;
var version = globalData.version;
var newversion = globalData.newversion;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    
    var swx_session=wx.getStorageSync("wx_session");
    //var user = '11623';//修改
    var dt = {
        'function': 'selectSubOrderServiceList',
        'orderId':options.orderId,
        //'_validate':'1',
        'version': version,
        'newversion': newversion,
        'source':source,
        "sid": sid,
        "swx_session":swx_session  
    };
    wx.request({
      url: ajaxUrls,
      data: {'encryption':false,'data':JSON.stringify(dt)},
      method: 'POST', 
      header:{
          'content-type':'application/x-www-form-urlencoded'
      },
      success: function(result){
          var res = result.data;
          if(res.code=='0000'){
            that.setData({
              list:res.list
            })
          }
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})