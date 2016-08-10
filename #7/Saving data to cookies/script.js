var saveDIV = document.querySelector('#saveDIV');
var randomDIV = document.querySelector('#randomDIV');
var container = document.querySelector('#container');

// конвертирует cookie в массив объектов в котором каждая cookie объект
var convertCookie = function (cookie) {
    var cookies = [];
    var arrayAllCookies = cookie.split('; ');
    arrayAllCookies.forEach(function (item) {
        item = item.split('=');
        cookies.push({'name': item[0], 'value': item[1]});
    });
    return cookies;
};

// создает JSON строку (P.S. если не менять ";" на "+", то cookie записывается до первой ";")
var createJson = function () {
    var divs = document.querySelectorAll('.newDiv');
    var divsStyle = [];
    for(var item of divs) {
        divsStyle.push(item.style.cssText);
    }
    return JSON.stringify(divsStyle).replace(/\;/gi, '+');
};

// обработчик клика по кнопке save DIV
// записывает в куки стили имеющихся div'ов
saveDIV.onclick = function () {
    var name = 'divs';
    var value = createJson();
    document.cookie = name + '=' + value;
};

// создаёт новый div
var createDiv = function () {
    var newDIV = document.createElement('div');
    newDIV.setAttribute('class', 'newDiv');
    newDIV.style.width = getRandomInt(20, 400) + 'px';
    newDIV.style.height = getRandomInt(20, 400) + 'px';
    newDIV.style.backgroundColor = `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
    newDIV.style.position = 'absolute';
    newDIV.style.left = getRandomInt(0, 300) + 'px';
    newDIV.style.top = getRandomInt(0, 300) + 'px';
    newDIV.style.cursor = 'pointer';
    return newDIV;
};

// возвращяет слкчайное целое число
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

// возвращяет координаты
function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

// обработчик клика по кнопке Create DIV
// записывает в куки стили имеющихся div'ов
randomDIV.onclick = function () {
    var newDiv = createDiv();
    container.appendChild(newDiv);
};

// Drag'n'Drop
container.onmousedown = function (e) {
    var target = e.target;
    if (target.tagName === 'DIV'){
            var coords = getCoords(target);
            var shiftX = e.pageX - coords.left;
            var shiftY = e.pageY - coords.top;

            function moveAt(e) {
                target.style.left = e.pageX - shiftX + 'px';
                target.style.top = e.pageY - shiftY + 'px';
            }

            document.onmousemove = function (e) {
                moveAt(e);
            };

            target.onmouseup = function () {
                document.onmousemove = null;
                target.onmouseup = null;
            };
    }
};

// считываем куки
var currentCookies = document.cookie;

// если cookie существуют
if(currentCookies) {
    // преобразуем cookie в объект
    currentCookies = convertCookie(currentCookies);
    currentCookies.forEach(function (item) {
        // если существует cookie с именем divs
        if(item.name.indexOf('divs') !== -1){
            var divStyle = item.value.replace(/\+/gi, ';');
            divStyle = JSON.parse(divStyle);
            divStyle.forEach(function (item) {
                var newDIV = document.createElement('div');
                newDIV.setAttribute('class', 'newDiv');
                newDIV.style = item;
                container.appendChild(newDIV);
            });
        }
    });
}
