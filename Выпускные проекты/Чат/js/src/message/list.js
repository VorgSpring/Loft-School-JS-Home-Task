'use strict';
// Конструктор для отрисовки одного сообщения
var Message = require('./message');
// Общие функции
var utilities = require('../utilities');

/**
 * Хранит список сообщений
 * @type {Array}
 */
var renderedMessages = [];

/**
 * Контейнер для сообщений
 * @type {HTMLElement}
 */
var container = document.querySelector('.messages__items');

// Модуль для работы со списком сообщений
module.exports = {
    /**
     * Добавляет новое сообщение
     * @param {object} data
     */
    addMessage: function (data) {
        renderedMessages.push(new Message(data, container));
    },

    /**
     * Отрисовывает все сообщения
     * @param {Array} messagesList
     */
    renderAllMessage: function (messagesList) {
        messagesList.forEach(function (message) {
            renderedMessages.push(new Message(message, container));
        });
    },

    /**
     * Меняет имя у пользователя с данным id
     * @param {number} id
     * @param {string} name
     */
    changeName: function (id, name) {
        renderedMessages.forEach(function (message) {
            if (message.id === id) {
                message.element.name.textContent = name;
            }
        });
    },

    /**
     * Меняет фото у пользователя с данным id
     * @param {number} id
     * @param {string} photo
     */
    changePhoto: function (id, photo) {
        renderedMessages.some(function (message) {
            if (message.id === id) {
                utilities.loadImage(message.element.contentImage, photo);
                return true;
            }
        });
    }
};

