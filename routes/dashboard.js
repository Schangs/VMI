var express = require('express');
var router = express.Router();
var ini = require('ini');
var fs = require('fs');
var csvjson = require('csvjson');
var core = require('../core.js');

/* GET home page. */
router.get('/', function(req, res, next) {

    var AppConfig = core.getAppconfig();
    var config = core.getINI()
    var Receipts = core.getReceipts()


    if (Receipts != undefined) {
        var Sales = Receipts.length

        var Amount = 0;

        Receipts.forEach(element => {
            var sum = parseFloat(element.Umsatz.replace(',', '.'))
            Amount = Amount + sum;
        });

        var Total = Amount.toFixed(2).toString().replace('.', ',');

        res.render('dashboard', { title: 'Dashboard', automatennummer: config.Common.Automatennummer, sales: Sales, amount: Total });
    } else {
        res.render('dashboard', { title: 'Dashboard', automatennummer: config.Common.Automatennummer, sales: 'Keine Daten', amount: 'Keine Daten' });
    }
});

module.exports = router