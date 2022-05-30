const math = require('mathjs');
//因为已经用了Ln(S0/K)，所以这里直接用普通正态分布就可以了，而不需要使用对数正正态分布
const normal = require('jstat').normal;


function BSMModel(K, t, iv, R, optType) {
    this.T = t / 365;
    this.K = K;
    this.R = R;
    this.iv = iv;
    this.decimal = 4;
    this.sign = this.getSign(optType)
    this.sqrtT = this.getAnnualizedT(this.T);
    this.aV = this.getAnnualizedVolatility(this.iv);
    this.enrt = this.getAnnualizedRiskFreeProfit(this.T, this.R);
}

BSMModel.prototype.setRound = function (decimal) {
    this.decimal = decimal;
}

BSMModel.prototype.getAnnualizedRiskFreeProfit = function (T, R) {
    let nrt = R * T * -1;
    return math.pow(math.e, nrt);
}

BSMModel.prototype.getAnnualizedT = function (T) {
    return math.sqrt(T);
}

BSMModel.prototype.getAnnualizedVolatility = function (sigmaIV) {
    return sigmaIV * this.sqrtT;
}

BSMModel.prototype.getD1 = function (S0, K, T, sigmaIV, R, aV) {
    let val_log = math.log(S0 / K);
    let val_rvt = (R + sigmaIV * sigmaIV / 2) * T;
    d1 = (val_log + val_rvt) / aV;
    return d1;
}

BSMModel.prototype.getSign = function (optType) {
    if (optType.toLowerCase() === 'call' || optType.toLowerCase() === 'c') {
        return 1;
    } else if (optType.toLowerCase() === 'put' || optType.toLowerCase() === 'p') {
        return -1;
    } else throw new Error('Unsupported Option value');
}

BSMModel.prototype.calcForPrice = function (S0) {
    this.d1 = this.getD1(S0, this.K, this.T, this.iv, this.R, this.aV);
    this.cdf1 = normal.cdf(this.d1 * this.sign, 0.0, 1);
    this.d2 = this.d1 - this.aV;
    this.cdf2 = normal.cdf(this.d2 * this.sign, 0.0, 1);
    this.S0 = S0;
}

BSMModel.prototype.getOptValue = function () {
    let optVal = (this.S0 * this.cdf1 - this.K * this.enrt * this.cdf2) * this.sign;
    return math.round(optVal, this.decimal);
}

BSMModel.prototype.getCreeks = function () {
    this.delta = this.sign * this.cdf1;
    this.delta = math.round(this.delta, this.decimal);
    this.pdf1 = normal.pdf(this.d1, 0.0, 1);
    this.gamma = this.pdf1 / (this.S0 * this.aV);
    this.gamma = math.round(this.gamma, this.decimal);
    let spdf1 = this.S0 * this.pdf1;
    this.vega = spdf1 * this.sqrtT;
    this.vega = math.round(this.vega, this.decimal);
    this.theta = -1 * ((spdf1 * this.iv) / (2 * this.sqrtT) - this.sign * (this.R * this.K * this.enrt * this.cdf2));
    this.theta = math.round(this.theta, this.decimal);

    return {delta: this.delta, gamma: this.gamma, vega: this.vega, theta: this.theta};
}


module.exports = BSMModel;