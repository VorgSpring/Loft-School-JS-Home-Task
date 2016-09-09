'use strict';
// Общие функции
var utilities = require('../utilities');

/**
 * Создание DOM-разметки в element
 * @param {HTMLElement} element
 * @param {Object} data
 */
module.exports = function(element, data) {
    if(data.photo !== '') {
        utilities.loadImage(element.contentImage, data.photo);
    }
    element.name.textContent = data.name;
    element.date.textContent = utilities.getFormattedDate(data.date);
    element.content.textContent = data.text;
};


