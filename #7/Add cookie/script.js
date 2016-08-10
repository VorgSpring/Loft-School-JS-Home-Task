var table = document.querySelector('#table');
var nameCookie = document.querySelector('#nameCookie');
var valueCookie = document.querySelector('#valueCookie');
var daysDelay = document.querySelector('#daysDelay');
var saveCookie = document.querySelector('#saveCookie');

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

// создаёт новую строку в таблице
var createTableRow = function (name, value) {
    var tr = document.createElement('tr');
    var tdName = document.createElement('td');
    var tdValue = document.createElement('td');
    var button = document.createElement('button');
    tdName.innerHTML = name;
    tdValue.innerHTML = value;
    button.setAttribute('value', name+'='+value);
    button.setAttribute('name', name);
    button.innerHTML = 'delete';
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(button);
    table.appendChild(tr);
};

// удаляет cookie
var deleteCookie = function (cookie) {
    var datePast = new Date;
    datePast.setDate(datePast.getDate() - 1);
    document.cookie = cookie + '; expires='+datePast.toUTCString();
};

// записывает в cookie
var setCookie = function (name, value, days) {
    var setDate = new Date;
    setDate.setDate(setDate.getDate() + days);
    document.cookie = name + '=' + value + '; expires='+setDate.toUTCString();
};

// обработчик клика по кнопке delete
// удаляет cookie и строку
table.onclick = function (e) {
    var target = e.target;
    if(target.tagName === 'BUTTON') {
        if(confirm('Удалить cookie с именем ' + target.getAttribute('name') + '?')) {
            deleteCookie(target.getAttribute('value'));
            target.parentNode.remove();
        }
    }
};

// заполняет таблицу
var fillTable = function (cookie) {
    var cookies = convertCookie(cookie);
    cookies.forEach(function (item) {
        createTableRow(item.name, item.value);
    })
};

// обработчик клика по кнопке save cookie
saveCookie.onclick = function () {
    var name = nameCookie.value;
    var value = valueCookie.value;
    var days = daysDelay.value;
    if(name === '') {
        alert('enter the name of the cookies!');
        return null;
    } else if(value === '') {
        alert('enter the value of the cookies!');
        return null;
    }else if(days === '') {
        alert('enter the days!');
        return null;
    }
    setCookie(name, value, days);
    createTableRow(name, value);
    nameCookie.value = '';
    valueCookie.value = '';
    daysDelay.value = '';
};

var date = new Date;
date.setDate(date.getDate() + 1);

document.cookie = 'name=value; expires='+date.toUTCString();
document.cookie = 'name1=value1; expires='+date.toUTCString();
document.cookie = 'name2=value2; expires='+date.toUTCString();

fillTable(document.cookie);
