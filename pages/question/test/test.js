var app = getApp();
Page({
  data: {
    toIndex: false, //页面返回主页判断
    index: 0,  // 题目序列
    chooseValue: [], // 选择的答案序列
    totalScore: 100, // 总分
    wrong: 0, // 错误的题目数量
    wrongList: [], // 错误的题目集合-乱序
    wrongListSort: [], // 错误的题目集合-正序
  },
  onLoad: function (options) {
    const that = this;
    //wx.setNavigationBarTitle({ title: options.testId }) // 动态设置导航条标题
    wx.showLoading({
      title: '获取数据中~',
    })
    wx.request({
      url:  app.globalData.address+'/getQuestion?level='+options.level, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        wx.hideLoading();
        that.setData({
          questionList: res.data.data,  // 拿到答题数据
          testId: 'demo'
        })
        let count = that.generateArray(0, that.data.questionList.length-1); // 生成题序
        let num = that.data.questionList.length;  // 102/301-302 试题有20道题
        that.setData({
          shuffleIndex: that.shuffle(count).slice(0, num) // 生成随机题序 [2,0,3] 并截取num道题
        })
      }
    })
  },
  /*
  * 数组乱序/洗牌
  */
  shuffle: function (arr) {
    let i = arr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  },
  /*
  * 单选事件
  */
  radioChange: function(e){
    this.data.chooseValue[this.data.index] = e.detail.value;
  },
  /*
  * 多选事件
  */
  checkboxChange:function(e){
    this.data.chooseValue[this.data.index] = e.detail.value.sort();
  },
  /*
  * 退出答题 按钮
  */
  outTest: function(){
    wx.showModal({
      title: '提示',
      content: '你真的要退出答题吗？',
      success(res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../index/index'
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /*
  * 下一题/提交 按钮
  */
  nextSubmit: function(){
    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {  
      wx.showToast({
        title: '请选择至少一个答案!',
        icon: 'none',
        duration: 2000,
        success: function(){
          return;
        }
      })
      return;
    }

    // 判断答案是否正确
    this.chooseError();

    // 判断是不是最后一题
    if (this.data.index < this.data.shuffleIndex.length - 1) {
      // 渲染下一题
      this.setData({
        index: this.data.index + 1
      })
    } else {
      const that = this;
      let wrongList = JSON.stringify(this.data.wrongList);
      let wrongListSort = JSON.stringify(this.data.wrongListSort);
      let chooseValue = JSON.stringify(this.data.chooseValue);
      wx.navigateTo({
        url: '../results/results?totalScore=' + this.data.totalScore + '&wrongList=' + wrongList + '&chooseValue=' + chooseValue + '&wrongListSort=' + wrongListSort + '&testId=' + this.data.testId,
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('question', { data: that.data.questionList });
          that.setData({
            toIndex: true
          })
        }
      })

      // 设置缓存
      var logs = wx.getStorageSync('logs') || []
      let logsList = { "date": Date.now(), "testId": this.data.testId, "score": this.data.totalScore }
      logs.unshift(logsList);
      wx.setStorageSync('logs', logs);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.toIndex){
      wx.switchTab({
        url: '../../index/index'
      })
    }
  },
  /*
  * 错题处理
  */
  chooseError: function(){
    var trueValue = this.data.questionList[this.data.shuffleIndex[this.data.index]]['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    if (chooseVal.toString() != trueValue.toString()) {
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.shuffleIndex[this.data.index]);
      this.setData({
        totalScore: this.data.totalScore - this.data.questionList[this.data.shuffleIndex[this.data.index]]['scores']  // 扣分操作
      })
    }
  },
  /**
     * 生成一个从 start 到 end 的连续数组
     * @param start
     * @param end
     */
  generateArray: function(start, end) {
    return Array.from(new Array(end + 1).keys()).slice(start)
  }
})