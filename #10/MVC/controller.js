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
        return Model.getAlbums().then(function(albums) {
            Promise.all(albums.items.map(function(album) {
                return Model.getPhotos(album.id).then(function(photos) {
                    album.photos = photos;
                    return album;
                });
            })).then(function(albums) {
                if(searchName) {
                    switch(searchName) {
                        case 'comments':
                            albums.forEach(function (album) {
                                album.photos.items.sort(function (a, b) {
                                    return b.comments.count - a.comments.count;
                                })
                            });
                            break;
                        case 'repost':
                            albums.forEach(function (album) {
                                album.photos.items.sort(function (a, b) {
                                    return b.repost.count - a.repost.count;
                                })
                            });
                            break;
                        case 'likes':
                            albums.forEach(function (album) {
                                album.photos.items.sort(function (a, b) {
                                    return b.likes.count - a.likes.count;
                                })
                            });
                            break;
                        case 'date':
                            albums.forEach(function (album) {
                                album.photos.items.sort(function (a, b) {
                                    return b.date - a.date;
                                })
                            });
                            break;
                    }
                }
                console.log(albums);
                results.innerHTML = View.render('photos', {list: albums});
            });
        });
    },
    commentsRoute: function (event) {
        var container = event.target.parentNode.querySelector('.comments');

        if(event.target.dataset.visible === 'hidden') {
            event.target.innerHTML = 'Скрыть комментарии';
            event.target.dataset.visible = 'visible';
        } else {
            event.target.innerHTML = 'Показать комментарии';
            event.target.dataset.visible = 'hidden';
        }

        if(container) {
            container.classList.toggle('show');
        } else {
            var photo_id = event.target.dataset.photo;
            return Model.getCommits(photo_id).then(function (comments) {
                var photosComments = comments.items.map(function (comment) {
                    var from;
                    comments.profiles.forEach(function (profile) {
                        if (profile.id === comment.from_id)
                            from = profile;
                    });
                    return {
                        text: comment.text,
                        from: from
                    }
                });

                console.log(photosComments);
                var commentsContainer = View.render('comments', {list: photosComments});
                event.target.parentNode.innerHTML += commentsContainer;
            })
        }
    }
};
