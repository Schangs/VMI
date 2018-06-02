var express = require('express');
var fs = require('fs');
var router = express.Router();
var jsonQuery = require('json-query')
var csvjson = require('csvjson');
var core = require('../core.js');

/* GET page. */
router.get('/', function(req, res, next) {

    res.render('receipts', { title: 'Belegansicht' });

});

router.get('/data', function(req, res, next) {

    var Receipts = core.getReceipts();

    if (Receipts == undefined) {
        Receipts = {};
    } else {
        Receipts.forEach(element => {
            var sum = parseFloat(element.Umsatz.replace(',', '.'))
            element.Umsatz = sum.toFixed(2).toString().replace('.', ',') + " €";

            var saldo = parseFloat(element.Endsaldo.replace(',', '.'))
            element.Endsaldo = saldo.toFixed(2).toString().replace('.', ',') + " €";
        });
    };

    var json = JSON.stringify({
        Data: Receipts
    });

    res.send(json);
});

router.get('/:date', function(req, res, next) {

    var AppConfig = core.getAppconfig();
    var Receipts = core.getReceipts();

    var date = req.params.date;

    var jsonArr = [];

    for (i = 0; i <= 23; i++) {
        if (i <= 9) {
            i = "0" + i;
        }

        var timefrom = i + ":00";
        var timeto = i + ":59";

        var itemCount = 0;
        var amount = 0.00;

        var data1 = jsonQuery(['[*Datum=? & Uhrzeit >= ? & Uhrzeit <= ?].Uhrzeit', date, timefrom, timeto], {
            data: Receipts
        }).value;
        data1.forEach(element => {
            itemCount++;
        });

        var data2 = jsonQuery(['[*Datum=? & Uhrzeit >= ? & Uhrzeit <= ?].Umsatz', date, timefrom, timeto], {
            data: Receipts
        }).value;
        data2.forEach(element => {
            // TODO -> Auslagern in Helper function
            var sum = parseFloat(element.replace(',', '.'))
            amount = amount + sum;
        });

        jsonArr.push({
            Anzahl: itemCount,
            Umsatz: amount,
            Time: timefrom
        });
    };

    res.header({
        Intervall: AppConfig.System.UpdateIntervall.Graph
    })
    res.send(JSON.stringify(jsonArr));
});

module.exports = router;