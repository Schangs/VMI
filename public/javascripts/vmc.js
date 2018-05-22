/*!
 * VMI - v1.0.0
 * Copyright 2018 Jamie Siemon
 */


var selectedRowIndex = null;

function ConvertCheckboxState(value) {
    if (value == true) {
        return 1
    } else return 0;
}

function SaveINI() {

    var jsonArr = [];

    var table = document.getElementById("GroupTable");

    var rowCollection = table.rows.length - 1

    for (i = 1; i < rowCollection; ++i) {
        var row = table.rows[i]
        var cellData = []
        for (var j = 0, col; col = row.cells[j]; j++) {
            cellData.push(col.innerHTML)
            console.log(col)
        }
        console.log(cellData)
        jsonArr.push({
            Benutzergruppe: cellData[0],
            Untergruppe: cellData[1],
            Preisliste: cellData[2],
            Zahlungsart: cellData[3],
            Zuschuss: cellData[4],
            Zähler: cellData[5],
            Typ: cellData[6],
            Wert: cellData[7],
            Zuschusswahlen: cellData[8],
            GültigVon: cellData[9],
            GültigBis: cellData[10],
            Keycardtxt: cellData[11],
        });
    }

    if (confirm('Sollen die Einstellungen übernommen werden? Die VMC wird dabei Neugestartet')) {
        $.ajax({
            type: "PUT",
            url: "/vmc/settings",
            contentType: "application/json",
            data: JSON.stringify({
                "automatennummer": document.getElementById("automatennummer").value,
                "transaktionsnummer": document.getElementById("transaktionsnummer").value,
                "vmccom": document.getElementById("vmccom").value,
                "crcom": document.getElementById("crcom").value,
                "dispcom": document.getElementById("dispcom").value,
                "cctalkcom": document.getElementById("cctalkcom").value,
                "scalingfactor": document.getElementById("scalingfactor").value,
                "vmcprice": ConvertCheckboxState(document.getElementById("vmcprice").checked),
                "pidmove": ConvertCheckboxState(document.getElementById("pidmove").checked),
                "usekctxt": ConvertCheckboxState(document.getElementById("usekctxt").checked),
                "abbott": ConvertCheckboxState(document.getElementById("abbott").checked),
                "mdbladung": ConvertCheckboxState(document.getElementById("mdbladung").checked),
                "vktimeout": document.getElementById("vktimeout").value,
                "sc": document.getElementById("sc").value,
                "startdelay": document.getElementById("startdelay").value,
                "p1": document.getElementById("P1").value,
                "p2": document.getElementById("P2").value,
                "p3": document.getElementById("P3").value,
                "p4": document.getElementById("P4").value,
                "server": document.getElementById("Server").value,
                "database": document.getElementById("DataBase").value,
                "timesync": ConvertCheckboxState(document.getElementById("TimeSync").checked),
                "monip": document.getElementById("MonIP").value,
                "timeip": document.getElementById("TimeIP").value,
                "typ": $('input[name="abrechnung"]:checked').val(),
                "lesertyp": document.getElementById("LeserTyp").value,
                "vmctype": document.getElementById("VMCType").value,
                "groups": jsonArr
            }),
            success: function(data, textStatus, xhr) {
                location.reload();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.warn(xhr.responseText);
                console.log('Error in Operation');
            }
        });
    } else {
        return;
    }
}

function getLog() {
    var area = document.getElementById("LogfileTextArea");
    // read text from URL location
    $.ajax({
        type: "GET",
        url: "/vmc/updateLog",
        contentType: "application/json",
        success: function(data, textStatus, xhr) {
            area.value = data;
            if ($('#AutoScroll').is(':checked')) {
                return
            } else {
                $('#LogfileTextArea').scrollTop($('#LogfileTextArea')[0].scrollHeight);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.warn(xhr.responseText);
            console.log('Error in Operation');
        }
    });
}

function InitializeComponents() {
    var table = $('#GroupTable').DataTable({
        ajax: {
            url: "../vmc/groups",
            type: "GET",
            dataSrc: "Data",
        },
        language: {
            url: "/languages/de-DE.json"
        },
        responsive: true,
        columns: [
            { data: "Benutzergruppe" },
            { data: "Untergruppe" },
            { data: "Preisliste" },
            { data: "Zahlungsart" },
            { data: "Zuschuss" },
            { data: "Zähler" },
            { data: "Typ" },
            { data: "Zuschusswahlen" },
            { data: "Wert" },
            { data: "GültigVon" },
            { data: "GültigBis" },
            { data: "KeyCard" }
        ],
        select: {
            style: 'single',
            selector: 'tr'
        },
        language: {
            url: "/languages/de-DE.json"
        },
        order: [
            [1, 'asc']
        ]
    }).on('select', function(e, dt, type, indexes) {
        var rowData = table.rows(indexes).data().toArray();
        selectedRowIndex = indexes;
    });

    $('#DeleteGroupBtn').click(function() {
        console.log(selectedRowIndex.length)
        for (var i = 0; i < selectedRowIndex.length; i++) {
            console.log(selectedRowIndex[i])
            table
                .row(selectedRowIndex[i])
                .remove()
        }
        table.draw();
    })
    $('#InsertGroupBtn').click(function() {
        var zuschuss = 0;
        var keycard = 0;
        if ($('#Zuschuss').is(":checked")) {
            zuschuss = 1
        }
        if ($('#Keycard').is(":checked")) {
            keycard = 1
        }
        table.row.add({
            "Benutzergruppe": $('#Benutzergruppe').val(),
            "Untergruppe": $('#Benutzeruntergruppe').val(),
            "Preisliste": $('#Preisliste').val(),
            "Zahlungsart": $('#Zahlungsart').val(),
            "Zuschuss": zuschuss,
            "Zähler": $('#Zaehler').val(),
            "Typ": $('#Zuschusstyp').val(),
            "Wert": $('#Wert').val(),
            "Zuschusswahlen": $('#Zuschusswahlen').val(),
            "GültigVon": $('#Von').val(),
            "GültigBis": $('#Bis').val(),
            "KeyCard": keycard
        })
        table.draw();
    })
    $('#SaveINI').click(function() {
        SaveINI();
    })
}