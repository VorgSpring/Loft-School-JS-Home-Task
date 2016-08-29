class CalculatorES6 {
    constructor(firstNumber) {
        this.firstNumber = firstNumber;
    }

    sum() {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++) {
            newNumber += arguments[i];
        }
        return newNumber;
    }

    dif() {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++) {
            newNumber -= arguments[i];
        }
        return newNumber;
    }

    div() {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++) {
            newNumber /= arguments[i];
        }
        return newNumber;
    }

    mul() {
        var newNumber = this.firstNumber;
        for (var i = 0; i < arguments.length; i++) {
            newNumber *= arguments[i];
        }
        return newNumber;
    }
}


class SqlCalcES6 extends CalculatorES6 {
    constructor(firstNumber) {
        super(firstNumber);
    }

    sum() {
        return Math.pow(super.sum(...arguments), 2);
    }
    dif() {
        return Math.pow(super.dif(...arguments), 2);
    }
    div() {
        return Math.pow(super.div(...arguments), 2);
    }
    mul() {
        return Math.pow(super.mul(...arguments), 2);
    }
}


var myCalculator = new SqlCalcES6(100);

console.log('ECMAScript 6:');
console.log(myCalculator.sum(1, 2, 3));
console.log(myCalculator.dif(10, 20));
console.log(myCalculator.div(2, 2));
console.log(myCalculator.mul(2, 2));
