export const sumInColumn = (x: string, y: string) => {
    if (!x || !y) {
        throw new Error('need arguments');
    }

    const result = [];
    let accum = 0;

    let long, short;

    if (x.length > y.length) {
        long = x;
        short = y;
    } else {
        long = y;
        short = x;
    }

    const diff = long.length - short.length;
    let zeros = '';
    for (let index = 0; index < diff; index++) {
        zeros = zeros.concat('0');
    }
    short = `${zeros}${short}`;

    for (let i = long.length - 1; i >= 0; i--) {

        const el1 = Number(long[i])
        const el2 = Number(short[i])
        if (isNaN(el1) || isNaN(el2)) {
            throw new Error('not a number');
        }
        let currentResult = el1 + el2 + accum;
        
        if (currentResult < 10) {
            accum = 0;
        }

        if (currentResult > 9) {
            currentResult = currentResult - 10;
            accum = 1;
        }
        
        result.unshift(currentResult.toString());
    }

    if (accum === 1) {
        result.unshift('1');
    }

    return result.join('');
}

