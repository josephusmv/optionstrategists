const BSMModel = require('./bsm');

function calcForOptValue(S0, K, t, iv, optType) {
    let bsm = new BSMModel(K, t, iv, R, optType);
    bsm.setRound(4);
    bsm.calcForPrice(S0);
    let optVal = bsm.getOptValue();
    let creeks = bsm.getCreeks();
    console.log(`------- ${K} =========>  ${optType}: ${optVal}, ${JSON.stringify(creeks)}`);
}

var R = 0.1;
// 标准测试
calcForOptValue(45, 50, 60, 0.3, 'C');

var R =0.04;
// CAll OTM:
calcForOptValue(2.744, 2.8, 25, 0.1793,  'C');

// CAll ITM:
calcForOptValue(2.744, 2.6, 25, 0.2135,  'C');

// CAll deep OTM:
calcForOptValue(2.744, 2.95, 25, 0.1861,  'C');

// CAll deep ITM:
calcForOptValue(2.744, 2.45, 25, 0.2051,  'C');


// PUT OTM:
calcForOptValue(2.744, 2.7, 25, 0.1942,  'P');

// PUT ITM:
calcForOptValue(2.744, 2.85, 25, 0.1853,  'P');

// PUT Deep OTM:
calcForOptValue(2.744, 2.50, 25, 0.227, 'P');

// PUT Deep ITM:
calcForOptValue(2.744, 2.95, 25, 0.2012,  'P');