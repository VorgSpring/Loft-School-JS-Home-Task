var calculator = function (firstNumber) {
    var newCalculator = {
        sum: function () {
            var newNumber = firstNumber;
            for (var i = 0; i < arguments.length; i++){
                newNumber += arguments[i];
            }
            return newNumber;
        },
        dif: function () {
            var newNumber = firstNumber;
            for (var i = 0; i < arguments.length; i++){
                newNumber -= arguments[i];
            }
            return newNumber;
        },
        div: function () {
            var newNumber = firstNumber;
            for (var i = 0; i < arguments.length; i++){
                newNumber /= arguments[i];
            }
            return newNumber;
        },
        mul: function () {
            var newNumber = firstNumber;
            for (var i = 0; i < arguments.length; i++){
                newNumber *= arguments[i];
            }
            return newNumber;
        }
    };
    return newCalculator;
};

var myCalculator = calculator(100);

console.log(myCalculator.sum(1, 2, 3));
console.log(myCalculator.dif(10, 20));
console.log(myCalculator.div(2, 2));
console.log(myCalculator.mul(2, 2));
