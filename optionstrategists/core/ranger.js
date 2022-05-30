const math = require("mathjs");

function PriceRanger(curPrice) {
    this.curPrice = curPrice;
}

PriceRanger.prototype.getPriceRangeNaive = function () {
    let start = this.curPrice * 0.7;
    let end = this.curPrice * 1.3;
    let step = math.round((end - start) / 30, 4);

    let range = [];
    for (let p = start; p <= end;) {
        p = math.round(p, 4);
        range.push(p);
        if (p + step > this.curPrice)
            range.push(this.curPrice);
        p = p + step;
    }
    range.sort()
    return [...new Set(range)];
}

module.exports = PriceRanger;