// pages/movies/more-movies/more-movies.js
var utils = require("../../../utils/util.js");
var app = getApp();
Page({
  data: {
    movies: {},
    count: 0,
    dataurl: "",
    isEmpty: true,
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({ category: category });
    var dataurl = app.globalData.doubanBase;
    switch (category) {
      case "正在上映": dataurl += "/v2/movie/in_theaters"; break;
      case "即将上映": dataurl += "/v2/movie/coming_soon"; break;
      case "热门电影250": dataurl += "/v2/movie/top250"; break;
    }
    this.setData({ dataurl: dataurl });
    utils.http(dataurl, this.callBack);
  },

  callBack: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var stars = subject.rating.stars;
      var starArray = utils.convertTostarsArray(stars);
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: starArray,
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({ 
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();
    this.data.count += 20;
  },

  onReady: function (event) {
    var category = this.data.category;
    wx.setNavigationBarTitle({
      title: category
    })
  },

  lower: function (event) {
    var nexturl = this.data.dataurl + "?start=" + this.data.count + "&count=20";
        wx.showNavigationBarLoading();
    utils.http(nexturl, this.callBack);
  },

  onPullDownRefresh: function(){
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    utils.http(refreshUrl, this.callBack);
    wx.stopPullDownRefresh();
  },
   onMovieTap: function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id='+ id,
      success: function(res){
      }
    })
  }
})