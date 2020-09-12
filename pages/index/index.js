//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //轮播图
    imgUrls: [],
    hUrls: [],
    top: [],
    logo: app.globalData.address+'/static/logo.jpg',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    toptitle: "top10",
    desc: true
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: app.globalData.address+'/getWideBanner',
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        that.setData({
          imgUrls:res.data.data
        })
      }
    })
    wx.request({
      url: app.globalData.address+'/gettop',
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        that.setData({
          top:res.data.data
        })
      }
    })
    wx.request({
      url: app.globalData.address+'/getHBanner',
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        that.setData({
          hUrls:res.data.data
        })
      }
    })
  },
  wd1: function () {
    wx.navigateTo({
      url: '../question/test/test?level=1'
    })
  },
  wd2: function () {
    wx.navigateTo({
      url: '../question/test/test?level=2'
    })
  },
  wd3: function () {
    wx.navigateTo({
      url: '../question/test/test?level=3'
    })
  },
})
