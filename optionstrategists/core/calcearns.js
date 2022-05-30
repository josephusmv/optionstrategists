const BSMModel = require('./bsm');
const PriceRanger = require('./ranger');
const {min} = require("mathjs");
const {getOptionAttr} = require('./optattr');
const math = require("mathjs");


function EarnCalculator(paramsJSON) {
    this.ivHigh = parseFloat(paramsJSON.ivHigh);
    this.ivLow = parseFloat(paramsJSON.ivLow);
    this.rfir = parseFloat(paramsJSON.rfir);
    this.curPrice = parseFloat(paramsJSON.curPrice);
    this.legs = paramsJSON.legs;
    this.priceRange = new PriceRanger(this.curPrice).getPriceRangeNaive();
    this.getDays(parseFloat(paramsJSON.hdays));
}

EarnCalculator.prototype.calcExample = function () {
    let testBody = {
        title: 'Short-5-C-Long-4-P', curPrice: 45, datas: {
            price: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
            ivlow: [7, 6, 5, 4, 3, 3, 2, 1, -5, -7, -9],
            ivhigh: [7, 5, 5, 4, 3, 2, 1, -1, -5, -7, -9],
            mature: [8, 7, 7, 6, 6, 3, 1, -1, -5, -7, -9]
        },
        info: {
            boughtTimeValue: -123,
            profitPoint: [44, 45, 46],
            debitCredit: -345,
        }
    };
    return testBody;
}
EarnCalculator.prototype.calc = function () {
    let {title, info} = this.getInfo();
    let ivlowResults = this.calcImmature(this.ivLow, info);
    let ivhighResults = this.calcImmature(this.ivHigh, info);
    let matureResult = this.calcMature(info);

    return {
        title: title, curPrice: this.curPrice, datas: {
            price: this.priceRange,
            ivlow: ivlowResults.earn,
            ivhigh: ivhighResults.earn,
            mature: matureResult
        },
        info: info
    };
}

EarnCalculator.prototype.getDays = function (hdays) {
    this.minDays = this.legs[0].days;
    for (let i = 1; i < this.legs.length; i++) {
        if (this.legs[i].days < 1) this.legs[i].days = 1;
        this.minDays = min(this.minDays, this.legs[i].days);
    }

    this.hdays = (hdays < 1) ? 1 : (hdays > this.minDays) ? this.minDays : hdays;
}

EarnCalculator.prototype.getInfo = function () {
    let costTotal = 0;
    let boughtTV = 0;
    for (let leg of this.legs) {
        let optInfo = getOptionAttr(this.curPrice, leg.K, leg.days, leg.cost, leg.optType);
        if (leg.opr.toLowerCase() === 'Long') {
            costTotal = costTotal - leg.cost * leg.lots;
            boughtTV = boughtTV + optInfo.timeVal;
        } else if (leg.opr.toLowerCase() === 'Short') {
            costTotal = costTotal + leg.cost * leg.lots;
            boughtTV = boughtTV - optInfo.timeVal;
        }
        leg.info = optInfo;
    }

    return {
        boughtTimeValue: boughtTV,
        profitPoint: {},
        debitCredit: costTotal,
    }
}

function calcEarnImmature(price, legs) {
    let earn = 0;
    let delta = 0;
    let gamma = 0;
    let vega = 0;
    let theta = 0;
    for (let leg of legs) {
        let bsm = leg.bsm;
        bsm.setRound(4);
        bsm.calcForPrice(price);
        let optVal = bsm.getOptValue();
        let creeks = bsm.getCreeks();
        if (leg.opr.toLowerCase() === 'long') {
            earn = earn + (optVal - leg.cost) * leg.lots;
            delta = delta + creeks[delta] * leg.lots;
            gamma = gamma + creeks[gamma] * leg.lots;
            vega = vega + creeks[vega] * leg.lots;
            theta = theta + creeks[theta] * leg.lots;
        } else if (leg.opr.toLowerCase() === 'short') {
            earn = earn + (leg.cost - optVal) * leg.lots;
            delta = delta - creeks[delta] * leg.lots;
            gamma = gamma - creeks[gamma] * leg.lots;
            vega = vega - creeks[vega] * leg.lots;
            theta = theta - creeks[theta] * leg.lots;
        }
    }
    return {
        earn: math.round(earn, 4),
        delta: math.round(delta, 4),
        gamma: math.round(gamma, 4),
        vega: math.round(vega, 4),
        theta: math.round(theta, 4)
    };
}

EarnCalculator.prototype.calcImmature = function (iv) {
    let results = {earn: [], delta: [], gamma: [], vega: [], theta: []};
    for (let leg of this.legs) {
        let t = (leg.days > this.hdays) ? leg.days - this.hdays : 1;
        let bsm = new BSMModel(leg.K, t, iv, this.rfir, leg.optType);
        leg.bsm = bsm;
    }
    for (let price of this.priceRange) {
        let rslt = calcEarnImmature(price, this.legs);
        results.earn.push(rslt.earn);
        results.delta.push(rslt.delta);
        results.gamma.push(rslt.gamma);
        results.vega.push(rslt.vega);
        results.theta.push(rslt.theta);
    }
    return results;
}


function calcEarnMature(price, legs) {
    let earn = 0;
    for (let leg of legs) {
        let optVal = 0;
        if (leg.days > this.minDays) {
            let t = leg.days - this.minDays;
            let iv = (this.ivLow + this.ivHigh) / 2;
            let bsm = new BSMModel(leg.K, t, iv, this.rfir, leg.optType);
            bsm.setRound(4);
            bsm.calcForPrice(price);
            optVal = bsm.getOptValue();
        } else {
            if (leg.optType.toLowerCase() === 'call') {
                optVal = (price > leg.K) ? price - leg.K : 0;
            } else if (leg.optType.toLowerCase() === 'put') {
                optVal = (price < leg.K) ? leg.K - price : 0;
            }
        }
        if (leg.opr.toLowerCase() === 'long') {
            earn = earn + (optVal - leg.cost) * leg.lots;
        } else if (leg.opr.toLowerCase() === 'short') {
            earn = earn + (leg.cost - optVal) * leg.lots;
        }
    }
    return math.round(earn, 4);
}

EarnCalculator.prototype.calcMature = function () {
    let results = []
    for (let price of this.priceRange) {
        let earn = calcEarnMature(price, this.legs);
        results.push(earn);
    }
    return results
}

module.exports = EarnCalculator;