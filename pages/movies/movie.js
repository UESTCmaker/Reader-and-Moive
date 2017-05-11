// pages/movies/movie.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {movies:{}},
    containerShow: true,
    searchPanelShow: false,
    dataurl: "",
    isEmpty: true,
    count: 0,
    placeholdertext:"降临、星际旅行",
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters");
    this.getMovieListData(comingSoonUrl, "comingSoon");
    this.getMovieListData(top250Url, "top250");

  },

  getMovieListData: function (url, settedkey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        var movies = res.data;
        console.log(movies);
        that.processDoubanData(movies, settedkey);
      },
      fail: function () {
        console.log("failed");
      }
    })
  },

  processDoubanData: function (moviesDouban, settedkey) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var stars = subject.rating.stars;
      var starArray = util.convertTostarsArray(stars);
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
    var category;
    if (settedkey == "inTheaters") { category = "正在上映"; }
    else if (settedkey == "comingSoon") { category = "即将上映"; }
    else if (settedkey == "top250") { category = "热门电影250"; }

    if (settedkey == "searchResult") {
      category = "搜索结果";
      if (!this.data.isEmpty) {
        movies = this.data.searchResult.movies.concat(movies);
      }
      else {
        this.data.isEmpty = false;
      }
    }
      var readyData = {};
      readyData[settedkey] = {
        movies: movies,
        category: category
      };
      this.setData(readyData);
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/more-movies/more-movies?category=' + category,
      success: function (res) {
        // success
      }
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    })
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      isEmpty: true,
      placeholdertext:"",
    })
  },
  onBindConfirm: function (event) {
   this.setData({searchResult:{}, isEmpty:true});
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.data.dataurl = searchUrl;
    this.getMovieListData(searchUrl, "searchResult");
    this.data.count = 20;
  },
  lower: function (event) {
    var dataurl = this.data.dataurl + "&start=" + this.data.count + "&count=20";
    this.getMovieListData(dataurl, "searchResult");
    this.data.count += 20;
  },
  onMovieTap: function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+ id,
      success: function(res){
      }
    })
  }
})