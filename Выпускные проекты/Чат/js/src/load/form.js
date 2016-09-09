'use strict';
// Данные о пользователе
var user = require('../user/user');

// Форма загрузки фото
module.exports = {
    dropZone: document.querySelector('.load__dropZone'),
    
    loadButton: document.querySelector('.load__download'),
    
    cancelButton: document.querySelector('.load__cancel'),
    
    loadWindow: document.querySelector('.chat__load'),
    
    loadOverlay: document.querySelector('.load__overlay'),

    file: null,
    
    getMessage: function () {
        // Если файл существует
        if(this.file) {
            var photo = this.file.src;
            var message = {
                type: 'newPhoto',
                id: user.id,
                photo: photo
            };
            // Закрываем форму
            this.cancelButton.click();
            // Возвращаем сообщение
            return JSON.stringify(message);
        } else {
            // Если не существует
            // Возвращаем null
            return null;
        }
    },
    
    open: function () {
        this.loadWindow.classList.add('show');
        this.loadOverlay.classList.add('show');
    },
    
    close: function () {
        this.loadWindow.classList.remove('show');
        this.dropZone.classList.remove('load__dropZone--filled');
        this.loadOverlay.classList.remove('show');
    },

    handleFiles: function (file) {
        this.file = document.createElement("img");
        this.dropZone.classList.add('load__dropZone--filled');
        this.loadButton.disabled = false;
        this.dropZone.appendChild(this.file);

        var reader = new FileReader();
        reader.onload = (function(aImg) {
            return function(e) {
                aImg.src = e.target.result;
            };
        })(this.file);
        reader.readAsDataURL(file);
    }
};