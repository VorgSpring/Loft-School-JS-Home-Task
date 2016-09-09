'use strict';

/**
 * Валидация формы отправки сообщения
 * @param {HTMLElement} messageField
 * @return {boolean}
 */
module.exports = function (messageField) {
    // Удаляем класс-метку у поля
    messageField.classList.remove('empty');

    // Поле не могут быть пустыми.
    if(messageField.value === '') {
        messageField.classList.add('empty');
        return false;
    }
    
    return true;
};
