const PART_LENGTH =  8;
const MOD = 100000000;

function split(operand) {
    operand = "0".repeat((PART_LENGTH - (operand.length % PART_LENGTH)) % PART_LENGTH) + operand;
    const parts = operand.match(new RegExp('.{1,' + PART_LENGTH + '}', 'g')).map(x => parseInt(x));

    return parts.reverse();
}

function toNumber(a) {
    var result = "";
    var temp = "";
    for (var i = 0; i < a.length - 1; i++) {
        temp = String(a[i]);
        temp = "0".repeat((PART_LENGTH - (temp.length - PART_LENGTH)) % PART_LENGTH) + temp;
        result = temp + result;
    }

    if (a[a.length - 1] > 0) {
        return String(a[a.length - 1]) + result;
    } else {
        return result;
    }

}

function compare(a, b) {
    if (a.length > b.length) {
        return 1;
    }

    if (b.length > a.length) {
        return -1;
    }

    for (var i = 0; i < a.length; i++) {
        if (a[i] > b[i]) {
            return 1;
        }

        if (b[i] > a[i]) {
            return -1;
        }
    }

    return 0;
}

function plusHelper(a, b) {
    while (a.length < b.length) {
        a.push(0);
    }

    while (b.length < a.length) {
        b.push(0);
    }

    var remainder = 0;
    var result = [];

    for (var i = 0; i < a.length; i++) {
        result.push((a[i] + b[i] + remainder) % MOD);
        remainder = ((a[i] + b[i] + remainder) / MOD) >> 0;
    }

    return result;
}

function minusHelper(a, b) {
    while (a.length < b.length) {
        a.push(0);
    }

    while (b.length < a.length) {
        b.push(0);
    }

    var remainder = 0;
    var result = [];

    for (var i = 0; i < a.length; i++) {
        if (a[i] < b[i] + remainder) {
            result.push(a[i] + MOD - (b[i] + remainder));
            remainder = 1;
        } else {
            result.push(a[i] -(b[i] + remainder));
            remainder = 0;
        }
    }

    if (result[result.length - 1] == 0) {
        result.pop();
    }
    return result;
}

function multiplyHelper(a, b) {
    var matrix = [0];
    var i = 0;
    for (i = 0; i < a.length; i++) {
        for (var j = 0; j < b.length; j++) {
            if (i + j >= matrix.length) {
                matrix.push(a[i] * b[j]);
                console.log(matrix);
            } else {
                matrix[i + j] += a[i] * b[j];
            }
        }
    }

    var remainder = 0;
    var result = [];

    for (i = 0; i < matrix.length; i++) {
        result.push((matrix[i] + remainder) % MOD);
        remainder = ((matrix[i] + remainder) / MOD) >> 0;
    }

    if (remainder > 0) {
        result.push(remainder);
    }

    return result;
}

export function plus(operandA, operandB) {
    return toNumber(plusHelper(split(operandA) , split(operandB)));
};

export function minus(operandA, operandB) {
    if (compare(operandA, operandB) < 0) {
        return "-" + toNumber(minusHelper(split(operandB), split(operandA)));
    } else {
        return toNumber(minusHelper(split(operandA), split(operandB)));
    }
};

export function multiply(operandA, operandB) {
    return toNumber(multiplyHelper(split(operandA) , split(operandB)));
};
