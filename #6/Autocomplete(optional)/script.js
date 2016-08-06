var searchInput = document.querySelector('#searchCity');
var container = document.querySelector('#container');

// Допустимое время загрузки
var LOAD_TIMEOUT = 10000;

var URL = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

var load = function(url) {
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        var xhrLoadTimeout = setTimeout(function () {
            reject();
        }, LOAD_TIMEOUT);

        xhr.onload = function (evt) {
            xhr.onerror = null;
            clearTimeout(xhrLoadTimeout);
            var loadedData = JSON.parse(evt.target.response);
            resolve(loadedData);
        };

        xhr.onerror = function () {
            xhr.onload = null;
            reject();
        };

        xhr.open('GET', url);
        xhr.send();
    });
};

var searchCity = function (data, value) {
    var list = data.filter(function (item) {
        return item.name.indexOf(value) !== -1;
    });
    return list;
};

var insertList = function (container, content) {
    var li = document.createElement('li');
    li.innerHTML = content;
    container.appendChild(li);
};

var insertSearchCity = function (data, value) {
    container.innerHTML = '';
    var list = searchCity(data, value);
    list.forEach(function (item) {
        insertList(container, item.name);
    });
};

load(URL).then(
    function (data) {
        searchInput.addEventListener('input', function () {
            var value = searchInput.value;
            insertSearchCity(data, value);
        });
    },
    function () {
        alert('Ошибка!');
    }
);
