var app = getApp();
var globalData = app.globalData;
var ajaxUrls = globalData.requestUrl;
var source = globalData.source;
var sid = globalData.sid;
var version = globalData.version;
var newversion = globalData.newversion;
Page({
    data:{
        //是否错误弹框，true为隐藏弹框
        dialogBlen:true,
        //错误弹框msg
        dialogMsg:'',
        //日期列表{{array}}
        //serviceDate:util.getDate(),
        //日期 下标
        serviceDateIndex:8,
        //开始时间列表{{array}}
        serviceStart:'',
        //开始时间 下标
        serviceStartIndex:'',
        //结束时间列表{{array}}
        serviceEnd:'',
        //结束时间 下标
        serviceEndIndex:'',
        //套餐列表{{array}}
        taocanList:'',
        //套餐下标
        taocanIndex:'',
        //是否有工具
        tool:'',
        //是否有药品
        drugs:'',
        //病情描述
        details:'',
        //患者信息
        patient:'',
        professionArr:'',
        //防止多次下单
        submitBlen:false,
        //下单前弹框内容
        contentText:'',
        //下单前弹框 确定按钮操作
        contentTextBlen :false

    },

    onLoad:function(){
        //初始化地址
        var that = this;
        //that.loginvalidate();
        
        wx.showNavigationBarLoading();
        wx.setNavigationBarTitle({
            title:wx.getStorageSync('serviceName'),
            success:function(){
                wx.hideNavigationBarLoading()
            }
        })

        this.setData({
            //返回地址信息
            address:wx.getStorageSync('address'),

            //日期列表{{array}}
            serviceDate:that.getDate(),
            //日期 下标
            serviceDateIndex:wx.getStorageSync('dateIndex')?wx.getStorageSync('dateIndex'):8,

            //开始时间列表{{array}}
            serviceStart:wx.getStorageSync('startTimeArray'),
            serviceStartIndex:wx.getStorageSync('startTimeIndex')?wx.getStorageSync('startTimeIndex'):100,
            
            //结束时间列表{{array}}
            serviceEnd:wx.getStorageSync('endTimeArray'),
            serviceEndIndex:wx.getStorageSync('endTimeIndex')?wx.getStorageSync('endTimeIndex'):100,

            serviceName:wx.getStorageSync('serviceName'),
            serviceCode:wx.getStorageSync('serviceCode'),
            tool:wx.getStorageSync('tool'),
            drugs:wx.getStorageSync('drugs'),
            details:wx.getStorageSync('detail'),
            patient:wx.getStorageSync('objUserInfo')
        });
        
        //获取套餐列表
        if(wx.getStorageSync('address')){
            if(wx.getStorageSync('taocanIndex') && wx.getStorageSync('taocan')){
                this.setData({
                    taocanList:wx.getStorageSync('taocan'),
                    professionArr:wx.getStorageSync('professionArr'),
                    taocanIndex:wx.getStorageSync('taocanIndex')?wx.getStorageSync('taocanIndex'):100
                });
            }else{
                that.taocan();
            }
        }
        var code = wx.getStorageSync('serviceCode');
        if(code!='001' && code!='002' && code!='003'){
            this.setData({
                drugs:true
            });
        }
        //获取下单前弹框内容
        this.serviceText();
        
    },
    //判断闰年
    isLeapYear:function (Year) {
        if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)){
            return true;
        } else {
            return false; 
        }
    },
    //服务时间--日期星期
    getDate:function(){
        var that = this;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate()-1;
        var week = date.getDay()-1;
        var days, weeks, data=[];
        switch(month){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            days = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
        default:
            days = that.isLeapYear(year) ? 29 : 28;
            break;
        }
        
        for(var i=0;i<7;i++){
        day++;
        week++;
        if(day>days){
            month++;
            if(month>12){
            year++;
            month = 1;
            }
            day=1;
        }
        if(week>=7){
            week=0;
        }
        switch(week){
            case 0:
            weeks = "周日";
            break;
            case 1:
            weeks = "周一";
            break;
            case 2:
            weeks = "周二";
            break;
            case 3:
            weeks = "周三";
            break;
            case 4:
            weeks = "周四";
            break;
            case 5:
            weeks = "周五";
            break;
            case 6:
            weeks = "周六";
            break;
        }
        var stringArray = year+'年'+month+'月'+day+'日'+' '+weeks;
        data.push(stringArray);
        }
        wx.setStorageSync('dateArray', data);
        return data;
    },
    //服务开始时间
    getTime:function(currentDate){
        var that = this;
        var current = currentDate.split("月")[1].split("日")[0];
        var date = new Date();
        var day = date.getDate();
        var hours = date.getHours()+1;
        var times = [];
        for(var i=0;i<24;i++){
            var str = (i)+':00';
            times.push(str); 
        }
        
        if(current==day){
            var times = times.slice(hours);
            console.log(current)
            //wx.setStorageSync('startTimeIndex', '0');//改变
        }
        wx.setStorageSync('startTimeArray', times);
        that.setData({
            serviceStart:times,
            serviceStartIndex:100
        });
    },
    //服务结束时间
    getTimeEnd:function(currentTime){
        var that = this;
        var current = parseInt(currentTime.split(":")[0])+1;
        var times = [];
        for(var i=0;i<25;i++){
            var str = i+':00';
            times.push(str); 
        }
        times = times.slice(current);
        wx.setStorageSync('endTimeArray', times);
        that.setData({
            serviceEnd:times,
            serviceEndIndex:100
        });
    },
    //套餐列表获取
    taocan:function(){
        var that = this;

        var serviceCode = wx.getStorageSync('serviceCode');
        var city_Code = wx.getStorageSync('cityCode');
        var userId = wx.getStorageSync("userId");
        var swx_session=wx.getStorageSync("wx_session")

        //var userId = '14302';//修改

        var dt = {
            'function': 'selectPrice',
            'role_code': '002',
            'service_code': serviceCode,
            'title_code': '',
            'city_code': city_Code,
            'userId': userId,
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
                    var taocanString = [], professionArr = [];
                    for (var i = 0; i < res.data.length; i++) {
                        var _Code = res.data[i].code;
                        var count = res.data[i].times,
                            price = res.data[i].value;
                        var taocanitem = price + '元/' + count + '次';
                        taocanString.push(taocanitem);
                        professionArr.push(_Code);
                    }
                    wx.setStorageSync('taocan', taocanString);
                    wx.setStorageSync('professionArr', professionArr);
                    that.setData({
                        taocanList:taocanString,
                        taocanIndex:res.data.length+1,
                        professionArr:professionArr
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
                        dialogMsg:res.message
                    });
                }
            },
            fail: function() {
            // fail
            },
            complete: function() {
            // complete
            }
        });

    },
    //未选择地址，点击服务日期、弹框提示
    addressNo:function(){
        this.setData({
            dialogBlen:false,
            dialogMsg:'请选择服务地址'
        });
    },
    //未选择服务日期，点击开始时间时，错误提示
    dateNo:function(){
        this.setData({
            dialogBlen:false,
            dialogMsg:'请选择服务日期'
        });
    },
    //未选择开始时间，点击结束时间时，错误提示
    startTimeNo:function(){
        this.setData({
            dialogBlen:false,
            dialogMsg:'请选择开始时间'
        });
    },
    
    //服务日期picker选择
    bindPickerChange:function(e){
        var that = this;
        if(e.detail.value == this.data.serviceDateIndex){
            return;
        }
        var current = that.data.serviceDate[e.detail.value];
        wx.setStorageSync('dateIndex', e.detail.value);//服务日期存储
        
        that.getTime(current);
        this.setData({
            serviceDateIndex:e.detail.value,
        });
    },
    //开始时间picker选择
    bindPickerChangeStart:function(e){
        var that = this;
        if(e.detail.value == this.data.serviceStartIndex){
            return;
        }
        //获取开始时间：YY-MM-DD HH:00
        var date = this.data.serviceDate[this.data.serviceDateIndex];
        date = date.split(" ")[0];
        var yearMon = date.split("年");
        var years = yearMon[0];
        var monthDay = yearMon[1].split('月');
        var month = monthDay[0];
        var day = monthDay[1].split('日')[0];

        var current = that.data.serviceStart[e.detail.value];

        var etimes = years+'-'+month+'-'+day+' '+current;
        wx.setStorageSync('startTimeIndex', e.detail.value);//开始时间存储
        wx.setStorageSync('stime', etimes);
        that.getTimeEnd(current);
        this.setData({
            serviceStartIndex:e.detail.value
        });
    },
    //结束时间picker选择
    bindPickerChangeEnd:function(e){
        var that = this;
        //获取结束时间：YY-MM-DD HH:00
        var date = this.data.serviceDate[this.data.serviceDateIndex];
        var yearMon = date.split("年");
        var years = yearMon[0];
        var monthDay = yearMon[1].split('月');
        var month = monthDay[0];
        var day = monthDay[1].split('日')[0];
        var current = that.data.serviceEnd[e.detail.value];
        var etimes = years+'-'+month+'-'+day+' '+current;

        wx.setStorageSync('endTimeIndex', e.detail.value);//结束时间存储
        wx.setStorageSync('etime', etimes);
        this.setData({
            serviceEndIndex:e.detail.value,
        });
    },
    //套餐picker选择
    bindPickerChangeTaocan:function(e){
        var _taocan = this.data.taocanList[e.detail.value];
        var _price = _taocan.split("元")[0];
        var _times ;
        if(_taocan.indexOf('普通')>-1){
            _times = _taocan.split(" ")[1].split("次")[0];
        }else{
            _times = _taocan.split("/")[1].split("次")[0];
        }
        var _professionCode = this.data.professionArr[e.detail.value];
        wx.setStorageSync('taocanIndex', e.detail.value);//结束时间存储
        wx.setStorageSync('price', _price);
        wx.setStorageSync('times', _times);
        wx.setStorageSync('professionCode', _professionCode);
        this.setData({
            taocanIndex:e.detail.value,
        });
    },
    //病情描述
    detailChange:function(e){
        wx.setStorageSync('detail', e.detail.value);
        this.setData({
            details:e.detail.value,
        });
    },
    //是否有工具
    radioCheckTool:function(e){
        wx.setStorageSync('tool', e.detail.value);
        var _needTools;
        if(e.detail.value=='0'){
            _needTools = '1';
        }else{
            _needTools = '0';
        }
        wx.setStorageSync('needTools', _needTools);
        this.setData({
            tool:e.detail.value,
        });
    },
    //是否有药品
    radioCheckDrugs:function(e){
        wx.setStorageSync('drugs', e.detail.value);
        this.setData({
            drugs:e.detail.value
        });
    },
    //下单获取弹框内容
    serviceText:function(){
        var that = this;
        var firSvCode = wx.getStorageSync('serviceCode');
        var userId = wx.getStorageSync('userId');
        //var firSvCode = '002'//修改
        var dt={
            "function":"getServiceText",
            "roleCode":"002",
            "firSvCode":firSvCode,
            // 'login_userId_base': userId,
            // '_validate':'1',

            'login_userId_base': userId,

            'version': version,
            'newversion': newversion,
            'source':source,
            "sid": sid
        };
        wx.request({
            url: ajaxUrls,
            data: {'encryption':false,"data": JSON.stringify(dt)},
            method: 'POST', 
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            success: function(result){
                var res = result.data;
                if(res.code=='0000'){
                    that.setData({
                        contentText:res.data.content,
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        dialogMsg:res.message,
                    });
                }
            }
        }); 
    },
    //点击立即支付按钮
    goToContent:function(){
        if(this.data.tool=="0"){
            var msg = this.data.contentText;
            this.setData({
                contentTextBlen:true,
                dialogMsg:msg,
                dialogBlen:false
            });
        }else{
            this.goPay();
        }
    },
    //下单
    goPay:function(){
        var that = this;
        var hasClick = this.data.submitBlen;
        if(hasClick){
            return;
        }
        this.setData({
            submitBlen:true
        });
        
        var userid = wx.getStorageSync("userId");
        //var userid = "11623";//修改

        var serviceCode = wx.getStorageSync('serviceCode');
        var price = wx.getStorageSync("price");
        var counts = wx.getStorageSync("times");
        var professionCode = wx.getStorageSync("professionCode");

        var address = wx.getStorageSync("address");
        var AddressId = wx.getStorageSync("addressId");
        var lon = wx.getStorageSync("lon");
        var lat = wx.getStorageSync("lat");
        var slect_cityCode = wx.getStorageSync("cityCode");

        var stime = wx.getStorageSync("stime");
        var etime = wx.getStorageSync("etime");
        
        var des = wx.getStorageSync("detail");
        var Tool = wx.getStorageSync("tool");
        var Med = wx.getStorageSync("drugs");
        var needTools = wx.getStorageSync("needTools");

        var parentId = that.data.patient.patientId;
        //var parentId = '532890';//修改
        var swx_session=wx.getStorageSync("wx_session");

        var dt = {
            'function': 'subscribe',
            'userid': userid,//用户ID
            'userName': userid,//订单发起人姓名
            'targetUserId': '',//目标用户ID
            'roleType': '002',//订单角色类型
            'service': serviceCode,//服务编号
            'orderType': '1',//预约类型

            'price': price,//价格
            'offerPrice': price,//套餐价格
            'times': counts,//预约次数
            'professionCode': professionCode,//职称代码

            'longitude': lon,//经度
            'latitude': lat,//纬度
            'address': AddressId.toString(),//地址ID
            'cityCode': slect_cityCode,//城市代码

            'description': des,//病情描述
            'serviceTimeStart': stime+':00',//预约服务开始时间
            'serviceTimeEnd': etime+':00',//预约服务结束时间
            
            'checkStatus': '0',//是否在医院就诊过

            'patientArchivesId': parentId.toString(),//患者档案ID

            'picture1': '',//图片地址
            'picture2': '',
            'needTools': needTools,//是否需要护士自带工具
            'isHasTool': Tool,//是否有输液工具  0否 1是
            'isHasMedicina': Med,//是否有必备药品  0否 1是
            
            'addedServicePrice': '',//增值服务价格

            'login_userId_base': userid,
            // '_validate':'1',
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
                        submitBlen:false,
                        contentTextBlen:false
                    });
                    //wx.setStorageSync('orderId', res.data.orderId);
                    wx.redirectTo({
                      url: '/pages/pay/pay?orderId='+res.data.orderId
                    });
                }else if(res.code=='0502'){
                    /*that.setData({
                        dialogBlen:false,
                        dialogMsg:'登录异常，请重新登录',
                        submitBlen:false,
                        contentTextBlen:false
                    });*/
                    wx.redirectTo({
                      url: '/pages/login/login'
                    });
                }else{
                    that.setData({
                        dialogBlen:false,
                        dialogMsg:res.message,
                        submitBlen:false,
                        contentTextBlen:false
                    });
                }
            }
        });
    },
    //点击空白弹框消失
    modalChange:function(){
        this.setData({
            dialogBlen:true
        });
    },
    //点击弹框确定
    modalChangeSubmit:function(){
        var blen = this.data.contentTextBlen;
        if(blen){
            this.goPay();
        }
        this.setData({
            dialogBlen:true
        });
    },
})