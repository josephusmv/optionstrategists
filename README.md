# Starter of this project

## 1. Description

A Option Strategy analysis open source project. 

As a common conventions, the calculation is based on the __BSM(Black-Scholes-Merton)__. 
All other calculations theories, like expectation/probability/volatility are 
based on the beginner's book: _'Options As A Strategic Investment: 5th Edition'_, by By Lawrence G. McMillan.

This is still a very naive library for now, which can do very few things and does not making any promise about
the accuracy of any strategy analysis results now. Though I am really making money with the ancaster of a 
python version of this project.

Yes, there was a python version I wrote before, and I am just trying to translate everything from that version.
The reason is that I found the calculations here is not so differents to python version. 
E.g., PDF and CDF from both language could yield same results. 
Though in theory, there are slightly differences of the performance.
But that is not matters so much, since some HUGH calculations like probability calc are very time consuming anyway.

## 2. Architection and implmentation

This is a simple CS prject, the server side uses express.js and front-end is just for demo the results and show earn charts.
Requests are using simple _Post-with-JSON_ style. 

I don't expectiong to involve many programing techs here, just try to make the calculation as more explicit as possible.

This is a node+express project, and just like any other node-express projects do, you do:

```bash
npm install
npm start
```

## 3. Features lists
Here are planned features this project. 

1. earn charts:
2. creeks charts
3. time-view candle charts
4. expectation and probablity
5. nutrual porfolio calculation
6. volatility deduction
7. ....

Most of the listed features have been implemented in the python version already, but some of them has certain defects.
And you can see that non of them implemented in this project. And it will be, consider this as a promise.
:-)

## 4. Author:
I am a personal trader, and I don't consider myself as a quant. Since quants is a very broad idea may refer to bussiness analyzer or quant traders.

As Option strategists, we have something similar to quants. But generally I think option strategists has certain different to the quants. 
Generally, the quants are either more concentrates on fundamentals or more dynamics. But option strategists are more statics and statistics. 
Yes, statistic arbitrage are dangerouse. And the option strategists should just consider eliminates those dangers with there knowledges.

This is a personal project, and I am working along:

__Any kinds of helps, suggestions, criticism or collaborates are highly welcomed__.