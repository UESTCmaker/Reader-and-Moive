// pages/movies/movie-detail/movie-detail.js
import {Movie} from 'class/Movie.js';
var app = getApp();
Page({
  data:{
    movie: {}
  },
  onLoad:function(options){
    var movieId = options.id;
    var detailurl =  app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(detailurl);
    var that = this;
    movie.getMovieData(function(movie){
          that.setData({
      movie:movie
    });
    });

  }
})