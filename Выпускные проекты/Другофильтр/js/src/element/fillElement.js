'use strict';

/**
 * Создание DOM-разметки в element
 * @param {HTMLElement} element
 * @param {Object} data
 */
var fillElement = function(element, data) {
    element.name.textContent = data.first_name;
    element.surname.textContent = data.last_name;
    var contentImage = element.avatar;
    // Добавляем фото
    var uploadImage = new Image();

    // Обработчик загрузки
    uploadImage.onload = function () {
        uploadImage.onerror = null;
        contentImage.src = data.photo_50;
    };

    // Обработчик ошибки
    uploadImage.onerror = function () {
        uploadImage.onload = null;
        contentImage.src = '';
    };

    uploadImage.src = data.photo_50;
};

module.exports = fillElement;