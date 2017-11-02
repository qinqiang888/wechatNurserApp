var util = require('../../utils/util.js')
var app = getApp()
Page({
  data:{
      address:'选择所在地区',//显示的地址
      doorplate:'',
      lon:'',
      lat:'',
      city:'',
      cityCode:'',
      province:'',
      AddressList:'',
      addresssubmit:'',//向后台提交的地址
      hidden:false,
      loading: false,
      disabled:false,
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
  },
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
    var _this=this;
    var url=app.globalData.requestUrl;
    var userId=wx.getStorageSync("userId")
    var addresssubmit=this.data.addresssubmit;
    var sid=app.globalData.sid;
    var source=app.globalData.source;
    var version=app.globalData.version;
    var newversion=app.globalData.newversion;
    var doorplate=this.data.doorplate
    var lon=this.data.lon
    var lat=this.data.lat
    var cityCode=this.data.cityCode
    var swx_session=wx.getStorageSync("wx_session")
      if(!this.data.address){
        util.wxshowModal('请选择所在地区街道',false)
        return;
      }
      if(!doorplate){
        util.wxshowModal('请选择楼层门面信息',false)
      return
      }
         _this.setData({
          loading:true,
          disabled:true
        })
      
    
        var dt = {
            'function': 'saveAddress',
            'userid': userId,
            'address': addresssubmit,
            'doorplate': doorplate,
            'longitude': lon,
            'latitude': lat,
            'cityCode': cityCode,
            "version":version,
            "newversion":newversion,
            "source":source,
            "sid":sid,
            'login_userId_base': userId,
            "swx_session":swx_session
            // '_validate':'1'
        }
        wx.request({
          url: url,
          data:{"encryption":false,"data":JSON.stringify(dt)},
          method: 'POST', 
          header: {'content-type': 'application/x-www-form-urlencoded'}, // 设置请求的 header
          success: function(res){
            if(res.data.code=="0000"){
                  wx.redirectTo({
                    url: '../../pages/selectAddressList/selectAddressList',
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
            }else if(res.data.code=="0502"){
              //util.wxshowModal(res.data.message,false)
              wx.redirectTo({
                url: 'pages/login/login',

              })
            }else{
                util.wxshowModal(res.data.message,false)
            }
            _this.setData({
              loading:false,
              disabled:false
           })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
      })
  },
  serchResult:function(){
    // 页面渲染完成
    var _this=this;
    var keyword=encodeURI('锐创国际');
    var regin=encodeURI('锐创国际');
       wx.request({
        // url: 'http://apis.map.qq.com/ws/place/v1/search',
        url:'https://apis.map.qq.com/ws/place/v1/search?keyword='+keyword+'&boundary=region('+regin+')&key=d84d6d83e0e51e481e50454ccbe8986b',
        // data:{"keyword":'锐创国际','boundary':region('锐创国际'),'key':'d84d6d83e0e51e481e50454ccbe8986b'},
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method:"GET",
        success: function(res) {
          _this.setData({
            AddressList:res.data.data,
            hidden:false
          })
        }
        
    })
  },
  selectAddress:function(e){
  },
   bindInput: function(e) {
    this.setData({
      doorplate: e.detail.value
    })

  },
  chooseLocation:function(){
    
      var _this=this;
      wx.chooseLocation({
        type:'gcj02',
        success: function(res){
          var address=res.name;
          var lat=res.latitude
          var lon=res.longitude
          _this.setData({
              address:address,
              lon:lon,
              lat:lat

          })
          var location = lat + ','+lon;
          _this.selectCitycode(location)
  
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },
  selectCitycode:function(location){
    var _this=this;
    var url=app.globalData.addressUrl;
    var mapurl=encodeURIComponent('https://api.map.baidu.com/geocoder/v2/?ak=qhtAc3RfIoiFNP37NlQjn398NQ1qMWGi&location=' + location + '&output=json&pois=1')
    wx.request({
      url: url+'?paramUrl='+mapurl+'',
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        _this.setData({
          province:res.data.result.addressComponent.province,
          city:res.data.result.addressComponent.city,
          cityCode:res.data.result.cityCode,
          addresssubmit:res.data.result.addressComponent.province+' '+res.data.result.addressComponent.city+' '+res.data.result.addressComponent.district+' '+_this.data.address
        })

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