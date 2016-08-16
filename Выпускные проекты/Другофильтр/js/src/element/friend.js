'use strict';

/**
 * Создаёт объект element на основе шаблона templateElement
 * @return {Object} element
 */
var getElement = require('./getElement').getElement;

/**
 * Возвращает контейнер для element, с учетом того, что выбран element или нет
 * @param {boolean} select
 * @return {HTMLElement} container
 */
var getContainer = require('./getElement').getContainer;

/**
 * Создание DOM-разметки в element
 * @param {HTMLElement} element
 * @param {Object} data
 */
var fillElement = require('./fillElement');

/**
 * Конструктор для отрисовки одного друга в списке
 * @param {Object} data
 * @param {number} number
 * @param {boolean} selected
 * @constructor
 */
var Friend = function (data, number, selected) {
    this.data = data;
    this.element = getElement();
    this.number = number;
    this.selected = selected || false;
    this.container = getContainer(this.selected);
    fillElement(this.element, this.data);
    this.create.call(this, this.container);
    this.element.btn.addEventListener('click', this.onClick.bind(this));
};

Friend.prototype= {
    /**
     * Обработчик клика по кнопке
     */
    onClick: function () {
        this.selected = !this.selected;
        this.container = getContainer(this.selected);
        this.create(this.container, this.container.children[this.number]);
    },

    /**
     * Добавляет element в container
     * @param {HTMLElement} container
     * @param {HTMLElement} nextSibling
     */
    create: function (container, nextSibling) {
        nextSibling = nextSibling || null;
        container.insertBefore(this.element, nextSibling);
    }
};

module.exports = Friend;
