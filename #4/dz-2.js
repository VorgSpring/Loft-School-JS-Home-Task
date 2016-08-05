var deleteTextNodes = function (container) {
    var childNodes = container.childNodes;
    for (var i = 0; i< childNodes.length; i++) {
        if (childNodes[i].nodeType == 3) {
            childNodes[i].remove();
        }
    }
};

var parentUl = document.querySelector('.parent');

deleteTextNodes(parentUl);