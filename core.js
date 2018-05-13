module.exports = {
    getAppconfig: getAppconfig,
    getReceipts: getReceipts,
    getINI: getINI
}

var fs = require('fs');
var csvjson = require('csvjson');
var ini = require('ini');
var os = require('os');

function getAppconfig() {
    try {
        var data = fs.readFileSync('config.json', {
            encoding: 'utf8'
        });
        var AppConfig = JSON.parse(data)

        return AppConfig

    } catch (error) {
        console.log(error)
    }
}

function getReceipts() {

    var AppConfig = getAppconfig()

    var csvFilePath = AppConfig.Application.Path + AppConfig.Application.Data.Receipts

    try {
        var csvdata = fs.readFileSync(csvFilePath, {
            encoding: 'utf8'
        });

        var options = {
            delimiter: ';', // optional 
            quote: '"', // optional 
            headers: "Datum;Uhrzeit;Stationsnummer;Belegnummer;Kassierer;Zahlart;Key/Card;Benutzergruppe;Benutzeruntergruppe;Kostenstelle;Preisliste;Subventionsstufe;Positionstyp;Artikelnummer;Steuer;Menge;Umsatz;Artikelbezeichnung;Endsaldo;Standard-Preis;Vorgangszähler;Gewicht;Währungskennzeichen;Kostenstellen-Zusatzinfo;"
        };

        var Receipts = csvjson.toObject(csvdata, options);
        return Receipts
    } catch (error) {
        console.log(error)
    }
}

function getINI() {
    try {
        var AppConfig = getAppconfig()

        var IniFile = AppConfig.Application.Path + AppConfig.Application.Data.Config

        var config = ini.parse(fs.readFileSync(IniFile, 'utf-8'));

        return config
    } catch (error) {
        console.log(error)
        return {}
    }
};