var express = require('express');
var router = express.Router();
var si = require('systeminformation');
var core = require('../core')


/* GET home page. */
router.get('/usage', function(req, res, next) {

    var Appconfig = core.getAppconfig();

    si.currentLoad(function(cpudata) {
        si.mem(function(memdata) {
            si.fsSize(function(fsdata) {
                var data = JSON.stringify({
                    cpu: Math.round(cpudata.currentload),
                    mem: Math.round((memdata.used * 100) / memdata.total),
                    fs: {
                        mount: fsdata[0].mount,
                        use: Math.round(fsdata[0].use)
                    }
                })
                res.header({
                    Intervall: Appconfig.System.UpdateIntervall.HardwareMonitor,
                    Thresholds: JSON.stringify(Appconfig.System.Thresholds)
                })
                res.status(200);
                res.send(data);
            })

        })
    })

});

router.get('/data', function(req, res, next) {
    si.getAllData(function(data) {
        res.status(200);
        res.send(data);
    })
});


module.exports = router