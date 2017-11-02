//index.js
//获取应用实例
var app = getApp()
var url= app.globalData.requestUrl,
 sid = app.globalData.sid,
 userid = wx.getStorageSync('userId'),
  newversion = app.globalData.newversion,
  version = app.globalData.version,
  source = app.globalData.source;
Page({
  data: {
    array: ['自己', '爸爸', '妈妈', '亲戚', '朋友', '孩子', '其他'],
    objectArray: [{ id: 0, name: "自己" }, { id: 1, name: "爸爸" }, { id: 2, name: "妈妈" }, { id: 3, name: "亲戚" }, { id: 4, name: "朋友" }, { id: 5, name: "孩子" }, { id: 6, name: "其他" }],
    index: 8,
    focus: false,
    nameVal: '',
    carVal: '',
    sex_v: '',
    relationship_v: '',
    //是否错误弹框，true为隐藏弹框
    dialogBlen: true,
    //错误弹框msg
    dialogMsg: ''
  },

  bindblur: function (e) {
    this.setData({
      nameVal: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      carVal: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
    const _this = this;
    const len = this.data.objectArray.length;
    for (let i = 0; i < len; ++i) {
      if (e.detail.value == i) {
        _this.data.relationship_v = _this.data.objectArray[i].name;
      }
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.data.sex_v = e.detail.value;
    this.setData({
      sex_v: e.detail.value,
    });
  },
  /*保存档案 */
  tapSave: function (event) {
    var $this = this;
    if (this.data.nameVal == '') {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请输入姓名'
      });
      return;
    }
    if (this.data.carVal == '') {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请输入身份证'
      });
      return;
    }
    if (!this.data.sex_v) {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请选择性别'
      });
      return;
    }
    if (!this.data.relationship_v) {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请选择患者关系'
      });
      return;
    }
    // 身份证正则
    var cardreg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
    // 中文正则
      regname = /^[\u4e00-\u9fa5]*$/,
      name = this.data.nameVal,
      idCar = this.data.carVal,
      sex = this.data.sex_v,
      relationship = this.data.relationship_v,
      myDate = new Date(),
      month = myDate.getMonth() + 1,
      day = myDate.getDate(),
      age;
      // 验证是否是中文格式
    if (!regname.test(name)) {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请输入中文格式姓名'
      });
      return;
    }
    // 验证身份证格式
    if (!cardreg.test(idCar)) {
      $this.setData({
        dialogBlen: false,
        dialogMsg: '请输入正确身份证号'
      });
      return;
    }
    if (idCar) {
      //算出年龄
      age = (myDate.getFullYear() - idCar.substring(6, 10)).toString();
    }
    //发起请求
    var swx_session=wx.getStorageSync("wx_session");
    var userid = $this.data.userid;
    var dt = {
      'function': 'savePatientInfo',
      'userid': userid,
      'login_userId_base':userid,
      'realname': '',
      'sex': '',
      'age': '',
      'relationship': '',
      'idCardNo': '',
      'sid': sid,
      'newversion':newversion,
      "version":version,
      "source":source,
      "swx_session":swx_session
    }
    dt.realname = name;
    dt.idCardNo = idCar;
    dt.sex = sex;
    dt.age = age;
    dt.relationship = relationship;
    wx.request({
      url:url,
      data: { "encryption": false, "data": JSON.stringify(dt) },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == "0000") {
          wx.redirectTo({
            url: '/pages/selectPatientList/selectPatientList',
            success: function(res){
              // success
              console.log('跳转成功！！');
            }
          })
        }else if(res.data.code == '0502') {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }else{
           $this.setData({
              dialogBlen: false,
              dialogMsg: res.data.message
            });
        }
      }
    })

  },
  //弹框消失
  modalChange: function () {
    this.setData({
      dialogBlen: true
    });
  },
    onLoad: function () {
    // wx.clearStorage()
    var that = this
     //更新数据
      that.setData({
         userid : wx.getStorageSync('userId')
      })
  }
})