var postData = require('../../data/post-data.js');

Page({
    data: {
    },
    onLoad: function () {
        var postlist = postData.postlist;
        this.setData({post_key: postlist});
        for(var Id in postlist){
         wx.setStorageSync( postlist[Id].postId + '-collection', false);
         wx.setStorageSync( postlist[Id].postId + '-comment', false);
        }
    },
    onPostTap: function(event){
        var postId = event.currentTarget.dataset.id;
        wx.navigateTo({
          url: '/pages/posts/post-detail/post-detail?id=' + postId
        })
    }
})