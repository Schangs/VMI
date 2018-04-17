var express = require('express');
var fs = require('fs');
var router = express.Router();
var jsonQuery = require('json-query')
var csvjson = require('csvjson');

/* GET page. */
router.get('/', function(req, res, next) {

    res.render('receipts', { title: 'Belegansicht' });

});

router.get('/data', function(req, res, next) {

    // TODO -> In eigenes Modul auslagern?
    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    const csvFilePath = AppConfig.Application.Path + AppConfig.Application.Data.Receipts

    var csvdata = fs.readFileSync(csvFilePath, {
        encoding: 'utf8'
    });

    var options = {
        delimiter: ';', // optional 
        quote: '"', // optional 
        headers: "Datum;Uhrzeit;Stationsnummer;Belegnummer;Kassierer;Zahlart;Key/Card;Benutzergruppe;Benutzeruntergruppe;Kostenstelle;Preisliste;Subventionsstufe;Positionstyp;Artikelnummer;Steuer;Menge;Umsatz;Artikelbezeichnung;Endsaldo;Standard-Preis;Vorgangszähler;Gewicht;Währungskennzeichen;Kostenstellen-Zusatzinfo;"
    };
    //----------

    var Receipts = csvjson.toObject(csvdata, options);

    Receipts.forEach(element => {
        var sum = parseFloat(element.Umsatz.replace(',', '.'))
        element.Umsatz = sum.toFixed(2).toString().replace('.', ',') + " €";

        var saldo = parseFloat(element.Endsaldo.replace(',', '.'))
        element.Endsaldo = saldo.toFixed(2).toString().replace('.', ',') + " €";
    });

    var json = JSON.stringify({
        Data: Receipts
    });

    res.send(json);
});

router.get('/:date', function(req, res, next) {

    // TODO -> In eigenes Modul auslagern?
    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    const csvFilePath = AppConfig.Application.Path + AppConfig.Application.Data.Receipts

    var csvdata = fs.readFileSync(csvFilePath, {
        encoding: 'utf8'
    });

    var options = {
        delimiter: ';', // optional 
        quote: '"', // optional 
        headers: "Datum;Uhrzeit;Stationsnummer;Belegnummer;Kassierer;Zahlart;Key/Card;Benutzergruppe;Benutzeruntergruppe;Kostenstelle;Preisliste;Subventionsstufe;Positionstyp;Artikelnummer;Steuer;Menge;Umsatz;Artikelbezeichnung;Endsaldo;Standard-Preis;Vorgangszähler;Gewicht;Währungskennzeichen;Kostenstellen-Zusatzinfo;"
    };
    //----------

    var Receipts = csvjson.toObject(csvdata, options);

    var date1 = req.params.date;

    console.log(date1);

    var date2 = date1 - 1

    console.log(date2)

    var jsonArr = [];

    for (i = 0; i <= 23; i++) {
        if (i <= 9) {
            i = "0" + i;
        }

        var timefrom = i + ":00";
        var timeto = i + ":59";

        var itemCount = 0;
        var itemCount2 = 0;

        var data1 = jsonQuery(['[*Datum=? & Uhrzeit >= ? & Uhrzeit <= ?].Uhrzeit', date1, timefrom, timeto], {
            data: Receipts
        }).value;
        data1.forEach(element => {
            itemCount++;
        });

        var data2 = jsonQuery(['[*Datum=? & Uhrzeit >= ? & Uhrzeit <= ?].Uhrzeit', date2, timefrom, timeto], {
            data: Receipts
        }).value;
        data2.forEach(element => {
            itemCount2++;
        });

        jsonArr.push({
            AnzahlToday: itemCount,
            AnzahlYesterday: itemCount2,
            Time: timefrom
        });
    };

    res.header({
        Intervall: AppConfig.System.UpdateIntervall.Graph
    })
    res.send(JSON.stringify(jsonArr));
});

module.exports = router;