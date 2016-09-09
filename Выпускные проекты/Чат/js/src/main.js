'use strict';
// Модуль с событиями форм
require('./formsModule');

// Данные о пользователе
var user = require('./user/user');

// Заполняет информацией о пользователе и об онлайн пользователях
var settingValues = require('./user/setting');

// Форма авторизации
var authorizationForm = require('./authorization/form');

// Модуль для работы со списком пользователей
var usersList = require('./usersList/list');

// Форма отправки сообщения
var messageForm = require('./message/form');

// Модуль для работы со списком сообщений
var messageList = require('./message/list');

// Форма загрузки фото
var loadForm = require('./load/form');

// Создаём подключение к WebSocket-серверу
var socket = new WebSocket("ws://localhost:8081");

// Создаём обработчики отправки форм
var forms = document.forms;
for(var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function (event) {
        event.preventDefault();
        var message = null;
        // В зависимости от имени формы получаем сообщение
        switch(this.name) {
            // Сообщение-запрос на регистрацию
            case 'authorization':
                message = authorizationForm.getMessage();
                break;

            // Новое сообщение от пользователя
            case 'messages':
                message = messageForm.getMessage();
                break;
            
            // Сообщенеи об изменении фотографии
            case 'load':
                message = loadForm.getMessage();
                break;
        }

        // Отправляем запрос на сервер, если сообщение сформировалось
        if(message)
            socket.send(message);
    })
}

// Обработчик входящих сообщений
socket.onmessage = function (message) {
    var data = JSON.parse(message.data);
    switch (data.type) {
        // Поступило сообщение об авторизации нового пользователя
        case 'authorization':
            usersList.addUser(data.name, data.id);
            break;

        // Поступило сообщение о неудачной авторизации
        case 'failedAuthorization':
            authorizationForm.failedAuthorization(data.text);
            break;

        // Поступила информация о пользователе
        case 'information':
            settingValues(data);
            break;

        // Поступило новое сообщение от пользователя
        case 'newMessage':
            messageList.addMessage(data);
            break;
        
        // Поступило сообщение о старых сообщениях
        case 'oldMessage':
            messageList.renderAllMessage(JSON.parse(data.massage));
            break;
        
        // Поступило сообщение о том, что пользователь покинул чат
        case 'deleteUser':
            usersList.deleteUser(data.id);
            break;
        
        // Поступило сообщение о смене фотографии пользователя
        case 'changePhoto':
            // Если фото поменялось у текущего пользователя
            if(user.id === data.id) {
                user.changePhoto(data.photo);
            }
            // Меняем фото в списке сообщений
            messageList.changePhoto(data.id, data.photo);
            break;
        
        // Поступило сообщение о смене имени пользователя
        case 'changeName':
            // Меняем имя в списке сообщений
            messageList.changeName(data.id, data.name);
            break;
    }
};

