/**
  * 生命周期函数--监听页面加载
  */
var app = getApp();
var that = this;
var login = function () {
  wx.login({
    success: function (res) {
      app.globalData.code = res.code;//登录凭证
      if (app.globalData.code) {
        wx.getUserInfo({
          success: function (res) {
            wx.showLoading({
              title: '登陆中...',
            })
            app.globalData.encryptedData = res.encryptedData
            app.globalData.iv = res.iv
            console.log('[INFO] app.js/ ', { encryptedData: res.encryptedData, iv: res.iv, code: app.globalData.code })
            //3.请求自己的服务器，解密用户信息 获取用户此次登录唯一登录态验证身份
            wx.request({
              url: getApp().globalData.address + '/login',//自己的服务接口地址
              method: 'POST',
              header: {
                "Content-Type": "applciation/json"
              },
              data: { encryptedData: res.encryptedData, iv: res.iv, code: app.globalData.code },
              success: function (data) {
                //4.解密成功后 获取自己服务器返回的结果
                console.log(data);
                if (data.data.status == 1) {
                  app.globalData.login = data.data.login;
                  console.log('[INFO] app.js/ login:', app.globalData.login)
                } else {
                  console.log('[INFO] app.js/ 解密失败')
                }
                wx.hideLoading({
                  success: (res) => { },
                })
              },
              fail: function () {
                console.log('[INFO] app.js/ 系统错误')
                wx.hideLoading({
                  success: (res) => { },
                })
              }
            })
            wx.hideLoading({
              success: (res) => { },
            })
            wx.reLaunch({
              url: '/pages/index/index'
            })
          },
          fail: function () {
            console.log('[INFO] app.js/ 获取用户信息失败')
            wx.hideLoading({
              success: (res) => { },
            })
          }
        })
      } else {
        console.log('[INFO] app.js/ 获取用户登录态失败！' + r.errMsg)
        wx.hideLoading({
          success: (res) => { },
        })
      }
    }
  })
};


Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  onLoad: function (res) {
    var that = this;
    //查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          login();
          console.log("用户授权了");
        } else {
          //用户没有授权
          console.log("用户没有授权");
        }
      }
    });
  },
  bindGetUserInfo: function (res) {
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(res.detail.userInfo);
      //授权成功后跳转
      login();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法同步积分信息!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  goindex: function (res) {
    debugger;
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})