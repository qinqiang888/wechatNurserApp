var app = getApp();
var globalData = app.globalData;
var ajaxUrls = globalData.requestUrl;
var source = globalData.source;
var sid = globalData.sid;
var version = globalData.version;
var newversion = globalData.newversion, stopTime;
Page({
    data:{
        dialogBlen:true,
        dialogMsg:'',
        detailModal:true,
        cancelResult:'',//取消预约原因
        dataList:'',//详情obj
        count:0,//服务次数
        detailTime:null,//3s后台校验时间执行倒计时
        secondTime:null,//每秒一次倒计时
        timeTotal:1800,//30分钟倒计时
        payTimeOut:true,//显示倒计时
        payTime:1800,//倒计时剩余时间
        creatTime:'',
        serviceTel:''

    },
    onLoad:function(options){
        this.setData({
            orderId:options.orderId
        })
        this.detailList();
    },
    //下拉刷新
    onPullDownRefresh: function() {
        if(stopTime){
            clearTimeout(stopTime);
            }
        this.detailList();
    },
    //订单详情
    detailList:function(){
        var that = this;
        var orderId = that.data.orderId;
        var userId = wx.getStorageSync('userId');
        var swx_session=wx.getStorageSync("wx_session");
        //var userId = '11623';//修改
        var dt = {
            "function": "selectSubscribeOrder",
            "orderId": orderId,
            'userid': userId,
            "standardFlag": "0",
            'login_userId_base': userId,
            //'_validate':'1',
            'version': version,
            'newversion': newversion,
            'source':source,
            "sid": sid,
            "swx_session":swx_session
        }
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
                    var date = res.data.serviceTimeEnd.split(' ');
                    var etime = date[1].split(":")[0]+':00';
                    var date1 = res.data.serviceTimeStart.split(' ');
                    var stime = date1[1].split(":")[0]+':00';
                    var tel;
                    if(res.data.orderStatus=='1' || res.data.orderStatus=='2'){
                        tel = res.data.serverUserMobile.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2');
                        console.log("tel"+tel)
                    }
                    
                    that.setData({
                        dataList:res.data,
                        serviceTime:date[0],
                        startTime:stime,
                        endTime:etime,
                        serviceName:res.data.service.split(' ')[0],
                        serviceTel:tel,
                        creatTime:res.data.CREATE_TIME.split(" ")[0]
                    });
                    //调用倒计时
                    if(res.data.orderStatus=='0' && res.data.payStatus=='-1'){
                        that.showTime(res.data.CREATE_TIME);
                        that.data.detailTime = setInterval(function () {
                            clearInterval(that.data.secondTime);
                            that.showTime(res.data.CREATE_TIME);
                        }, 30000);
                    }
                    //待服务
                    if(res.data.orderStatus=='1' || res.data.orderStatus=='2'){
                        that.count();
                    }
                }else if(res.code=='0502'){
                    /*that.setData({
                        dialogBlen:false,
                        dialogMsg:'登录异常，请重新登录',
                    });*/
                    wx.redirectTo({
                      url: '/pages/login/login'
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        detailModal:true,
                        dialogMsg:res.message
                    });
                }
                stopTime = setTimeout(function(){
                    wx.stopPullDownRefresh({
                        complete: function (res) {
                        console.log(res, new Date())
                        }
                    });
                },2500);
            }
        });
    },
    //服务次数
    count:function(){
        var that = this;
        var orderId = that.data.orderId;
        var userId = wx.getStorageSync('userId');
        var dt = {
            'function': 'selectSubOrderServiceList',
            'orderId': orderId,
            'login_userId_base': userId,
            //'_validate':'1',
            'version': version,
            'newversion': newversion,
            'source':source,
            "sid": sid
        }
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
                       count: res.list.length
                    });
                }else if(res.code=='0502'){
                    /*that.setData({
                        dialogBlen:false,
                        dialogMsg:'登录异常，请重新登录',
                    });*/
                    wx.redirectTo({
                      url: '/pages/login/login'
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        detailModal:true,
                        dialogMsg:res.message
                    });
                }
            }
        });
    },
    //待付款倒计时
    formateTime: function (time) {
        var minute = parseInt(time / 60);
        var lateSecond = time % 60;
        minute = minute < 10 ? ("0" + minute) : minute;
        lateSecond = lateSecond < 10 ? ("0" + lateSecond) : lateSecond;
        return minute + ':' + lateSecond;
    },
    showTime: function (CREATE_TIME) {
        var that = this;
        var thisCreatTime = new Date(CREATE_TIME.replace(/-/g, '/')).getTime() / 1000;
        var currentTime = new Date().getTime() / 1000;
        var subTime = Math.floor(currentTime) - Math.floor(thisCreatTime);

        var countTimes = that.data.timeTotal - subTime;
        if (countTimes <= 0) {
            that.setData({
                payTimeOut:false
            });
            return;
        }
        that.setData({
            payTime:that.formateTime(countTimes)
        });
        that.countDown(countTimes);
    },
    countDown: function (timeNum) {
        var that = this;
        var syTime = timeNum;
        var stime = that.data.secondTime;
        var dtime = that.data.detailTime;
        clearInterval(dtime);
        clearInterval(stime);
        stime = setInterval(function () {
            syTime--;
            if (syTime <= 0) {
                clearInterval(dtime);
                clearInterval(stime);
                that.setData({
                    payTimeOut:false
                });
            } else {
                that.setData({
                    payTime:that.formateTime(syTime)
                });
            }
        }, 1000);
    },
    //点击空白弹框消失
    modalChange:function(){
        this.setData({
            dialogBlen:true,
            detailModal:true
        });
    },
    //取消预约接口
    cancelEvent:function(){
        var that = this;
        var orderId = that.data.orderId;
        var userId = wx.getStorageSync('userId');
        var reasonId = this.data.cancelResult;

        //var userId ='462303';//修改
        //var orderId= 532197;

        var dt = {
            'function': 'cancel',
            'order_id': orderId,
            'user_id': userId,
            'type': that.data.dataList.orderStatus,
            'cancelreasonId': reasonId,
            'login_userId_base': userId,
            //'_validate':'1',
            'version': version,
            'newversion': newversion,
            'source':source,
            "sid": sid
        }
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
                        detailModal:true
                    });
                    that.detailList();
                }else if(res.code=='0502'){
                    /*that.setData({
                        dialogBlen:false,
                        dialogMsg:'登录异常，请重新登录',
                    });*/
                    wx.redirectTo({
                      url: '/pages/login/login'
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        detailModal:true,
                        dialogMsg:res.message
                    });
                }
            }
        });
    },
    //等待付款、医护抢约取消预约
    cancleOrderPay:function(){
        var that = this;
        this.setData({
            detailModal:false,
            dialogBlen:true
        });
    },
    //取消预约确认弹框
    detailCancleChange:function(){
        //待付款、待抢约取消预约点击确定
        this.cancelEvent();
    },
    //取消预约radio
    cancelRadio:function(e){
        this.setData({
            cancelResult:e.detail.value
        });
    },
    //去支付
    goToPay:function(){
        var that = this;
        var price = this.data.dataList.price;
        wx.setStorageSync('price', price);
        wx.redirectTo({
          url: '/pages/pay/pay?orderId='+that.data.orderId,
        });
    },
    //拨打电话
    callTel:function(){
        var tel = this.data.dataList.serverUserMobile;
        wx.makePhoneCall({
          phoneNumber: tel,
          success: function(res) {
            // success
          }
        });
    },
    //确认服务
    sureDoor:function(){
        this.setData({
            detailModal:false,
            dialogBlen:true
        });
    },
    //确认完成服务弹框
    detailServiceChange:function(){
        var that = this;
        var orderId = that.data.orderId;
        var userId = wx.getStorageSync('userId');


        //var userId ='462303';//修改
        //var orderId= 532197;

        var dt = {
            'function': 'door',
            'order_id': orderId,
            'user_id': userId,
            'login_userId_base': userId,
            //'_validate':'1',
            'version': version,
            'newversion': newversion,
            'source':source,
            "sid": sid
        }
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
                    that.detailList();
                    that.setData({
                        detailModal:true
                    })
                }else if(res.code=='0502'){
                    /*that.setData({
                        dialogBlen:false,
                        dialogMsg:'登录异常，请重新登录',
                    });*/
                    wx.redirectTo({
                      url: '/pages/login/login'
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        detailModal:true,
                        dialogMsg:res.message
                    });
                }
            }
        });
    }
})