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
    getAlbums: function() {
        return this.callApi('photos.getAlbums', {need_system: 1,  v: 5.53});
    },
    getPhotos: function(album_id) {
        return this.callApi('photos.get', {extended: 1, album_id: album_id, v: 5.53});
    },
    getCommits: function (photo_id) {
        return this.callApi('photos.getComments', {extended: 1, photo_id: photo_id, fields: 'photo_50', v: 5.53});
    }
};