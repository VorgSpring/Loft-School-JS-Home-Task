var CalculatorES5 = function (firstNumber) {
        this.firstNumber = firstNumber;
};

CalculatorES5.prototype = {
    sum: function () {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++){
            newNumber += arguments[i];
        }
        return newNumber;
    },
    dif: function () {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++){
            newNumber -= arguments[i];
        }
        return newNumber;
    },
    div: function () {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++){
            newNumber /= arguments[i];
        }
        return newNumber;
    },
    mul: function () {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++){
            newNumber *= arguments[i];
        }
        return newNumber;
    }
};

function inherit(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.prototype.parent = parent;
}

var SqlCalcES5 = function (firstNumber) {
    CalculatorES5.call(this, firstNumber);
};

inherit(SqlCalcES5, CalculatorES5);

SqlCalcES5.prototype = {
    sum: function () {
        return Math.pow(CalculatorES5.prototype.sum.apply(this, arguments), 2);
    },
    dif: function () {
        return Math.pow(CalculatorES5.prototype.dif.apply(this, arguments), 2);
    },
    div: function () {
        return Math.pow(CalculatorES5.prototype.div.apply(this, arguments), 2);
    },
    mul: function () {
        return Math.pow(CalculatorES5.prototype.mul.apply(this, arguments), 2);
    }
};


var myCalculator = new SqlCalcES5(100);

console.log('ECMAScript 5:');
console.log(myCalculator.sum(1, 2, 3));
console.log(myCalculator.dif(10, 20));
console.log(myCalculator.div(2, 2));
console.log(myCalculator.mul(2, 2));
