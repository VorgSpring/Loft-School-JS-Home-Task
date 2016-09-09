'use strict';
// Общие функции
var utilities = require('../utilities');

// Создаёт объект element на основе шаблона templateElement
var getElement = require('./element');

// Создание DOM-разметки в element
var fillElement = require('./fillElement');

/**
 * Конструктор для отрисовки одного сообщения
 * @param {object} data
 * @param {HTMLElement} container
 * @constructor
 */
var Message = function(data, container) {
    this.id = data.id;
    this.element = getElement();
    fillElement(this.element, data);
    utilities.insert(this.element, container);
};

module.exports = Message;
