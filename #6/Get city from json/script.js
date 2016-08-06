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

var sortByName = function (data) {
    var list = data.slice();
    return list.sort(function (a, b) {
        if(a.name > b.name)
            return 1;
        else if(a.name < b.name)
            return -1;
        else
            return 0;
    });
};

var insertList = function (container, content) {
    var li = document.createElement('li');
    li.innerHTML = content;
    container.appendChild(li);
};

load(URL).then(
    function (data) {
        var list = sortByName(data);
        list.forEach(function (item) {
            insertList(container, item.name);
        });
    },
    function () {
        alert('Ошибка!');
    }
);