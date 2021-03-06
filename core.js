module.exports = {
    getAppconfig: getAppconfig,
    getReceipts: getReceipts,
    getINI: getINI,
    getGroups: getGroups,
    checkLogDirectory: checkLogDirectory
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
};

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
};

function getGroups() {

    var AppConfig = getAppconfig()

    var csvFilePath = AppConfig.Application.Path + AppConfig.Application.Data.Groups

    var Groups = { Benutzergruppe: "Keine Daten in der Tabelle vorhanden" };

    if (fs.existsSync(csvFilePath) === true) {
        try {
            var csvdata = fs.readFileSync(csvFilePath, {
                encoding: 'utf8'
            });

            var options = {
                delimiter: ';', // optional 
                quote: '"', // optional 
                headers: "Benutzergruppe;Untergruppe;Preisliste;Zahlungsart;Zuschuss;Zähler;Typ;Zuschusswahlen;Wert;GültigVon;GültigBis;KeyCard;"
            };

            Groups = csvjson.toObject(csvdata, options);
        } catch (error) {
            console.log(error)
        }
    }

    return Groups
};

function getINI() {
    try {
        var AppConfig = getAppconfig()

        var IniFile = AppConfig.Application.Path + AppConfig.Application.Data.Config

        var config = ini.parse(fs.readFileSync(IniFile, 'utf-8'));

        return config
    } catch (error) {
        console.log(error)
    }
};


function checkLogDirectory() {
    let logDirectory = "./logs";

    if (fs.existsSync(logDirectory) == false) {
        fs.mkdirSync(logDirectory);
        fs.writeFileSync(logDirectory + "/app.log");
    }
}