'use strict';
// Общие функции
var utilities = require('../utilities');

/**
 * Хранит данные о пользователе
 * @type {object}
 */
var user = {
    /**
     * ID пользователя
     * @type {number}
     */
    id: '',

    /**
     * Имя пользователя
     * @type {string}
     */
    name: '',

    /**
     * Login пользователя
     * @type {string}
     */
    login: '',

    /**
     * путь до фото пользователя
     * @type {string}
     */
    photo: '',

    /**
     * Контейнер с фото пользователя
     * @type {HTMLElement}
     */
    photoContainer: document.querySelector('.info__photo img'),

    /**
     * Контейнер с именем пользователя
     * @type {HTMLElement}
     */
    nameContainer: document.querySelector('.info__name'),

    /**
     * Меняет фото у пользователя
     * @param {string} photo
     */
    changePhoto: function (photo) {
        this.photo = photo;
        utilities.loadImage(this.photoContainer, photo);
    }
};

module.exports = user;