'use strict';
// Данные о пользователе
var user = require('./user');

// Модуль для работы со списком пользователей
var usersList = require('../usersList/list');

// Форма отправки сообщения
var messageForm = require('../message/form');

// Форма загрузки фото
var loadForm = require('../load/form');

/**
 * Окно авторизации
 * @type {HTMLElement}
 */
var authorizationWindow = document.querySelector('.chat__authorization');

/**
 * Окно информации о пользователях
 * @type {HTMLElement}
 */
var infoWindow = document.querySelector('.info__users');

/**
 * Заполняет информацией о пользователе и об онлайн пользователях
 * @param {object} data
 */
module.exports = function (data) {
    // Прячем окно авторизации
    authorizationWindow.classList.remove('show');
    
    // Заполняем контейнер с именем
    user.nameContainer.textContent = user.name;
    
    // Запоминаем id пользователя
    user.id = data.id;
    
    // Если с сервера пришла информация о фото
    if(data.photo !== '') {
        // Отрисовываем фото
        user.changePhoto(data.photo);
    }
    
    // Создаём обработчик клика по фото
    user.photoContainer.addEventListener('click', function () {
        loadForm.open();
    });
    
    // Делаем доступным поле ввода нового сообщения
    messageForm.messageText.disabled = false;
    
    // Делаем доступным кнопку отправки нового сообщения
    messageForm.messageSend.disabled = false;
    
    // Показываем окно с информацией
    infoWindow.classList.add('show');
    
    // Отрисовываем уже подключенных пользователей
    usersList.renderAllUsersOnline(JSON.parse(data.users));
};
