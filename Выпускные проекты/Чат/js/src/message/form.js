'use strict';
// Данные о пользователе
var user = require('../user/user');

// Валидация формы отправки сообщения
var isValid = require('./isValid');

// Форма отправки сообщения
module.exports = {
    /**
     * Поле ввода нового сообщения
     * @type {HTMLElement}
     */
    messageText: document.querySelector('.messages__enter'),
    
    /**
     * Кнопка отправки сообщения
     * @type {HTMLElement}
     */
    messageSend: document.querySelector('.messages__send'),

    /**
     * Формирует новое сообщение
     * Если форма не проходит валидацию, то возвращает null
     * @return {string, null}
     */
    getMessage: function () {
        // Если проходит валидацию
        if(isValid(this.messageText)) {
            // Формируем сообщение
            var text = this.messageText.value;
            var message = {
                type: 'newMessage',
                id: user.id,
                text: text
            };
            // Очищаем поле
            this.messageText.value = '';

            // Возвращаем сообщение
            return JSON.stringify(message);
        } else {
            // если не проходит валидацию
            this.messageSend.disabled = true;

            // Возвращаем null
            return null;
        }
    }
};
