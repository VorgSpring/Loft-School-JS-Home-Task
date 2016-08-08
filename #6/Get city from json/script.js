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

var insertList = function (container, content) {
    var li = document.createElement('li');
    li.innerHTML = content;
    container.appendChild(li);
};

load(URL).then(
    function (data) {
        data.map(function (item) {
            return item.name;
        }).forEach(function (item) {
            insertList(container, item);
        });
    },
    function () {
        alert('Ошибка!');
    }
);