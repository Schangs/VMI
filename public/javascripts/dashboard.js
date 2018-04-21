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