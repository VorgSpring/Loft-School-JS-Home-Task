var allNumbers = [1, 2, 4, 5, 6, 7, 8];
var someNumbers = [1, 2, 'привет', 4, 5, 'loftschool', 6, 7, 8];
var noNumbers = ['это', 'массив', 'без', 'чисел'];
var emptyArray = [];


function isNumber(val) {
    return typeof val === 'number';
}

var isAllTrue = function (source, filterFn) {
    try {
        if(source.length === 0) {
            throw new Error('Массив пустой!');
        }
        var errorCount = null;
        for(var i = 0; i < source.length; i++) {
            if(!filterFn(source[i])){
                errorCount++;
            }
        }
        return !(errorCount > 0);
    } catch (e) {
        console.log(`${e.name}: ${e.message}`);
    }
};

console.log(isAllTrue(allNumbers, isNumber));
console.log(isAllTrue(someNumbers, isNumber));
console.log(isAllTrue(noNumbers, isNumber));
console.log(isAllTrue(emptyArray, isNumber));


