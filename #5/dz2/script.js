var createDiv = function () {
    var newDIV = document.createElement('div');
    newDIV.setAttribute('id', 'newDiv');
    newDIV.style.width = getRandomInt(20, 400) + 'px';
    newDIV.style.height = getRandomInt(20, 400) + 'px';
    newDIV.style.backgroundColor = `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
    newDIV.style.position = 'absolute';
    newDIV.style.left = getRandomInt(0, 300) + 'px';
    newDIV.style.top = getRandomInt(0, 300) + 'px';
    newDIV.style.cursor = 'pointer';
    return newDIV;
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function getCoords(elem) { //
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}

var randomDIV = document.querySelector('#randomDIV');

randomDIV.onclick = function (e) {
    var newDiv = createDiv();
    document.body.appendChild(newDiv);

    newDiv.onmousedown = function (e) {
        var coords = getCoords(newDiv);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        function moveAt(e) {
            newDiv.style.left = e.pageX - shiftX + 'px';
            newDiv.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function (e) {
            moveAt(e);
        };

        newDiv.onmouseup = function () {
            document.onmousemove = null;
            newDiv.onmouseup = null;
        };
    }
};
