var postsData = require('../../../data/post-data.js');
var app = getApp();
Page({
  data: {
    collectionFlag: false,
    commentFlag: false,
    isPlayingMusic: false
  },
  onLoad: function (options) {
    var postId = options.id;
    var postData = postsData.postlist[postId];
    this.setData(postData);
    var collectStat = wx.getStorageSync(postId + '-collection');
    var commentStat = wx.getStorageSync(postId + '-comment');
    this.setData({ collectionFlag: collectStat });
    this.setData({ commentFlag: commentStat });
    if (app.globalData.g_isPlayingMusic == true && app.globalData.g_currentMusicPostId == postId) {
      this.setData({ isPlayingMusic: true });
    }
    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.postId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    })
  },

  onCollectTap: function (event) {
    var control = wx.getStorageSync(this.data.postId + '-collection');
    wx.setStorageSync(this.data.postId + '-collection', !control);
    this.setData({ collectionFlag: !control });
    wx.showToast({
      title: !control ? "点赞成功" : "取消成功",
      icon: "success",
      duration: 1000
    })
  },
  onCommentTap: function (event) {
    var control = wx.getStorageSync(this.data.postId + '-comment');
    wx.setStorageSync(this.data.postId + '-comment', !control);
    this.setData({ commentFlag: !control });
    wx.showToast({
      title: !control ? "评论成功" : "取消成功",
      icon: "success",
      duration: 1000
    })
  },
  onAudioTap: function (event) {
    // wx.showModal({
    //   title: "提示",
    //   content: "音乐播放器启动中",
    //   cancelText: "取消播放",
    //   confirmText: "开始播放",
    //   success: function(res){

    //   }
    // })
    // wx.showActionSheet({
    //   itemList: ["学生", "教职工", "游客"],
    //   success: function(res){
    //     switch(res.tapIndex){
    //       case 0: wx.showToast({title:"学生确认"});break;
    //       case 1: wx.showToast({title:"教职工确认"});break;
    //       case 2: wx.showToast({title:"游客确认"});break;
    //     }

    //   }
    // });
    var isPlayingMusic = this.data.isPlayingMusic;
    if (!isPlayingMusic) {
      wx.playBackgroundAudio({
        dataUrl: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
        title: "此时此刻",
        coverImgUrl: "http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000",
      });
      this.setData({ isPlayingMusic: true });
    }
    else {
      wx.pauseBackgroundAudio({});
      this.setData({ isPlayingMusic: false });
    }
  }
})

