var array = ['я', 'умею', 'писать', 'рекурсивные', 'функции'];

var consoleRec = function (array, initialValue) {
    console.log(array[initialValue]);
    if(initialValue !== array.length - 1){
        initialValue++;
        consoleRec(array, initialValue);
    }
};

consoleRec(array, 0);