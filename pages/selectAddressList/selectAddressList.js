var util = require('../../utils/util.js');

var app = getApp()
var url=app.globalData.requestUrl;
var sid=app.globalData.sid;
var source=app.globalData.source;
var version=app.globalData.version;
var newversion=app.globalData.newversion;
Page({
  data:{
      hidden:false,
      AddressId:wx.getStorageSync('addressId'),
      AddressList:'',
      edit:false
      // requestUrl:'https://h5.yihu365.com/NurseHomeControl.action'
  
  },
  onLoad:function(options){
    this.setData({
      userId:wx.getStorageSync("userId"),
      AddressId:wx.getStorageSync('addressId')
    }) 
    this.selectAddress();
  },
  edit:function(e){
    this.setData({
      edit:true
    })
  },
  over:function(){
    this.setData({
      edit:false
    })
  },
  selectAddress:function(){
    var _this=this ;
    var userId=wx.getStorageSync("userId");
    var swx_session=wx.getStorageSync("wx_session")
    var dt = {
              'function': 'selectAddressByUserId',
              'userid':userId,
              'source':source,
              'version':version,
              'newversion':newversion,
              'sid':sid,
              'login_userId_base': userId,
              "swx_session":swx_session
              // '_validate':'1'
      };
  // 生命周期函数--监听页面加载
    wx.request({
      url: url,
      data:{"encryption":false,"data":JSON.stringify(dt)},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, 
      header: {
      'content-type': 'application/x-www-form-urlencoded' // 设置请求的 header
          },
      success: function(res){
          if(res.data.code=="0000"){
            _this.setData({AddressList:res.data.data});
          }else if(res.data.code=="0502"){
              //util.wxshowModal(res.data.message,false)
              wx.redirectTo({
                url: '/pages/login/login',
              })
          }else{
              util.wxshowModal(res.data.message,false)
          }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  delAddress:function(e){
    var _this=this;
    var userId=wx.getStorageSync("userId");
    var ids=e.target.dataset.id.toString();
    var swx_session=wx.getStorageSync("wx_session");
    var dt={
        'function': 'deleteAddressById', 
        'ID': ids,
        'source':source,
        'version':version,
        'newversion':newversion,
        'sid':sid,
        "swx_session":swx_session
    }
    wx.request({
      url: url,
      data:{"encryption":false,"data":JSON.stringify(dt)},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, 
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 设置请求的 header
            },
      success: function(res){
          console.log(res);
          if(res.data.code=="0000"){
            _this.selectAddress();
          }else if(res.data.code=="0502"){
              //util.wxshowModal(res.data.message,false)
              wx.redirectTo({
                url: '/pages/login/login',

              })
          }else{
              util.wxshowModal(res.data.message,false)
          } 
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
//   order:function(){
//       wx.navigateTo({
//         url:  "../../pages/addNewAddress/addNewAddress"
    
//   },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
   
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  addNewAddress:function(){
      wx.redirectTo({
        url: "../../pages/addNewAddress/addNewAddress",
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  order:function(e){
    wx.setStorageSync('cityCode', e.target.dataset.citycode);
    wx.setStorageSync('lon', e.target.dataset.lon);
    wx.setStorageSync('lat', e.target.dataset.lat);
    wx.setStorageSync('address', e.target.dataset.address+e.target.dataset.doorplate);
    wx.setStorageSync('addressId', e.target.dataset.id);
    wx.removeStorageSync('taocan');
    wx.removeStorageSync('taocanIndex');
    wx.removeStorageSync('professionCode');
    wx.removeStorageSync('professionArr');
      wx.redirectTo({
        url: '/pages/order/order',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      }) 
  },
  onShareAppMessage: function() {
    var title=app.globalData.title;
    var desc=app.globalData.desc;
    var path=app.globalData.path;
    // 用户点击右上角分享
    return {
      title: title, // 分享标题
      desc: desc, // 分享描述
      path: path // 分享路径
    }
  }
})