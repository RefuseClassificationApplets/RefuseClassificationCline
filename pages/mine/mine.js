// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: true,
    nickName: "点击头像登录",
    avatarUrl: "",
    jf: '0',
    ts: '0 / 0%',
    showOneButtonDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        var userInfo = res.userInfo
        that.setData({
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          login: false,
        })
      }
    })
      wx.request({
        url: app.globalData.address + '/getzz?login=' + app.globalData.login,
        success: function (res) {
          var data = res.data;
          that.setData({
            jf: data.jf,
            ts: data.cc+' / '+data.sl
          })
        }
      })
  },
  onShow: function(e){
    var that = this;
    if (app.globalData.login != null) {
      wx.request({
        url: app.globalData.address + '/getzz?login=' + app.globalData.login,
        success: function (res) {
          var data = res.data;
          that.setData({
            jf: data.jf,
            ts: data.cc+' / '+data.sl
          })
        },
        fail: function(res){
          var data = res.data;
          that.setData({
            jf: 0,
            ts: '0 / 0.00%'
          })
        }
      })
    }
  },
  tapOneDialogButton(e) {
    this.setData({
      showOneButtonDialog: true
    })
  },
  getUserInfo: function (e) {
    getApp().onLaunch();
    this.setData({
      login: false
    });
    this.onLoad();
  }
})