'use strict';

/**
 * Валидация формы авторизации
 * @param {HTMLElement} nameField
 * @param {HTMLElement} loginField
 * @return {boolean}
 * */
module.exports = function (nameField, loginField) {
    // Удаляем класс-метку всех полей
    nameField.classList.remove('empty');
    loginField.classList.remove('empty');

    // Счетчик ошибок
    var counterError = 0;

    // Поля не могут быть пустыми.
    if(nameField.value === '') {
        nameField.classList.add('empty');
        counterError++
    }

    if(loginField.value === '') {
        loginField.classList.add('empty');
        counterError++
    }

    // Если есть ошибки возвращяем false
    return counterError === 0;
};