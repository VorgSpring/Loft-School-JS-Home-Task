'use strict';

/**
 * Шаблон для элемента списка online пользователей
 * @type {HTMLElement}
 */
var templateElement = document.querySelector('#info-template');

/**
 * content элемента templateElement
 * @type {HTMLElement}
 */
var elementToClone;

// Если браузер не поддерживает тег 'template'
if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.info__item');
} else {
    elementToClone = templateElement.querySelector('.info__item');
}

/**
 * Создаёт объект element на основе шаблона templateElement
 * @return {Object} element
 */
var get = function() {
    // Возвращаем клонированный шаблонный элемент
    return elementToClone.cloneNode(true);
};

module.exports = get;
