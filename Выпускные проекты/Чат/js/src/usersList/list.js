'use strict';
// Конструктор для отрисовки online пользователя
var UserOnline = require('./online');

/**
 * Хранит список online пользователей
 * @type {Array}
 */
var usersOnline = [];

/**
 * Контейнер для списка online пользователей
 * @type {HTMLElement}
 */
var container = document.querySelector('.info__items');

/**
 * Контейнер для отображения количества online пользователей
 * @type {HTMLElement}
 */
var counterUsers = document.querySelector('.info__users span');

// Модуль для работы со списком пользователей
module.exports = {
    /**
     * Добавляет пользователя
     * @param {string} name
     * @param {number} id
     */
    addUser: function (name, id) {
        usersOnline.push(new UserOnline(name, id, container));
        counterUsers.textContent = usersOnline.length;
    },

    /**
     * Отрисовывает всех online пользователей
     * @param {Array} usersList
     */
    renderAllUsersOnline: function (usersList) {
        usersList.forEach(function (user) {
            usersOnline.push(new UserOnline(user.name, user.id, container));
        });
        counterUsers.textContent = usersOnline.length;
    },

    /**
     * Удаляет пользователя с данным id
     * @param {number} id
     */
    deleteUser: function (id) {
        usersOnline.some(function (user) {
            if(user.id === id){
                user.remove();
                usersOnline.exterminate(user);
                return true;
            }
        });
    }
};

/**
 * Удаляет из массива элемент по его значению
 * @param {object} value
 */
Array.prototype.exterminate = function (value) {
    this.splice(this.indexOf(value), 1);
};