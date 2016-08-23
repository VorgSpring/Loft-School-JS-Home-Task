var Model = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function() {
        return this.callApi('users.get', {});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', {fields: 'photo_100'});
    },
    getNews: function() {
        return this.callApi('newsfeed.get', {filters: 'post', count: 20});
    },
    getGroup: function() {
        return this.callApi('groups.get', {extended: 1, fields: 'photo_100,activity,members_count', v: 5.53});
    },
    getPhotos: function() {
        return new Promise (function (resolve) {
            var albums = {};
            Model.callApi('photos.getAlbums', {need_system: 1,  v: 5.53}).then(function (photosAlbums) {
                albums = photosAlbums.items.map(function (photosAlbum) {
                    return {
                        id: photosAlbum.id,
                        title: photosAlbum.title
                    }
                });

                albums.forEach(function (album, i) {
                    setTimeout(function () {
                        Model.callApi('photos.get', {extended: 1, album_id: album.id, v: 5.53}).then(function (photosItems) {
                            album.photos = photosItems.items.map(function (photosItem) {
                                return {
                                    id: photosItem.id,
                                    src: photosItem.photo_604,
                                    likes: photosItem.likes.count,
                                    reposts: photosItem.reposts.count,
                                    data: photosItem.date
                                }
                            });
                            if(album.photos.length === 0) {
                                delete albums[i];
                            } else {
                                album.photos.forEach(function (photo) {
                                    setTimeout(function () {
                                        Model.callApi('photos.getComments', {extended: 1, photo_id: photo.id, fields: 'photo_50', v: 5.53}).then(function (photosComments) {
                                            photo.comments = photosComments.items.map(function (photosComment) {
                                                var from;
                                                photosComments.profiles.forEach(function (profile) {
                                                    if(profile.id === photosComment.from_id)
                                                        from = profile;
                                                });
                                                return {
                                                    text: photosComment.text,
                                                    from: from
                                                }
                                            });
                                            photo.comments_count = photosComments.count || 0;
                                        });
                                    }, 100);

                                });
                            }
                        });
                    }, 100)

                });

                // до конца не понимаю почему так, видимо асинхронность хромает, она хорошая, но почему то хромает)))
                setTimeout(function () {
                    resolve(albums);
                }, 5000);

                    /*
                     Вот такая получается структура возвращаемого объекта

                     albums: {
                         title,
                         id,
                         photo: {
                             src,
                             likes,
                             reports,
                             data,
                             comments: {
                                 count,
                                 item: {
                                     text,
                                     from: {
                                         photo_50,
                                         first_name,
                                         last_name
                                     }
                                 }
                             }
                         }
                     }
                     */
            });
        })
    }
};