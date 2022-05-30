const BSMModel = require('./bsm');

function getOptionAttr(up, K, days, cost, optType) {
    if (optType.toLowerCase() === 'call' || optType.toLowerCase() === 'c') {
        return CallOptionAttr(up, K, cost);
    } else if (optType.toLowerCase() === 'put' || optType.toLowerCase() === 'p') {
        return PutOptionAttr(up, K, cost);
    } else throw new Error('Unsupported Option value');
}

//TODO: Decide IV then creeks here!
function CallOptionAttr(up, K, cost) {
    let intrVal = (K < up) ? up - K : 0;
    let timeVal = cost - intrVal;

    return {intrVal: intrVal, timeVal: timeVal}
}

function PutOptionAttr(up, K, cost) {
    let intrVal = (K > up) ? K - up : 0;
    let timeVal = cost - intrVal;

    return {intrVal: intrVal, timeVal: timeVal}
}

module.exports = {
    getOptionAttr,
    CallOptionAttr,
    PutOptionAttr,
}