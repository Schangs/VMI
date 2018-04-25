var express = require('express');
var fs = require('fs');
var ini = require('ini');
var task = require('ms-task');
var cmd = require('node-cmd');
var AppConfig = require('../config.json')
var win = require("node-windows");

var router = express.Router();

var IniFile = AppConfig.Application.Path + AppConfig.Application.Data.Config
var config = ini.parse(fs.readFileSync(IniFile, 'utf-8'));

router.get('/log', function(req, res, next) {

    res.render('logfile', { title: 'VMC Log', automatennummer: config.Common.Automatennummer });

});

router.get('/updateLog', function(req, res, next) {

    res.sendFile(AppConfig.Application.Path + AppConfig.Application.Data.Log)

});

router.get('/settings', function(req, res, next) {

    res.render('vmcsettings', {
        title: 'VMC Einstellungen',
        automatennummer: config.Common.Automatennummer,
        transaktionsnummer: config.Common.Transaktionsnummer,
        vmccom: config.Common.VMCCom,
        crcom: config.Common.CRCom,
        dispcom: config.Common.DISPCom,
        cctalkcom: config.Common.ccTalkCom,
        scalingfactor: config.Common.ScalingFactor,
        vmcprice: config.Common.VMCPrice,
        pidmove: config.Common.PIDMove,
        usekctxt: config.Common.UseKCTxt,
        abbott: config.Common.Abbott,
        mdbladung: config.Common.MDBLadung,
        vktimeout: config.Common.VKTimeout,
        sc: config.Common.SC,
        startdelay: config.Common.StartDelay,
        p1: config.Abrechnung.P1,
        p2: config.Abrechnung.P2,
        p3: config.Abrechnung.P3,
        p4: config.Abrechnung.P4,
        server: config.SQL.Server,
        database: config.SQL.DataBase,
        timesync: config.SQL.TimeSync,
        monip: config.Common.MonIP,
        timeip: config.Common.TimeIP,
        typ: config.Abrechnung.Typ,
        lesertyp: config.Common.LeserTyp,
        vmctype: config.Common.VMCType,
        groups: LoadGroups()
    });

});

router.put('/settings', function(req, res, next) {

    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    config.Common.Automatennummer = req.body.automatennummer;
    config.Common.Transaktionsnummer = req.body.transaktionsnummer;
    config.Common.VMCCom = req.body.vmccom;
    config.Common.CRCom = req.body.crcom;
    config.Common.DISPCom = req.body.dispcom;
    config.Common.ccTalkCom = req.body.cctalkcom;
    config.Common.ScalingFactor = req.body.scalingfactor;
    config.Common.VMCPrice = req.body.vmcprice;
    config.Common.PIDMove = req.body.pidmove;
    config.Common.UseKCTxt = req.body.usekctxt;
    config.Common.Abbott = req.body.abbott;
    config.Common.VKTimeout = req.body.vktimeout;
    config.Common.SC = req.body.sc;
    config.Common.StartDelay = req.body.startdelay;
    config.Common.MonIP = req.body.monip;
    config.Common.TimeIP = req.body.timeip;
    config.Common.MDBLadung = req.body.mdbladung;
    config.Abrechnung.Typ = req.body.typ;
    config.Abrechnung.P1 = req.body.p1;
    config.Abrechnung.P2 = req.body.p2;
    config.Abrechnung.P3 = req.body.p3;
    config.Abrechnung.P4 = req.body.p4;
    config.SQL.Server = req.body.server;
    config.SQL.DataBase = req.body.database;
    config.SQL.TimeSync = req.body.timesync;
    config.Common.LeserTyp = req.body.lesertyp;
    config.Common.VMCType = req.body.vmctype;

    task.kill(AppConfig.Application.Executable);

    fs.writeFileSync(IniFile, ini.stringify(config));

    win.sudo(AppConfig.Application.Path + AppConfig.Application.Executable, '');
    console.log(AppConfig.Application.Path + AppConfig.Application.Executable);
    res.sendStatus(200);

});

// !!!!!!!!!!!!!TOOODOOOO!!!!!!!!!!!!!
router.get('/price', function(req, res, next) {

    fs.createReadStream("public/winvmc/daten/Prs00010.dat") //Auslagern in Settings?!
        .pipe(csv())
        .on('data', function(data) {
            console.log(data)
        })
});

router.get('/info', function(req, res, next) {

    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    res.sendFile(AppConfig.Application.Path + AppConfig.Application.Data.Info)

});

router.get('/manual', function(req, res, next) {

    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    res.sendFile(AppConfig.Application.Path + AppConfig.Application.Data.Manual)

});

function LoadGroups() {

    var data = fs.readFileSync('config.json', {
        encoding: 'utf8'
    });
    var AppConfig = JSON.parse(data)

    var csvjson = require('csvjson');

    const csvFilePath = AppConfig.Application.Path + AppConfig.Application.Data.Groups

    if (fs.existsSync(csvFilePath) == false) {
        return {};
    }

    var data = fs.readFileSync(csvFilePath, { encoding: 'utf8' });

    var options = {
        delimiter: ';', // optional 
        quote: '"', // optional 
        headers: "Benutzergruppe;Untergruppe;Preisliste;Zahlungsart;Zuschuss;Zähler;Typ;Zuschusswahlen;Wert;GültigVon;GültigBis;Keycardtxt;"
    };

    var Groups = csvjson.toObject(data, options);
    return Groups;
}

function WriteToCSV(objArray, filePath) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    console.log(array.length)

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'

            line += array[i][index];
        }

        str += line + ';\r\n';
    }
    fs.writeFileSync(filePath, str);
    return str;
}
module.exports = router;