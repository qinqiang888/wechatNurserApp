//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (data) {
          that.globalData.code = data.code
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo   
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //全局数据
  globalData:{
    userInfo:null,
    code:null,
    userId:null,//用户id
    sid:'85000000000',//渠道
    source:'swxapp_users_002',
    version:'1.41',
    newversion:'41',
    title:'医护到家--全国首家护士上门服务平台',//分享标题
    desc: '医护到家是第一视频集团打造的移动健康服务平台，医护到家app提供了护士上门打针输液服务、挂号陪诊、中医理疗、慢病回访等医护服务；下载医护到家app，健康随身携带。',//分享描述
    // path: 'http://ua.yihu365.com/yihu365/huanzhe/download/80001100201.jsp',// 分享路径
     path: '/pages/index/index' ,// 分享路径 
 requestUrl  :'https://h5.yihu365.com/NurseHomeControl.action',//业务接口地址
 loginUrl    :'https://h5.yihu365.com/swxLogin.action',//登录接口地址
 loginOutUrl :'https://h5.yihu365.com/loginOut.action',//退出登录接口地址
 imgUploadUrl:'https://h5.yihu365.com/upload/imgUpload.action',//上传头像地址
 addressUrl  :'https://h5.yihu365.com/remoteAccess/remote'
 
//cityCode请求地址
  }
})