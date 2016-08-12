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
        return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });
    return list;
};

var insertList = function (list) {
    var source = document.querySelector('#listTemplate').innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML = template({list: list});
};

var insertSearchCity = function (data, value) {
    container.innerHTML = '';
    var list = searchCity(data, value);
    insertList(list);
};

load(URL).then(
    function (data) {
        insertList(data);
        searchInput.addEventListener('input', function () {
            var value = searchInput.value;
            insertSearchCity(data, value);
        });
    },
    function () {
        alert('Ошибка!');
    }
);


