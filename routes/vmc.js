var express = require('express');
var fs = require('fs');
var ini = require('ini');
var task = require('ms-task');
var cmd = require('node-cmd');
var core = require('../core')

var router = express.Router();

var AppConfig = core.getAppconfig();
var config = core.getINI();

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
        vmctype: config.Common.VMCType
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

    var IniFile = AppConfig.Application.Path + AppConfig.Application.Data.Config;
    fs.writeFileSync(IniFile, ini.stringify(config));

    WriteToCSV(req.body.groups, AppConfig.Application.Path + AppConfig.Application.Data.Groups)

    cmd.run(AppConfig.Application.Path + AppConfig.Application.Executable);
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

router.get('/groups', function(req, res, next) {

    var Groups = core.getGroups();

    if (Groups.Benutzergruppe == "Keine Daten in der Tabelle vorhanden") {
        Groups = {};
    }

    var json = JSON.stringify({
        Data: Groups
    });

    res.send(json);
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


function WriteToCSV(objArray, filePath) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    if (array[0].Benutzergruppe == "Keine Daten in der Tabelle vorhanden") {
        fs.unlink(filePath);
        return;
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'

            line += array[i][index];
        }

        str += line + ';\r\n';
    }
    fs.writeFileSync(filePath, str);
}

module.exports = router;