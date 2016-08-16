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

	/**
	 * Фунция отображения списка друзей
	 * @param {Array.<Object>} friends
	 * @return {Array.<Object>} renderedFriends
	 */
	var renderFriends = __webpack_require__(1);

	/**
	 * Хранит список друзей
	 * @type {Array.<Object>}
	 */
	var renderedFriends = [];

	/**
	 * Модуль поиска
	 */
	var search = __webpack_require__(5);

	/**
	 * Модуль сохранения текущего состояния списка
	 */
	var save = __webpack_require__(6);

	/**
	 * Модуль Drag'n'Drop
	 */
	var dragManager = __webpack_require__(7);


	new Promise(function(resolve) {
	    if (document.readyState === 'complete') {
	        resolve();
	    } else {
	        window.onload = resolve;
	    }
	}).then(function() {
	    return new Promise(function(resolve, reject) {
	        VK.init({
	            apiId: 5582471
	        });

	        VK.Auth.login(function(response) {
	            if (response.session) {
	                resolve(response);
	            } else {
	                reject(new Error('Не удалось авторизоваться'));
	            }
	        }, 2);
	    });
	}).then(function() {
	    return new Promise(function (resolve, reject) {
	        VK.api('friends.get', {'fields': 'photo_50', 'v': '5.53'}, function (response) {
	            if (response.error) {
	                reject(new Error(response.error.error_msg));
	            } else {
	                resolve(response);
	            }
	        });
	    })
	}).then(function (response) {
	    var friends = response.response.items;
	    // Отрисовываем и сохраняем список друзей
	    renderedFriends = renderFriends(friends);

	    // Подключаем модули

	    // Модуль поиска
	    search(renderedFriends);

	    // Модуль сохранения текущего состояния списка
	    save(renderedFriends);

	    // Модуль Drag'n'Drop
	    dragManager();

	}, function() {
	    alert('Ошибка!')
	});




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Конструктор для отрисовки одного друга в списке
	 * @param {Object} data
	 * @param {number} number
	 * @param {boolean} selected
	 * @constructor
	 */
	var Friend = __webpack_require__(2);


	/**
	 * Фунция отображения списка друзей
	 * @param {Array.<Object>} friends
	 * @return {Array.<Object>} renderedFriends
	 */
	var renderFriends = function(friends) {
	    var renderedFriends = [];
	    var friendsJSON = localStorage.getItem('friends');
	    if(friendsJSON) {
	        friendsJSON = JSON.parse(friendsJSON);
	        friends.forEach(function(friend, number) {
	            var select = false;
	            friendsJSON.forEach(function (item) {
	                if(item.data.id === friend.id)
	                    select = true;
	            });
	            renderedFriends.push(new Friend(friend, number, select));
	            select = false;
	        });
	    } else {
	        friends.forEach(function (friend, number) {
	            renderedFriends.push(new Friend(friend, number));
	        });
	    }
	    return renderedFriends;
	};

	module.exports = renderFriends;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Создаёт объект element на основе шаблона templateElement
	 * @return {Object} element
	 */
	var getElement = __webpack_require__(3).getElement;

	/**
	 * Возвращает контейнер для element, с учетом того, что выбран element или нет
	 * @param {boolean} select
	 * @return {HTMLElement} container
	 */
	var getContainer = __webpack_require__(3).getContainer;

	/**
	 * Создание DOM-разметки в element
	 * @param {HTMLElement} element
	 * @param {Object} data
	 */
	var fillElement = __webpack_require__(4);

	/**
	 * Конструктор для отрисовки одного друга в списке
	 * @param {Object} data
	 * @param {number} number
	 * @param {boolean} selected
	 * @constructor
	 */
	var Friend = function (data, number, selected) {
	    this.data = data;
	    this.element = getElement();
	    this.number = number;
	    this.selected = selected || false;
	    this.container = getContainer(this.selected);
	    fillElement(this.element, this.data);
	    this.create.call(this, this.container);
	    this.element.btn.addEventListener('click', this.onClick.bind(this));
	};

	Friend.prototype= {
	    /**
	     * Обработчик клика по кнопке
	     */
	    onClick: function () {
	        this.selected = !this.selected;
	        this.container = getContainer(this.selected);
	        this.create(this.container, this.container.children[this.number]);
	    },

	    /**
	     * Добавляет element в container
	     * @param {HTMLElement} container
	     * @param {HTMLElement} nextSibling
	     */
	    create: function (container, nextSibling) {
	        nextSibling = nextSibling || null;
	        container.insertBefore(this.element, nextSibling);
	    }
	};

	module.exports = Friend;


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Шаблон для блока с фотографиями
	 * @type {HTMLElement}
	 */
	var templateElement = document.querySelector('template');

	/**
	 * content элемента templateElement
	 * @type {HTMLElement}
	 */
	var elementToClone;

	// Если браузер не поддерживает тег 'template'
	if ('content' in templateElement) {
	    elementToClone = templateElement.content.querySelector('.friends-filter__item');
	} else {
	    elementToClone = templateElement.querySelector('.friends-filter__item');
	}

	/**
	 * Создаёт объект element на основе шаблона templateElement
	 * @return {Object} element
	 */
	var getElement = function() {
	    // Клонируем шаблонный элемент
	    var element = elementToClone.cloneNode(true);
	    element.avatar = element.querySelector('.friends-filter__avatar');
	    element.surname = element.querySelector('.friends-filter__surname');
	    element.name = element.querySelector('.friends-filter__name');
	    element.btn = element.querySelector('.friends-filter__btn');
	    return element;
	};

	/**
	 * Возвращает контейнер для element, с учетом того, что выбран element или нет
	 * @param {boolean} select
	 * @return {HTMLElement} container
	 */
	var getContainer = function (select) {
	    var container = null;
	    if(select) {
	        container = document.querySelector('.friends-filter__items--selected');
	    } else {
	        container = document.querySelector('.friends-filter__items--all');
	    }
	    return container;
	};

	module.exports = {
	    getElement: getElement,
	    getContainer: getContainer
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Создание DOM-разметки в element
	 * @param {HTMLElement} element
	 * @param {Object} data
	 */
	var fillElement = function(element, data) {
	    element.name.textContent = data.first_name;
	    element.surname.textContent = data.last_name;
	    var contentImage = element.avatar;
	    // Добавляем фото
	    var uploadImage = new Image();

	    // Обработчик загрузки
	    uploadImage.onload = function () {
	        uploadImage.onerror = null;
	        contentImage.src = data.photo_50;
	    };

	    // Обработчик ошибки
	    uploadImage.onerror = function () {
	        uploadImage.onload = null;
	        contentImage.src = '';
	    };

	    uploadImage.src = data.photo_50;
	};

	module.exports = fillElement;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Поле для поиска по всем друзьям
	 * @type {HTMLElement}
	 */
	var searchInputAll = document.querySelector('.friends-filter__search--all');

	/**
	 * Поле для поиска по выбранным друзьям
	 * @type {HTMLElement}
	 */
	var searchInputSelected = document.querySelector('.friends-filter__search--selected');

	/**
	 * Модуль поиска
	 */
	var search = function (data) {
	    /**
	     * Обработчик изменения поля поиска для всех друзей
	     */
	    searchInputAll.addEventListener('input', function () {
	        var value = searchInputAll.value;
	        searchFriend(data, value, false);
	    });

	    /**
	     * Обработчик изменения поля поиска для выбранных друзей
	     */
	    searchInputSelected.addEventListener('input', function () {
	        var value = searchInputSelected.value;
	        searchFriend(data, value, true);
	    });
	    
	    /**
	     * Функция поиска
	     * @param {Array.<Object>} data
	     * @param {string} value
	     * @param {boolean} selected
	     */
	     function searchFriend(data, value, selected) {
	        data.forEach(function (item) {
	            if(item.selected === selected) {
	                if(item.data.first_name.toLowerCase().indexOf(value.toLowerCase()) !== -1
	                    || item.data.last_name.toLowerCase().indexOf(value.toLowerCase()) !== -1){
	                    item.element.style.display = 'block';
	                } else {
	                    item.element.style.display = 'none';
	                }
	            }
	        });
	    }
	};


	module.exports = search;

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Модуль Drag'n'Drop
	 */
	var DragManager = new function() {
	    /**
	    * Хранит всё необходимую информацию по переносимому объекту
	    * @type {Object}
	    */
	    var dragObject = {};

	    /**
	     * Обработчик начала переноса
	     * @param {event} e
	     */
	    function onMouseDown(e) {
	        // если клик правой кнопкой мыши, то он не запускает перенос
	        if (e.which != 1)
	            return;

	        var elem = e.target.closest('.friends-filter__item');
	        // не нашли, клик вне draggable-объекта
	        if (!elem)
	            return;

	        // запомнить переносимый объект
	        dragObject.elem = elem;

	        // запомним, что элемент нажат на текущих координатах pageX/pageY
	        dragObject.downX = e.pageX;
	        dragObject.downY = e.pageY;

	        return false;
	    }

	    /**
	     * Обработчик переноса
	     * @param {event} e
	     */
	    function onMouseMove(e) {
	        // элемент не зажат
	        if (!dragObject.elem)
	            return;

	        // если перенос не начат...
	        if (!dragObject.avatar) {
	            var moveX = e.pageX - dragObject.downX;
	            var moveY = e.pageY - dragObject.downY;

	            // если мышь передвинулась в нажатом состоянии недостаточно далеко
	            if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
	                return;
	            }

	            // начинаем перенос

	            // создать аватар
	            dragObject.avatar = createAvatar();

	            // создать вспомогательные свойства shiftX/shiftY
	            var coords = getCoords(dragObject.avatar);
	            dragObject.shiftX = dragObject.downX - coords.left;
	            dragObject.shiftY = dragObject.downY - coords.top;

	            // отобразить начало переноса
	            startDrag(e);
	        }

	        // отобразить перенос объекта при каждом движении мыши
	        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
	        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

	        return false;
	    }


	    /**
	     * Обработчик завершения переноса
	     * @param {event} e
	     */
	    function onMouseUp(e) {
	        // если перенос идет
	        if (dragObject.avatar) {
	            finishDrag(e);
	        }

	        // перенос либо не начинался, либо завершился
	        // в любом случае очистим "состояние переноса" dragObject
	        dragObject = {};
	    }

	    /**
	     * Функция завершения переноса
	     * @param {event} e
	     */
	    function finishDrag(e) {
	        // Определяем элемент под курсором
	        var dropElem = findDroppable(e);
	        // 
	        dragObject.avatar.rollback();
	        
	        if (dropElem)
	            // Если элемента есть, вызываем клик по кнопке
	            dragObject.elem.btn.click();
	    }

	    /**
	     * Создает аватар
	     * @returns {Object} avatar
	     */
	    function createAvatar() {
	        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
	        var avatar = dragObject.elem;
	        avatar.old = {
	            parent: avatar.parentNode,
	            nextSibling: avatar.nextSibling,
	            position: avatar.position || '',
	            left: avatar.left || '',
	            top: avatar.top || '',
	            zIndex: avatar.zIndex || ''
	        };

	        /**
	         * Задает поведение при отмене переноса
	         */
	        avatar.rollback = function() {
	            avatar.old.parent.insertBefore(avatar, avatar.old.nextSibling);
	            avatar.style.position = avatar.old.position;
	            avatar.style.left = avatar.old.left;
	            avatar.style.top = avatar.old.top;
	            avatar.style.zIndex = avatar.old.zIndex
	        };

	        return avatar;
	    }

	    /**
	     * Инициирует начало переноса и позиционирует аватар на странице
	     */
	    function startDrag() {
	        var avatar = dragObject.avatar;

	        // инициировать начало переноса
	        document.body.appendChild(avatar);
	        avatar.style.zIndex = 100;
	        avatar.style.position = 'absolute';
	    }

	    /**
	     * Находит элемент под курсором мыши
	     * @param {event} event
	     * @returns {HTMLElement}
	     */
	    function findDroppable(event) {
	        // спрячем переносимый элемент
	        dragObject.avatar.hidden = true;

	        // получить самый вложенный элемент под курсором мыши
	        var elem = document.elementFromPoint(event.clientX, event.clientY);

	        // показать переносимый элемент обратно
	        dragObject.avatar.hidden = false;

	        if (elem == null) {
	            // такое возможно, если курсор мыши "вылетел" за границу окна
	            return null;
	        }

	        if(dragObject.avatar.old.parent.classList.contains('friends-filter__items--selected')) {
	            return elem.closest('.friends-filter__items--all');
	        } else {
	            return elem.closest('.friends-filter__items--selected');
	        }

	    }

	    document.onmousemove = onMouseMove;
	    document.onmouseup = onMouseUp;
	    document.onmousedown = onMouseDown;
	};

	/**
	 * Возвращяет координаты
	 * @param {HTMLElement} elem
	 * @returns {Object}
	 */
	function getCoords(elem) {
	    var box = elem.getBoundingClientRect();

	    return {
	        top: box.top + pageYOffset,
	        left: box.left + pageXOffset
	    };
	}

	module.exports = DragManager;

/***/ }
/******/ ]);