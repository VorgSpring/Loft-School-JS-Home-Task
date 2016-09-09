'use strict';

// Общие функции
module.exports = {
    /**
     * Допустимое время загрузки изображения
     * @constant {number}
     */
    LOAD_TIMEOUT: 5000,

    /**
     * Удаляет element из DOM
     * @param {HTMLElement} element
     */
    delete: function (element) {
        element.parentNode.removeChild(element);
    },

    /**
     * Добавляет element в container
     * @param {HTMLElement} element
     * @param {HTMLElement} container
     */
    insert: function (element, container) {
        container.appendChild(element);
    },

    /**
     * Загрузка изображения в element
     * @param {HTMLElement} contentImage
     * @param {string} url
     */
    loadImage: function (contentImage, url) {
        // Анти-кэш
        url +=  '?' + Date.parse(new Date().toString());
        var uploadImage = new Image();
        var imageLoadTimeout = setTimeout(function() {
            contentImage.src = '';
        }, this.LOAD_TIMEOUT);

        // Обработчик загрузки
        uploadImage.onload = function() {
            uploadImage.onerror = null;
            clearTimeout(imageLoadTimeout);
            contentImage.src = url;
        };

        // Обработчик ошибки
        uploadImage.onerror = function() {
            uploadImage.onload = null;
            clearTimeout(imageLoadTimeout);
            contentImage.src = '';
        };

        uploadImage.src = url;
    },

    /**
     * Функция перевода даты в формат 'dd.mm.yy  h:m:s'
     * @params {Date} date
     * @return {string}
     */
    getFormattedDate: function (date) {
        var myDate = new Date(date);
        var day = myDate.getDate();
        if (day < 10)
            day = '0' + day;

        var month = myDate.getMonth() + 1;
        if (month < 10)
            month = '0' + month;

        var year = myDate.getFullYear() % 100;
        if (year < 10)
            year = '0' + year;

        var hour = myDate.getHours();
        if (hour < 10)
            hour = '0' + hour;

        var minute = myDate.getMinutes();
        if (minute < 10)
            minute = '0' + minute;

        var second = myDate.getSeconds();
        if (second < 10)
            second = '0' + second;

        return day + '.' + month + '.' + year + '  '+ hour + ':'+ minute + ':' + second;
    }
};