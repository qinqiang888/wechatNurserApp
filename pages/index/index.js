//index.js
//获取应用实例
var app = getApp();
var ajaxUrls=app.globalData.requestUrl;
var sid=app.globalData.sid;
var source=app.globalData.source;
var version=app.globalData.version;
var newversion=app.globalData.newversion;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    item:'',
    hidden:false,
    src:'/images/onebanner.jpg'    
    
  },
  onLoad: function () {
    // wx.clearStorage()
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      //that.item();
    })
    that.item();
  },
  removeStorage:function(){
    wx.removeStorageSync("address")
    wx.removeStorageSync("startTimeArray")
    wx.removeStorageSync("endTimeArray")
    wx.removeStorageSync("price")
    wx.removeStorageSync("times")
    wx.removeStorageSync("stime")
    wx.removeStorageSync("etime")
    wx.removeStorageSync("detail")
    wx.removeStorageSync("taocan")
    wx.removeStorageSync("tool")
    wx.removeStorageSync("drugs")
    wx.removeStorageSync("objUserInfo");

    wx.removeStorageSync("dateArray");
    wx.removeStorageSync("patientId")
    wx.removeStorageSync("cityCode")
    wx.removeStorageSync("lon")
    wx.removeStorageSync("lat")
    wx.removeStorageSync("addressId")
    wx.removeStorageSync("dateIndex")
    wx.removeStorageSync("startTimeIndex")
    wx.removeStorageSync("endTimeIndex");
    wx.removeStorageSync("needTools")
    wx.removeStorageSync("professionArr");
    wx.removeStorageSync("taocanIndex");
    wx.removeStorageSync("professionCode");
    wx.removeStorageSync('voucherid');
    wx.removeStorageSync('voucherprice');
    wx.removeStorageSync("userRealName");
    wx.removeStorageSync("userIdCardNo");
    wx.removeStorageSync("nickName");
    wx.removeStorageSync("height");
    wx.removeStorageSync("weight");
    wx.removeStorageSync("userAge");
    wx.removeStorageSync("userSex");
    wx.removeStorageSync("realInfo");
   
    

  },
  loginOut:function(){
    
  },
  order:function(e){
    var that = this;
    // var token = wx.getStorageSync("token");
    // var dt = {
    //     'function': 'loginSave',
    //     'token': token,
    //     'deviceToken': '',
    //     'logitude': '',
    //     'latitude': '', 
    //     "newversion":newversion,
    //     "source":source,
    //     "sid":sid,
    //     "version":version,
    // };
    // wx.request({
    //   url: ajaxUrls,
    //   data: {'encryption':false,'data':JSON.stringify(dt)},
    //   method: 'POST', 
    //   header:{
    //       'content-type':'application/x-www-form-urlencoded'
    //   },
    //   success: function(result){
    //       var res = result.data;
    //       if(res.code!='0000'){
    //         wx.removeStorageSync('userId');
    //         wx.removeStorageSync('token');
    //       }
          var code=e.currentTarget.id;
          var name=e.currentTarget.dataset.name;
          wx.setStorageSync('serviceCode', code);
          wx.setStorageSync('serviceName', name);
          // that.removeStorage()
    //       if(!wx.getStorageSync("userId")){
    //         wx.redirectTo({
    //           url: '/pages/login/login'
    //         })
    //       }else{
            // wx.navigateTo({
            //   url: '/pages/order/order'
            // });
          // }
      // }
    // });
      if (!wx.getStorageSync("userId")) {
        wx.redirectTo({
          url: '/pages/login/login'
        })
      } else {
        wx.navigateTo({
          url: '/pages/order/order'
        });
      }
  },

  home:function(){
    if(!wx.getStorageSync("userId")){
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }else{
       wx.navigateTo({
         url: '/pages/home/home'
      });
    }
    
  },
  
  item:function(){
    var that=this;
    
    //var user = wx.getStorageSync('userId');
    //var swx_session=wx.getStorageSync("wx_session");
    var dt={
      "function":"item",
      "role_code":"002",           
      "service_code":"",
      "version":version,
      "shortDisFlag":'1',
      //'login_userId_base': user,
      //"swx_session":swx_session,
      "newversion":newversion,
      "source":source,
      "sid":sid
      }
    // 页面渲染完成
       wx.request({
        url: ajaxUrls,
        data:{"encryption":false,"data":JSON.stringify(dt)},
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method:"POST",
        success: function(res) {
          console.log(res)
          if(res.data.code=="0000"){
            that.setData({
              item:res.data.data,
              hidden:true
            })
          }
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
