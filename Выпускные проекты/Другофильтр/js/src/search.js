'use strict';
/**
 * Поле для поиска по всем друзьям
 * @type {HTMLElement}
 */
var searchInputAll = document.querySelector('.friends-filter__search--all');

/**
 * Поле для поиска по выбранным друзьям
 * @type {HTMLElement}
 */
var searchInputSelected = document.querySelector('.friends-filter__search--selected');

/**
 * Модуль поиска
 */
var search = function (data) {
    /**
     * Обработчик изменения поля поиска для всех друзей
     */
    searchInputAll.addEventListener('input', function () {
        var value = searchInputAll.value;
        searchFriend(data, value, false);
    });

    /**
     * Обработчик изменения поля поиска для выбранных друзей
     */
    searchInputSelected.addEventListener('input', function () {
        var value = searchInputSelected.value;
        searchFriend(data, value, true);
    });
    
    /**
     * Функция поиска
     * @param {Array.<Object>} data
     * @param {string} value
     * @param {boolean} selected
     */
     function searchFriend(data, value, selected) {
        data.forEach(function (item) {
            if(item.selected === selected) {
                if(item.data.first_name.toLowerCase().indexOf(value.toLowerCase()) !== -1
                    || item.data.last_name.toLowerCase().indexOf(value.toLowerCase()) !== -1){
                    item.element.style.display = 'block';
                } else {
                    item.element.style.display = 'none';
                }
            }
        });
    }
};


module.exports = search;