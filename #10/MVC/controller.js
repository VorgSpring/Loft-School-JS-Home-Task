var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupRoute: function() {
        return Model.getGroup().then(function(group) {
            results.innerHTML = View.render('group', {list: group.items});
        });
    },
    photosRoute: function(searchName) {
        return Model.getPhotos().then(function(photos) {
            if(searchName) {
                switch(searchName) {
                    case 'comments':
                        photos.forEach(function (photo) {
                            photo.photos.sort(function (a, b) {
                                return b.comments_count - a.comments_count;
                            })
                        });
                        break;
                    case 'repost':
                        photos.forEach(function (photo) {
                            photo.photos.sort(function (a, b) {
                                return b.repost - a.repost;
                            })
                        });
                        break;
                    case 'likes':
                        photos.forEach(function (photo) {
                            photo.photos.sort(function (a, b) {
                                return b.likes - a.likes;
                            })
                        });
                        break;
                    case 'date':
                        photos.forEach(function (photo) {
                            photo.photos.sort(function (a, b) {
                                return b.date - a.date;
                            })
                        });
                        break;
                }
            }
            results.innerHTML = View.render('photos', {list: photos});
        });
    }
};
