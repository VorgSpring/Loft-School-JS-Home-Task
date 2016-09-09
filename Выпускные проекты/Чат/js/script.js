/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Модуль с событиями форм
	__webpack_require__(1);

	// Данные о пользователе
	var user = __webpack_require__(4);

	// Заполняет информацией о пользователе и об онлайн пользователях
	var settingValues = __webpack_require__(8);

	// Форма авторизации
	var authorizationForm = __webpack_require__(3);

	// Модуль для работы со списком пользователей
	var usersList = __webpack_require__(9);

	// Форма отправки сообщения
	var messageForm = __webpack_require__(12);

	// Модуль для работы со списком сообщений
	var messageList = __webpack_require__(14);

	// Форма загрузки фото
	var loadForm = __webpack_require__(6);

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



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Общие функции
	var utilities = __webpack_require__(2);

	// Форма авторизации
	var authorizationForm = __webpack_require__(3);
	// Валидация формы авторизации
	var authorizationIsValid = __webpack_require__(5);

	// Форма загрузки фото
	var loadForm = __webpack_require__(6);
	// Валидация формы загрузки фото
	var loadIsValid = __webpack_require__(7);

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	// Общие функции
	module.exports = {
	    /**
	     * Допустимое время загрузки изображения
	     * @constant {number}
	     */
	    LOAD_TIMEOUT: 5000,

	    /**
	     * Удаляет element из DOM
	     * @param {HTMLElement} element
	     */
	    delete: function (element) {
	        element.parentNode.removeChild(element);
	    },

	    /**
	     * Добавляет element в container
	     * @param {HTMLElement} element
	     * @param {HTMLElement} container
	     */
	    insert: function (element, container) {
	        container.appendChild(element);
	    },

	    /**
	     * Загрузка изображения в element
	     * @param {HTMLElement} contentImage
	     * @param {string} url
	     */
	    loadImage: function (contentImage, url) {
	        // Анти-кэш
	        url +=  '?' + Date.parse(new Date().toString());
	        var uploadImage = new Image();
	        var imageLoadTimeout = setTimeout(function() {
	            contentImage.src = '';
	        }, this.LOAD_TIMEOUT);

	        // Обработчик загрузки
	        uploadImage.onload = function() {
	            uploadImage.onerror = null;
	            clearTimeout(imageLoadTimeout);
	            contentImage.src = url;
	        };

	        // Обработчик ошибки
	        uploadImage.onerror = function() {
	            uploadImage.onload = null;
	            clearTimeout(imageLoadTimeout);
	            contentImage.src = '';
	        };

	        uploadImage.src = url;
	    },

	    /**
	     * Функция перевода даты в формат 'dd.mm.yy  h:m:s'
	     * @params {Date} date
	     * @return {string}
	     */
	    getFormattedDate: function (date) {
	        var myDate = new Date(date);
	        var day = myDate.getDate();
	        if (day < 10)
	            day = '0' + day;

	        var month = myDate.getMonth() + 1;
	        if (month < 10)
	            month = '0' + month;

	        var year = myDate.getFullYear() % 100;
	        if (year < 10)
	            year = '0' + year;

	        var hour = myDate.getHours();
	        if (hour < 10)
	            hour = '0' + hour;

	        var minute = myDate.getMinutes();
	        if (minute < 10)
	            minute = '0' + minute;

	        var second = myDate.getSeconds();
	        if (second < 10)
	            second = '0' + second;

	        return day + '.' + month + '.' + year + '  '+ hour + ':'+ minute + ':' + second;
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Данные о пользователе
	var user = __webpack_require__(4);

	// Валидация формы авторизации
	var isValid = __webpack_require__(5);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Общие функции
	var utilities = __webpack_require__(2);

	/**
	 * Хранит данные о пользователе
	 * @type {object}
	 */
	var user = {
	    /**
	     * ID пользователя
	     * @type {number}
	     */
	    id: '',

	    /**
	     * Имя пользователя
	     * @type {string}
	     */
	    name: '',

	    /**
	     * Login пользователя
	     * @type {string}
	     */
	    login: '',

	    /**
	     * путь до фото пользователя
	     * @type {string}
	     */
	    photo: '',

	    /**
	     * Контейнер с фото пользователя
	     * @type {HTMLElement}
	     */
	    photoContainer: document.querySelector('.info__photo img'),

	    /**
	     * Контейнер с именем пользователя
	     * @type {HTMLElement}
	     */
	    nameContainer: document.querySelector('.info__name'),

	    /**
	     * Меняет фото у пользователя
	     * @param {string} photo
	     */
	    changePhoto: function (photo) {
	        this.photo = photo;
	        utilities.loadImage(this.photoContainer, photo);
	    }
	};

	module.exports = user;

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Данные о пользователе
	var user = __webpack_require__(4);

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Валидация формы загрузки фото
	 * @param {object} file
	 */
	module.exports = function (file) {
	    if(file.type !== 'image/jpeg') {
	        alert('Можно загружать только JPG-файлы');
	        return false;
	    }
	    if(file.size > 524288) {
	        alert('Можно загружать только файлы меньше 512kb');
	        return false;
	    }
	    return true;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Данные о пользователе
	var user = __webpack_require__(4);

	// Модуль для работы со списком пользователей
	var usersList = __webpack_require__(9);

	// Форма отправки сообщения
	var messageForm = __webpack_require__(12);

	// Форма загрузки фото
	var loadForm = __webpack_require__(6);

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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Конструктор для отрисовки online пользователя
	var UserOnline = __webpack_require__(10);

	/**
	 * Хранит список online пользователей
	 * @type {Array}
	 */
	var usersOnline = [];

	/**
	 * Контейнер для списка online пользователей
	 * @type {HTMLElement}
	 */
	var container = document.querySelector('.info__items');

	/**
	 * Контейнер для отображения количества online пользователей
	 * @type {HTMLElement}
	 */
	var counterUsers = document.querySelector('.info__users span');

	// Модуль для работы со списком пользователей
	module.exports = {
	    /**
	     * Добавляет пользователя
	     * @param {string} name
	     * @param {number} id
	     */
	    addUser: function (name, id) {
	        usersOnline.push(new UserOnline(name, id, container));
	        counterUsers.textContent = usersOnline.length;
	    },

	    /**
	     * Отрисовывает всех online пользователей
	     * @param {Array} usersList
	     */
	    renderAllUsersOnline: function (usersList) {
	        usersList.forEach(function (user) {
	            usersOnline.push(new UserOnline(user.name, user.id, container));
	        });
	        counterUsers.textContent = usersOnline.length;
	    },

	    /**
	     * Удаляет пользователя с данным id
	     * @param {number} id
	     */
	    deleteUser: function (id) {
	        usersOnline.some(function (user) {
	            if(user.id === id){
	                user.remove();
	                usersOnline.exterminate(user);
	                return true;
	            }
	        });
	    }
	};

	/**
	 * Удаляет из массива элемент по его значению
	 * @param {object} value
	 */
	Array.prototype.exterminate = function (value) {
	    this.splice(this.indexOf(value), 1);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Общие функции
	var utilities = __webpack_require__(2);

	// Создаёт объект element на основе шаблона templateElement
	var getElement = __webpack_require__(11);

	/**
	 * Конструктор для отрисовки online пользователя
	 * @param {string} name
	 * @param {number} id
	 * @param {HTMLElement} container
	 * @constructor
	 */
	var OnlineUser = function(name, id, container) {
	    this.name = name;
	    this.id = id;
	    this.element = getElement();
	    this.element.textContent = this.name;
	    utilities.insert(this.element, container);
	};

	/**
	 * Удаляет елемент
	 */
	OnlineUser.prototype.remove = function () {
	    utilities.delete(this.element);
	};

	module.exports = OnlineUser;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Шаблон для элемента списка online пользователей
	 * @type {HTMLElement}
	 */
	var templateElement = document.querySelector('#info-template');

	/**
	 * content элемента templateElement
	 * @type {HTMLElement}
	 */
	var elementToClone;

	// Если браузер не поддерживает тег 'template'
	if ('content' in templateElement) {
	    elementToClone = templateElement.content.querySelector('.info__item');
	} else {
	    elementToClone = templateElement.querySelector('.info__item');
	}

	/**
	 * Создаёт объект element на основе шаблона templateElement
	 * @return {Object} element
	 */
	var get = function() {
	    // Возвращаем клонированный шаблонный элемент
	    return elementToClone.cloneNode(true);
	};

	module.exports = get;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Данные о пользователе
	var user = __webpack_require__(4);

	// Валидация формы отправки сообщения
	var isValid = __webpack_require__(13);

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


/***/ },
/* 13 */
/***/ function(module, exports) {

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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Конструктор для отрисовки одного сообщения
	var Message = __webpack_require__(15);
	// Общие функции
	var utilities = __webpack_require__(2);

	/**
	 * Хранит список сообщений
	 * @type {Array}
	 */
	var renderedMessages = [];

	/**
	 * Контейнер для сообщений
	 * @type {HTMLElement}
	 */
	var container = document.querySelector('.messages__items');

	// Модуль для работы со списком сообщений
	module.exports = {
	    /**
	     * Добавляет новое сообщение
	     * @param {object} data
	     */
	    addMessage: function (data) {
	        renderedMessages.push(new Message(data, container));
	    },

	    /**
	     * Отрисовывает все сообщения
	     * @param {Array} messagesList
	     */
	    renderAllMessage: function (messagesList) {
	        messagesList.forEach(function (message) {
	            renderedMessages.push(new Message(message, container));
	        });
	    },

	    /**
	     * Меняет имя у пользователя с данным id
	     * @param {number} id
	     * @param {string} name
	     */
	    changeName: function (id, name) {
	        renderedMessages.forEach(function (message) {
	            if (message.id === id) {
	                message.element.name.textContent = name;
	            }
	        });
	    },

	    /**
	     * Меняет фото у пользователя с данным id
	     * @param {number} id
	     * @param {string} photo
	     */
	    changePhoto: function (id, photo) {
	        renderedMessages.some(function (message) {
	            if (message.id === id) {
	                utilities.loadImage(message.element.contentImage, photo);
	                return true;
	            }
	        });
	    }
	};



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Общие функции
	var utilities = __webpack_require__(2);

	// Создаёт объект element на основе шаблона templateElement
	var getElement = __webpack_require__(16);

	// Создание DOM-разметки в element
	var fillElement = __webpack_require__(17);

	/**
	 * Конструктор для отрисовки одного сообщения
	 * @param {object} data
	 * @param {HTMLElement} container
	 * @constructor
	 */
	var Message = function(data, container) {
	    this.id = data.id;
	    this.element = getElement();
	    fillElement(this.element, data);
	    utilities.insert(this.element, container);
	};

	module.exports = Message;


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Шаблон для элемента списка online пользователей
	 * @type {HTMLElement}
	 */
	var templateElement = document.querySelector('#messages-template');

	/**
	 * content элемента templateElement
	 * @type {HTMLElement}
	 */
	var elementToClone;

	// Если браузер не поддерживает тег 'template'
	if ('content' in templateElement) {
	    elementToClone = templateElement.content.querySelector('.messages__item');
	} else {
	    elementToClone = templateElement.querySelector('.messages__item');
	}

	/**
	 * Создаёт объект element на основе шаблона templateElement
	 * @return {Object} element
	 */
	module.exports = function() {
	    // Клонируем шаблонный элемент
	    var element = elementToClone.cloneNode(true);
	    element.contentImage = element.querySelector('.messages__photo img');
	    element.name = element.querySelector('.messages__name');
	    element.date = element.querySelector('.messages__date');
	    element.content = element.querySelector('.messages__content');
	    return element;
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// Общие функции
	var utilities = __webpack_require__(2);

	/**
	 * Создание DOM-разметки в element
	 * @param {HTMLElement} element
	 * @param {Object} data
	 */
	module.exports = function(element, data) {
	    if(data.photo !== '') {
	        utilities.loadImage(element.contentImage, data.photo);
	    }
	    element.name.textContent = data.name;
	    element.date.textContent = utilities.getFormattedDate(data.date);
	    element.content.textContent = data.text;
	};




/***/ }
/******/ ]);