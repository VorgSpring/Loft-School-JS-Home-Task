'use strict';
// Общие функции
var utilities = require('./utilities');

// Форма авторизации
var authorizationForm = require('./authorization/form');
// Валидация формы авторизации
var authorizationIsValid = require('./authorization/isValid');

// Форма загрузки фото
var loadForm = require('./load/form');
// Валидация формы загрузки фото
var loadIsValid = require('./load/isValid');

(function () {
    /**
     * Обработчик изменения формы авторизации
     */
    document.forms.authorization.addEventListener('input', function () {
        authorizationForm.submitButton.disabled =
            !authorizationIsValid(authorizationForm.nameField, authorizationForm.loginField)
    });

    /**
     * Обработчик закрытия формы загрузки
     * @param {event} event
     */
    document.body.addEventListener('click', function (event) {
        if(event.target.classList.contains('load__overlay') ||
            event.target.classList.contains('load__cancel')) {
            // Если в форму загружен файл, то удаляем его
            if(loadForm.file){
                utilities.delete(loadForm.file);
                loadForm.file = null;
            }
            // Закрываем форму
            loadForm.close();
        }
    });

    /**
     * Обработчик dragover
     * @param {event} event
     */
    loadForm.dropZone.addEventListener("dragover", function(event){
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);

    /**
     * Обработчик drop
     * @param {event} event
     */
    loadForm.dropZone.addEventListener("drop", function(event){
        event.stopPropagation();
        event.preventDefault();

        var file = event.dataTransfer.files[0];
        if(loadIsValid(file)) {
            loadForm.handleFiles(file);
        }
    }, false);
})();
