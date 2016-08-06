var myButton = document.querySelector('#myButton');

var timer = function (time) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(time);
        }, time);
    })
};
myButton.onclick = function () {
    timer(3000).then(
        function (time) {
            alert('Таймер сработал через '+ time/1000 + 'сек.');
        }
    )
};
