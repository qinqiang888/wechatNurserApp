var util = require('../../utils/util.js');
var app = getApp();
var ajaxUrl = app.globalData.requestUrl,
 sid = app.globalData.sid,
  newversion = app.globalData.newversion,
  version = app.globalData.version,
  userid = wx.getStorageSync('userId'),
  source = app.globalData.source;
Page({
    data: {
        hidden: false,
        patientId:wx.getStorageSync('patientId'),
        AddPatientList: '',
        edit: false
    },
    edit: function (e) {
        this.setData({
            edit: true
        })
    },
    over: function () {
        this.setData({
            edit: false
        })
    },
    selectPatient: function () {
        var _this = this
        var userid = _this.data.userid;
        var swx_session=wx.getStorageSync("wx_session")
        var dt = {
            'function': 'selectPatientInfoById',
            'login_userId_base':userid,
            'userid': userid,
            'sid': sid,
            'newversion': newversion,
            "version": version,
            "source":source,
            "swx_session":swx_session
        };
        wx.request({
            url: ajaxUrl,
            data: { "encryption": false, "data": JSON.stringify(dt) },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                if(res.data.code=="0000"){
                    _this.setData({ AddPatientList: res.data.data });
                }else if(res.data.code=="0502"){
                    //util.wxshowModal(res.data.message,false)
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                }else{
                    util.wxshowModal(res.data.message,false)
                }
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    delPatient: function (e) {
        var _this = this;
        var ids = e.target.dataset.id.toString();
        var swx_session=wx.getStorageSync("wx_session");
        var dt = {
            "function": "deletePatientInfoById",
            "ID": ids,
            'sid': sid,
            'newversion':newversion,
            "version": version,
            "source":source,
            "swx_session":swx_session
        }
        wx.request({
            url: ajaxUrl,
            data: { "encryption": false, "data": JSON.stringify(dt) },
            method: 'POST', 
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 设置请求的 header
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == "0000") {
                    _this.selectPatient();
                }else if(res.data.code=="0502"){
                    //util.wxshowModal(res.data.message,false)
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                }else{
                    util.wxshowModal(res.data.message,false)
                }
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
    },
    addPatient: function () {
        wx.redirectTo({ url: "/pages/patient/patient"})
    },

    order: function (e) {
        console.log(e)
        var setsex,objUserInfo;
        if (e.target.dataset.sex == '0') {
            setsex = '男';
        }else{
            setsex = '女';
        }
        objUserInfo = {
            'ID': e.target.dataset.ID,
            'relationship': e.target.dataset.ship,
            'card': e.target.dataset.card,
            'name': e.target.dataset.name,
            'age': e.target.dataset.age,
            'patientId': e.target.dataset.id,
            'sex': setsex
        }
        wx.setStorageSync('patientId', e.target.dataset.id);
        wx.setStorageSync('objUserInfo', objUserInfo);
        wx.redirectTo({
            url: "/pages/order/order"
        })
    },
    onLoad: function (options) {
        this.setData({
            patientId:wx.getStorageSync('patientId'),
            userid:wx.getStorageSync("userId")
        });
        
        this.selectPatient();
        //console.log(wx.getStorageSync('patientId'));
    }
})