/*!
 * VMI - v1.0.0
 * Copyright 2018 Jamie Siemon
 */

var Graph;

function loadData(DateValue) {

    var Intervall = 300000;

    $.ajax({
        type: 'GET',
        url: "/receipts/" + DateValue,
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(json, textStatus, request) {
            Graph = Morris.Line({
                element: 'dayli-chart',
                data: json,
                xkey: 'Time',
                ykeys: ['Anzahl', 'Umsatz'],
                labels: ['Anzahl', 'Umsatz €'],
                hideHover: 'auto',
                resize: true,
                parseTime: false,
                lineColors: ['blue', 'green']
            });
            Intervall = request.getResponseHeader('Intervall');
        }
    });

    setInterval(function() {
        updateLiveGraph(Graph, DateValue);
    }, Intervall);

    var Intervall = 60000;

    $.ajax({
        type: 'GET',
        url: "/system/usage",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(json, textStatus, request) {
            var CPUPanel = $('#CPUPanel');
            var CPUValue = $('#CPUValue');
            var CPUProgressBar = $('#CPUProgressBar');

            var RAMPanel = $('#RAMPanel');
            var RAMValue = $('#RAMValue');
            var RAMProgressBar = $('#RAMProgressBar');

            var HDDPanel = $('#HDDPanel');
            var HDDMount = $('#HDDMount');
            var HDDValue = $('#HDDValue');
            var HDDProgressBar = $('#HDDProgressBar');

            Intervall = request.getResponseHeader('Intervall');
            var Thresholds = JSON.parse(request.getResponseHeader('Thresholds'));

            $('.panel-success').removeClass('panel-success');
            $('.panel-warning').removeClass('panel-warning');
            $('.panel-danger').removeClass('panel-danger');

            $('.progress-bar-success').removeClass('progress-bar-success');
            $('.progress-bar-warning').removeClass('progress-bar-warning');
            $('.progress-bar-danger').removeClass('progress-bar-danger');



            if (json.cpu >= Thresholds.Danger) {
                CPUPanel.addClass('panel-danger');
                CPUProgressBar.addClass('progress-bar-danger')
            } else if (json.cpu >= Thresholds.Warning) {
                CPUPanel.addClass('panel-warning');
                CPUProgressBar.addClass('progress-bar-warning')
            } else {
                CPUPanel.addClass('panel-success');
                CPUProgressBar.addClass('progress-bar-success')
            }

            CPUValue.text(json.cpu + "% Auslastung");
            CPUProgressBar.width(json.cpu + "%");


            if (json.mem >= Thresholds.Danger) {
                RAMPanel.addClass('panel-danger');
                RAMProgressBar.addClass('progress-bar-danger')
            } else if (json.mem >= Thresholds.Warning) {
                RAMPanel.addClass('panel-warning');
                RAMProgressBar.addClass('progress-bar-warning')
            } else {
                RAMPanel.addClass('panel-success');
                RAMProgressBar.addClass('progress-bar-success')
            }

            RAMValue.text(json.mem + "% Auslastung");
            RAMProgressBar.width(json.mem + "%");


            if (json.fs.use >= Thresholds.Danger) {
                HDDPanel.addClass('panel-danger');
                HDDProgressBar.addClass('progress-bar-danger')
            } else if (json.fs.use >= Thresholds.Warning) {
                HDDPanel.addClass('panel-warning');
                HDDProgressBar.addClass('progress-bar-warning')
            } else {
                HDDPanel.addClass('panel-success');
                HDDProgressBar.addClass('progress-bar-success')
            }

            HDDValue.text(json.fs.use + "% Belegt");
            HDDProgressBar.width(json.fs.use + "%");
            HDDMount.text(json.fs.mount)
        }
    });
    setInterval(function() {
        updateHardwareMonitor()
    }, Intervall);
}

function updateLiveGraph(Graph, DateValue) {
    $.ajax({
        type: 'GET',
        url: "/receipts/" + DateValue,
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(json) {
            Graph.setData(json);
        }
    });
}

function updateGraph(DateValue) {
    $.ajax({
        type: 'GET',
        url: "/receipts/" + DateValue,
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(json) {
            Graph.setData(json);
        }
    });
}

function updateHardwareMonitor() {
    var Intervall = 60000;

    $.ajax({
        type: 'GET',
        url: "/system/usage",
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function(json, textStatus, request) {
            var CPUPanel = $('#CPUPanel');
            var CPUValue = $('#CPUValue');
            var CPUProgressBar = $('#CPUProgressBar');

            var RAMPanel = $('#RAMPanel');
            var RAMValue = $('#RAMValue');
            var RAMProgressBar = $('#RAMProgressBar');

            var HDDPanel = $('#HDDPanel');
            var HDDMount = $('#HDDMount');
            var HDDValue = $('#HDDValue');
            var HDDProgressBar = $('#HDDProgressBar');

            Intervall = request.getResponseHeader('Intervall');
            var Thresholds = JSON.parse(request.getResponseHeader('Thresholds'));

            $('.panel-success').removeClass('panel-success');
            $('.panel-warning').removeClass('panel-warning');
            $('.panel-danger').removeClass('panel-danger');

            $('.progress-bar-success').removeClass('progress-bar-success');
            $('.progress-bar-warning').removeClass('progress-bar-warning');
            $('.progress-bar-danger').removeClass('progress-bar-danger');



            if (json.cpu >= Thresholds.Danger) {
                CPUPanel.addClass('panel-danger');
                CPUProgressBar.addClass('progress-bar-danger')
            } else if (json.cpu >= Thresholds.Warning) {
                CPUPanel.addClass('panel-warning');
                CPUProgressBar.addClass('progress-bar-warning')
            } else {
                CPUPanel.addClass('panel-success');
                CPUProgressBar.addClass('progress-bar-success')
            }

            CPUValue.text(json.cpu + "% Auslastung");
            CPUProgressBar.width(json.cpu + "%");


            if (json.mem >= Thresholds.Danger) {
                RAMPanel.addClass('panel-danger');
                RAMProgressBar.addClass('progress-bar-danger')
            } else if (json.mem >= Thresholds.Warning) {
                RAMPanel.addClass('panel-warning');
                RAMProgressBar.addClass('progress-bar-warning')
            } else {
                RAMPanel.addClass('panel-success');
                RAMProgressBar.addClass('progress-bar-success')
            }

            RAMValue.text(json.mem + "% Auslastung");
            RAMProgressBar.width(json.mem + "%");


            if (json.fs.use >= Thresholds.Danger) {
                HDDPanel.addClass('panel-danger');
                HDDProgressBar.addClass('progress-bar-danger')
            } else if (json.fs.use >= Thresholds.Warning) {
                HDDPanel.addClass('panel-warning');
                HDDProgressBar.addClass('progress-bar-warning')
            } else {
                HDDPanel.addClass('panel-success');
                HDDProgressBar.addClass('progress-bar-success')
            }

            HDDValue.text(json.fs.use + "% Belegt");
            HDDProgressBar.width(json.fs.use + "%");
            HDDMount.text(json.fs.mount)
        }
    });
}