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

        // Если элемент есть, вызываем клик по кнопке
        if (dropElem)
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