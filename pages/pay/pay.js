var app = getApp()
var util = require('../../utils/util.js')
var url=app.globalData.requestUrl;
var sid=app.globalData.sid;
var source=app.globalData.source;
var version=app.globalData.version;
var newversion=app.globalData.newversion;

Page({
  data:{
      orderFee:0,//订单金额
      ableFee:0,//可用余额
      rechargeFee:0,//代金券金额
      payFee:0,//实付金额
      voucherAmount:0,//代金卷数量
      ischangeVoucher:'当前未选择代金券',//是否选择代金卷
      title:'',
      acountFee:'',//所有下单可用金额
      disabled:false,
      loading:false
  },
  onLoad:function(options){
      this.getUserInfo();
      this.init();
      this.setData({
          orderId:options.orderId
      });
    // 生命周期函数--监听页面加载

  },
  init:function(){
      var that=this;
      var orderFee =wx.getStorageSync("price")?wx.getStorageSync("price"):0;
      var rechargeFee=wx.getStorageSync("voucherprice")?wx.getStorageSync("voucherprice"):0
      that.setData({
        orderFee:orderFee,
        rechargeFee:rechargeFee
      })

  },
  getUserInfo:function(){
    var that=this;
    var url=app.globalData.requestUrl;
    var user=wx.getStorageSync("userId")
    
    var dt={'function':'getUserInfo1','userId':user         
    // 'login_userId_base': user,
    //   '_validate':'1'
      };
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
          that.setData({
              ableFee:res.data.user.ableUseFee,
          })
        var payFee=that.data.orderFee-that.data.rechargeFee;
        var acountFee=res.data.user.ableUseFee+that.data.rechargeFee;//账户余额+代金券
        var title='';
                if(acountFee>=payFee){
                    title='立即支付'
                }else{
                    title="立即充值"
                }
                that.setData({
                    title:title,
                    acountFee:acountFee,
                    payFee:payFee
                })
                
            }
            //wx.setStorageSync('payFee', that.data.payFee);
         }    
     })
  },
  payOrder: function () {
      var that = this;
      var orderId = that.data.orderId;
      var payFee = that.data.payFee;
      var user=wx.getStorageSync("userId")
      if(this.data.acountFee<this.data.payFee){
         
          wx.redirectTo({
            url: '/pages/recharge/recharge?orderId='+that.data.orderId+'&payFee='+payFee,

          })
          return
      }
       this.setData({
        disabled:true,
        loading:true
        })
        
        var voucherId=wx.getStorageSync('voucherid');
        //var orderId=wx.getStorageSync('orderId');

        var payFee=this.data.payFee;
        var dt = {
            'function': 'payOrder',
            'userid': user,
            'orderId': orderId,
            'payFee': payFee.toString(),
            'voucherId': voucherId,
            "version":version,
            "newversion":newversion,
            "source":source,
            "sid":sid
        }
        wx.request({
            url: url,
            data:{"encryption":false,"data":JSON.stringify(dt)},
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method:"POST",
            success: function(res) {
            console.log(res)
            if(res.data.code=="0000"){
                console.log(res)
                wx.redirectTo({
                  url: '/pages/paySuccess/paySuccess?orderId='+that.data.orderId,
                })
                wx.removeStorageSync('voucherid');
                wx.removeStorageSync('voucherprice');
            }else{
                util.wxshowModal(res.data.message,false)
               
            }
             that.setData({
                    disabled:false,
                    loading:false
                })
            }
        
        })



 },

  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})