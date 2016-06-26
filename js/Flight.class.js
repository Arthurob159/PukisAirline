'use strict';

const KEY_FLIGHTS = 'flight';

$(document).ready(()=>{

    Flight.render();

});// This is a constructor function
function Flight(id, src, dest, date, Flight) {
    this.id = (id) ? id : Flight.nextId();
    this.src = src;
    this.dest = dest;
    this.date = date;
    this.Flight = Flight;
}

// static methods:

Flight.nextId = function () {
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    return result;
}

Flight.findById = function (pId) {
    let result = null;
    let Flights = Flight.query()
        .filter(p => p.id === pId);
    if (Flights.length) result = Flights[0];
    return result;
}

Flight.loadJSONFromStorage = function () {
    let Flights = getFromStorage(KEY_FLIGHTS);
    if (!Flights) Flights = [];
    return Flights;
}



Flight.query = function () {

    if (Flight.Flights) return Flight.Flights;
    let jsonFlights = Flight.loadJSONFromStorage();

    Flight.Flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.id, jsonFlight.src, jsonFlight.dest);
    })

    return Flight.Flights;
}

Flight.save = function (formObj) {
    let Flights = Flight.query();
    let Flight;
	console.log('formObj',formObj)
    if (formObj.pid) {
        Flight = Flight.findById(+formObj.pid);
        Flight.model = formObj.pmodel;
        Flight.sitsCount = +formObj.psits;
    } else {
        Flight = new Flight(formObj.pmodel, formObj.psits);
        Flights.push(Flight);
    }
    Flight.Flights = Flights;
    saveToStorage(KEY_FLIGHTS, Flights);
}

Flight.remove = function (pId, event) {
    event.stopPropagation();
    let Flights = Flight.query();
    Flights = Flights.filter(p => p.id !== pId)
    saveToStorage(KEY_FLIGHTS, Flights);
    Flight.Flights = Flights;
    Flight.render();
}

Flight.render = function () {

    let Flights = Flight.query();
//	console.log(p)
    var strHtml = Flights.map(p => {
			console.log(p)

        return `<tr onclick="Flight.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.src}</td>
            <td>${p.dest}</td>
            <td>${p.dest}</td>
            <td>${p.Flight}</td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Flight.findById(pId);
    let strHtml = '<h2>Flight <span class="pDetailsName"></span> Details</h2>';
    $('.details').html(strHtml);
    $('.pDetailsName').html(p.name);

}


Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);


    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}
Flight.editFlight = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        let Flight = Flight.findById(pId);
        $('#pid').val(Flight.id);
        $('#pmodel').val(Flight.model);
        $('#psits').val(Flight.sitsCount);
    } else {
        $('#pid').val('');
        $('#pmodel').val('');
        $('#psits').val('');
    }


    $('#modalFlight').modal('show');

}

// instance methods:
/*
Flight.prototype.isBirthday = function () {
    let now = new Date();
    return (this.birthdate.getMonth() === now.getMonth() &&
        this.birthdate.getDate() === now.getDate());
}


Flight.prototype.checkPin = function (pin) {
    return pin === this.pin;
}
*/



