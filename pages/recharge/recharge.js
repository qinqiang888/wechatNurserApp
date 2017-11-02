var app = getApp()
var util = require('../../utils/util.js')
// app.set
Page({
  data:{
      fee:'',
      ableUseFee:'',
      loading: false,
      disabled:false,
      title :'微信支付',
      inputdisabled:false
  },
  onLoad:function(options){
    //console.log('支付'+options.payFee)
    if(options.payFee){
      this.setData({
        fee:options.payFee,
        inputdisabled:true,
        orderId:options.orderId
      })
    }
    this.getuserInfo();
    // 生命周期函数--监听页面加载
  },
  inputvalue:function(e){
      var value=e.detail.value;
      this.setData({
         fee:value
      })

  },
  recharge:function(e){
    if(!this.data.fee){
      util.wxshowModal('请输入充值金额',false)
      return
    }
    
    var that=this;
    that.setData({
      loading:true,
      disabled:true
    })
    //用户支付失败的情况下再次点击，重新获取登录code
       wx.login({
        success: function (data) {
          app.globalData.code = data.code;
         
          var fee=that.data.fee
          var device_id=app.globalData.code;
          var souce=app.globalData.source;
          var orderId=that.data.orderId;
          var userId=wx.getStorageSync('userId');
          //  var orderId=wx.getStorageSync("orderId");//取orderId
          console.log(app.globalData)
        //    var userId=app.globalData.userId
          var dt={'function':'recharge','user_id':userId,'fee':fee.toString(),'pay_type':'2','gate_id':'27','sid':'85000000000','app_flag':'3','device_id':device_id,'order_id':orderId,source:souce}
        
        var url=app.globalData.requestUrl;
          wx.request({
          url: url,
          data:{"encryption":false,"data":JSON.stringify(dt)},
          header: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          method:"POST",
          success: function(res) {
            var isRealInfo='';
            if(res.data.code=="0000"){
              var retjson=JSON.parse(res.data.data)
              console.log(retjson.retcode)
              //-----取得后台传过来的下单参数---------
              if(retjson.retcode==0){
                var timeStamp=retjson.timestamp
                var nonceStr=retjson.noncestr
                var Package=retjson.package
                var paySign=retjson.sign   
                //----------发起微信支付   ---------------        
                wx.requestPayment({
                'timeStamp': timeStamp,
                'nonceStr': nonceStr,
                'package': Package,
                'signType': 'MD5',
                'paySign': paySign,
                'success':function(res){
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000
                    })

                    //---------如果orderId存在，自动跳到订单详情页，-------------
                    wx.removeStorageSync('payFee')
                    if(orderId){
                      wx.navigateTo({
                        url: '../../pages/paySuccess/paySuccess',
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
                    }
                    that.setData({
                      loading:false,
                      disabled:false
                    })

                  },
                  'fail':function(res){
                    console.log(res)
                    if(res.errMsg=="requestPayment:fail cancel"){
                        util.wxshowModal('用户取消支付',false)
                    
                    }else{
                      util.wxshowModal('支付失败',false)
                    }
                      that.setData({
                          loading:false,
                          disabled:false
                      })
                  
                  },
              })
    
              }
            
            }else{
              util.wxshowModal(res.data.message,false)
              that.setData({
                  loading:false,
                  disabled:false
              })
            }
          }    
        })
      }
      }) 
  },
  getuserInfo:function(){
    console.log(2222)
    var that=this;
    var url=app.globalData.requestUrl;
    var userId=wx.getStorageSync('userId');
    var dt={'function':'getUserInfo1','userId':userId,'_from':'h5'};
    // 获取用户信息
       wx.request({
        url: url,
        data:{"encryption":false,"data":JSON.stringify(dt)},
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method:"POST",
        success: function(res) {
          if(res.data.code=="0000"){
            var ablefee=res.data.user.ableUseFee
            console.log(ablefee)
              that.setData({
              ableUseFee :ablefee
            })
            
          
          }else{
            util.wxshowModal(res.data.message,false)
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