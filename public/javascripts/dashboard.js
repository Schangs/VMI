/*!
 * VMI - v1.0.0
 * Copyright 2018 Jamie Siemon
 */

var Graph;

function loadData(DateValue) {

    var Intervall;

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
                ykeys: ['AnzahlToday'],
                labels: ['Heute'],
                hideHover: 'auto',
                resize: true,
                parseTime: false,
                lineColors: ['blue', 'grey']
            });
            Intervall = request.getResponseHeader('Intervall');
            console.log(Intervall)
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