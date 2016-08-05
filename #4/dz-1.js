var prepend = function (container, newElement) {
    container.insertBefore(newElement, container.children[0]);
};

var parentUl = document.querySelector('.parent');
var newElement = document.createElement('li');
newElement.innerHTML = 'новый элемент';

prepend(parentUl, newElement);