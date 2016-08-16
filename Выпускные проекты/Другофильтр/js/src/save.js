'use strict';

/**
 * Кнопка 'Сохранить'
 * @type {HTMLElement}
 */
var saveButton = document.querySelector('.friends-filter__save');

/**
 * Модуль сохранения текущего состояния списка
 */
var save = function (list) {
    /**
     * Обработчик клика по кнопке 'Сохранить'
     */
    saveButton.addEventListener('click', function () {
        saveSelectedFriends(list);
    });

    /**
     * Функция сохранения текущего состояния списка
     * @param {Array.<Object>} list
     */
     function saveSelectedFriends(list) {
        var selected = list.filter(function (item) {
            return item.selected === true;
        });
        var friendsJSON = JSON.stringify(selected, ['data', 'id'], 3);
        localStorage.setItem('friends', friendsJSON);
        alert('Сохранено!');
    }
};

module.exports = save;