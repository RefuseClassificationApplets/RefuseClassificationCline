var app = getApp();
Page({
  data: {
    totalScore: null, // 分数
    wrongList: [], // 错误的题数-乱序
    wrongListSort: [],  // 错误的题数-正序
    chooseValue: [], // 选择的答案
    remark: ["好极了！你很棒棒哦", "哎哟不错哦", "别灰心，继续努力哦！"], // 评语
    modalShow: false
  },
  onLoad: function (options) {
    const that = this;

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('question', { data: 'test' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('question', function (data) {
      that.setData({
        questionList: data.data
      })
      let wrongList = JSON.parse(options.wrongList);
      let wrongListSort = JSON.parse(options.wrongListSort);
      let chooseValue = JSON.parse(options.chooseValue);
      that.setData({
        totalScore: options.totalScore != "" ? options.totalScore : "无",
        wrongList: wrongList,
        wrongListSort: wrongListSort,
        chooseValue: chooseValue,
        testId: options.testId  // 课程ID
      })
      let yes = [];
      let no = [];
      for (var i = 0; i < that.data.questionList.length; i++) {
        if (that.data.wrongList.includes(i))
          no.push(that.data.questionList[i].id);
        else
          yes.push(that.data.questionList[i].id);
      }
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取用户数据
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                wx.request({
                  url: app.globalData.address + '/complate',
                  method: 'POST',
                  data: {
                    yes: yes,
                    no: no,
                    login: app.globalData.login
                  }
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '请授权登录，否则无法同步数据',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      })
    })
  },
  // 查看错题
  toView: function () {
    // 显示弹窗
    this.setData({
      modalShow: true
    })
  },
  // 返回首页
  toIndex: function () {
    wx.switchTab({
      url: '../../index/index'
    })
  }
})