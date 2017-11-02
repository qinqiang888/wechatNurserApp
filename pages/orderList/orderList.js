var app = getApp();
var globalData = app.globalData;
var ajaxUrls = globalData.requestUrl;
var source = globalData.source;
var sid = globalData.sid;
var version = globalData.version;
var newversion = globalData.newversion;
var sortTimeEnd = '',stopTime;
Page({
  data: {
    orderList : [],
    currentPage : 1,
    total : '',
    loadingBlen:true,
    loadingEnd:true,
    dialogBlen:true,
    listNone:true
  },
  onLoad:function(){
    this.getMyOrderList(1);
  },
  //下拉刷新
  onPullDownRefresh: function() {
    if(stopTime){
      clearTimeout(stopTime);
    }
    this.setData({
      currentPage : 1,
    });
    sortTimeEnd = '';
    this.getMyOrderList(1);
  },
  //加载
  onReachBottom: function() {
    var that = this;
    var current = that.data.currentPage+1;
    var total = that.data.total;
    
    if(current>total){
      that.setData({
        loadingEnd : false
      });
      return;
    }
    that.setData({
      currentPage : current,
    });
    
    var time = setTimeout(function(){
      that.getMyOrderList(current,time);
    },500);
    
  },
  //获取列表
  getMyOrderList:function(currentPage,loadingTime){
    var that = this;
    var user = wx.getStorageSync('userId');
    var swx_session=wx.getStorageSync("wx_session");
    //var user = '11623';//修改
    var dt = {
        'function': 'getMyOrderList',
        'userid': user,
        'currentPage': currentPage.toString(),
        'pageSize': '10',
        'login_userId_base': user,
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
            if(res.List.length!=0){
              var list, loading = false;
              if(currentPage==1){
                list = res.List;
              }else{
                list = that.data.orderList.concat(res.List)
              }
              if(res.pageNum==1){
                loading = true;
              }
              that.sortTime(list);//设置list数组的时间
              console.log(list);
              that.setData({
                orderList : list,
                total : res.pageNum,
                dialogBlen:true,
                //loadingBlen : true
                loadingBlen:loading,
                listNo:true
              });
              clearTimeout(loadingTime);
            }else{
              that.setData({
                listNone:false
              });
            }
          }else if(res.code=='0502'){
              /*that.setData({
                  dialogBlen:false,
                  dialogMsg:'登录异常，请重新登录',
                  listNo:false
              });*/
              wx.redirectTo({
                url: '/pages/login/login'
              });
          }else{
              that.setData({
                  dialogBlen:false,
                  dialogMsg:res.message,
                  listNo:false
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
  //列表时间排序
  sortTime:function(list){
    for(var i=0;i<list.length;i++){
      var operate = list[i].operateDate.split(' ')[0];
      var all = '';
      if (sortTimeEnd != operate) {
        sortTimeEnd = operate;
        var date = new Date(operate);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var week = date.getDay();
        switch (week) {
            case 0:
                week = '周日';
                break;
            case 1:
                week = '周一';
                break;
            case 2:
                week = '周二';
                break;
            case 3:
                week = '周三';
                break;
            case 4:
                week = '周四';
                break;
            case 5:
                week = '周五';
                break;
            case 6:
                week = '周六';
                break;
        }
        all = year + '年' + month + '月' + day + '日 ' + week;
      }
      list[i].newOperate =  all;
    }
  },
  //点击空白弹框消失
  modalChange:function(){
      this.setData({
          dialogBlen:true
      });
  },
  //点击列表
  goToDetail:function(e){
    var dataset = e.currentTarget.dataset;
    var code = dataset.servicecode;
    
    if(code!='002'){
      //非护士上门订单
      this.setData({
        dialogBlen:false,
        dialogMsg:'只可查看护士上门的订单详情'
      });
    }else{
      //护士上门订单
      var orderId = dataset.id;
      wx.redirectTo({
        url: '../orderDetail/orderDetail?orderId='+orderId
      });
    }
  }
})
