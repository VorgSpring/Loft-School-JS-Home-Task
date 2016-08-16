'use strict';

/**
 * Шаблон для блока с фотографиями
 * @type {HTMLElement}
 */
var templateElement = document.querySelector('template');

/**
 * content элемента templateElement
 * @type {HTMLElement}
 */
var elementToClone;

// Если браузер не поддерживает тег 'template'
if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.friends-filter__item');
} else {
    elementToClone = templateElement.querySelector('.friends-filter__item');
}

/**
 * Создаёт объект element на основе шаблона templateElement
 * @return {Object} element
 */
var getElement = function() {
    // Клонируем шаблонный элемент
    var element = elementToClone.cloneNode(true);
    element.avatar = element.querySelector('.friends-filter__avatar');
    element.surname = element.querySelector('.friends-filter__surname');
    element.name = element.querySelector('.friends-filter__name');
    element.btn = element.querySelector('.friends-filter__btn');
    return element;
};

/**
 * Возвращает контейнер для element, с учетом того, что выбран element или нет
 * @param {boolean} select
 * @return {HTMLElement} container
 */
var getContainer = function (select) {
    var container = null;
    if(select) {
        container = document.querySelector('.friends-filter__items--selected');
    } else {
        container = document.querySelector('.friends-filter__items--all');
    }
    return container;
};

module.exports = {
    getElement: getElement,
    getContainer: getContainer
};
