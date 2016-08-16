'use strict';

/**
 * Фунция отображения списка друзей
 * @param {Array.<Object>} friends
 * @return {Array.<Object>} renderedFriends
 */
var renderFriends = require('./element/renderFriends');

/**
 * Хранит список друзей
 * @type {Array.<Object>}
 */
var renderedFriends = [];

/**
 * Модуль поиска
 */
var search = require('./search');

/**
 * Модуль сохранения текущего состояния списка
 */
var save = require('./save');

/**
 * Модуль Drag'n'Drop
 */
var dragManager = require('./dragManager');


new Promise(function(resolve) {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function() {
    return new Promise(function(resolve, reject) {
        VK.init({
            apiId: 5582471
        });

        VK.Auth.login(function(response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}).then(function() {
    return new Promise(function (resolve, reject) {
        VK.api('friends.get', {'fields': 'photo_50', 'v': '5.53'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response);
            }
        });
    })
}).then(function (response) {
    var friends = response.response.items;
    // Отрисовываем и сохраняем список друзей
    renderedFriends = renderFriends(friends);

    // Подключаем модули

    // Модуль поиска
    search(renderedFriends);

    // Модуль сохранения текущего состояния списка
    save(renderedFriends);

    // Модуль Drag'n'Drop
    dragManager();

}, function() {
    alert('Ошибка!')
});


