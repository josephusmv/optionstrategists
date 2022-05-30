const express = require('express');
const createError = require("http-errors");
const router = express.Router();
const EarnCalculator = require('../core/calcearns')
const {number} = require("mathjs");

function checkParams(bodyJson){
    let incommingKeys = Object.keys(bodyJson);
    for(let requireKey of ['curPrice', 'ivHigh', 'ivLow', 'legs', 'hdays', 'rfir']){
        if(!incommingKeys.includes(requireKey)){
            return false;
        }
    }

    if(bodyJson.legs.length < 1)
        return false;

    for(let leg of bodyJson.legs){
        if(leg.length !== 6)
            return false;
    }

    return true;
}

function getLetsInfo(legs){
    let legsObj = []
    for(let leg of legs){
        legsObj.push({
            K: parseFloat(leg[0]),
            optType:leg[1],
            opr: leg[2],
            cost: parseFloat(leg[3]),
            lots: parseFloat(leg[4]),
            days: parseFloat(leg[5])
        })
    }
    return  legsObj;
}

router.post('/', function(req, res, next){
    if(req.method.toLowerCase() !== 'post'){
        next(createError(400));
    }
    let bodyJson = JSON.parse(JSON.stringify(req.body));

    if(!checkParams(bodyJson)){
        res
            .status(400)
            .json({ message: "Mandatory field is missing." })
        return;
    }
    bodyJson.legs = getLetsInfo(bodyJson.legs);
    let earnCalc = new EarnCalculator(bodyJson);
    try{
        let reslt = earnCalc.calc();
        if(reslt != null)
            res.send(reslt);
        else {
            res.status(400).json({ message: "faied to calculate results." })
        }
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: "Server internal error." })
    }
});

module.exports = router;
