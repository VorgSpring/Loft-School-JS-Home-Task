'use strict';

/**
 * Шаблон для элемента списка online пользователей
 * @type {HTMLElement}
 */
var templateElement = document.querySelector('#messages-template');

/**
 * content элемента templateElement
 * @type {HTMLElement}
 */
var elementToClone;

// Если браузер не поддерживает тег 'template'
if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.messages__item');
} else {
    elementToClone = templateElement.querySelector('.messages__item');
}

/**
 * Создаёт объект element на основе шаблона templateElement
 * @return {Object} element
 */
module.exports = function() {
    // Клонируем шаблонный элемент
    var element = elementToClone.cloneNode(true);
    element.contentImage = element.querySelector('.messages__photo img');
    element.name = element.querySelector('.messages__name');
    element.date = element.querySelector('.messages__date');
    element.content = element.querySelector('.messages__content');
    return element;
};
