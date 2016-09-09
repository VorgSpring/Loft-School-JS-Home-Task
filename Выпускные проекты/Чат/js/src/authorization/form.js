'use strict';
// Данные о пользователе
var user = require('../user/user');

// Валидация формы авторизации
var isValid = require('./isValid');

// Форма авторизации
module.exports = {
    /**
     * Поле ввода имени пользователя
     * @type {HTMLElement}
     */
    nameField: document.forms.authorization.nameUser,

    /**
     * Поле ввода логина пользователя
     * @type {HTMLElement}
     */
    loginField: document.forms.authorization.login,

    /**
     * Кнопка отправить
     * @type {HTMLElement}
     */
    submitButton: document.forms.authorization.querySelector('.authorization__log'),

    /**
     * Формирует сообщение-запрос на регистрацию
     * Если форма не проходит валидацию, то возвращает null
     * @return {string, null}
     */
    getMessage: function () {
        // Если проходит валидацию
        if(isValid(this.nameField, this.loginField)) {
            // Формируем сообщение
            var name = this.nameField.value;
            var login = this.loginField.value;
            var message = {
                type: 'authorization',
                name: name,
                login: login
            };

            // Сохраняем значения полей name и login, даже если авторизация не удастся
            user.name = name;
            user.login = login;

            // Возвращаем сообщение
            return JSON.stringify(message);
        } else {
            // если не проходит валидацию
            this.submitButton.disabled = true;

            // Возвращаем null
            return null;
        }
    },

    /**
     * Действие при неудачной авторизации
     * @param {string} text
     */
    failedAuthorization: function (text) {
        alert(text);
        this.loginField.value = '';
    }
};
