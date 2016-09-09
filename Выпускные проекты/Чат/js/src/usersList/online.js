'use strict';
// Общие функции
var utilities = require('../utilities');

// Создаёт объект element на основе шаблона templateElement
var getElement = require('./element');

/**
 * Конструктор для отрисовки online пользователя
 * @param {string} name
 * @param {number} id
 * @param {HTMLElement} container
 * @constructor
 */
var OnlineUser = function(name, id, container) {
    this.name = name;
    this.id = id;
    this.element = getElement();
    this.element.textContent = this.name;
    utilities.insert(this.element, container);
};

/**
 * Удаляет елемент
 */
OnlineUser.prototype.remove = function () {
    utilities.delete(this.element);
};

module.exports = OnlineUser;