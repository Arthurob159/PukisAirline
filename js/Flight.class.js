'use strict';

const KEY_FLIGHTS = 'flight';

$(document).ready(()=>{

    Flight.render();

});// This is a constructor function
function Flight(id, src, dest, departure, arrival, plane) {
    console.log('constructor');
    this.id = (id) ? id : Flight.nextId();
    this.src = src;
    this.dest = dest;
    this.departure = departure;
    this.arrival = arrival;
    this.plane = plane;
}

// static methods:

Flight.nextId = function () {
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    console.log('result:',result);
    return result;
}

Flight.findById = function (fId) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.id === fId);
    if (flights.length) result = flights[0];
    return result;
}

Flight.loadJSONFromStorage = function () {
    let flights = getFromStorage(KEY_FLIGHTS);
    console.log('flights:',flights);
    if (!flights) flights = [];
    return flights;
}



Flight.query = function () {
    console.log('query()');
    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();
    console.log('jsonFlights:',jsonFlights);
    // Flight.flights = jsonFlights.map(jsonFlight => {
    //     return new Flight(jsonFlight.id, jsonFlight.src, jsonFlight.dest, jsonFlight.departure, jsonFlight.arrival, jsonFlight.plane);
    // });
    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.id, jsonFlight.src, jsonFlight.dest,
                             jsonFlight.departure, jsonFlight.arrival,
                             jsonFlight.plane);
    });

    return Flight.flights;
}

Flight.save = function (formObj) {
    console.log('save', formObj);
    let flights = Flight.query();
    let flight;
    console.log('save flights query',flights);
    if (formObj.fId) {
        flight = Flight.findById(+formObj.fId);
        flight.src = formObj.fSrc;
        flight.dest = formObj.fDest;
        flight.departue = formObj.fDeparture;
        flight.arrival = formObj.fArrival;
        flight.plane = formObj.fPlane;
    } else {
        console.log('save- else');
        flight = new Flight(formObj.fId, formObj.fSrc, formObj.fDest, formObj.fDeparture, formObj.fArrival, formObj.fPlane);
        flights.push(flight);
        console.log('new flights:',flights);
    }
    console.log('flights save:',flights);
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}

Flight.remove = function (fId, event) {
    console.log('remove');
    event.stopPropagation();
    let flights = Flight.query();
    flights = Flights.filter(f => f.id !== fId)
    saveToStorage(KEY_FLIGHTS, flights);
    Flight.flights = flights;
    Flight.render();
}

Flight.render = function () {

    let flights = Flight.query();
	console.log('render', flights);
    var strHtml = flights.map(f => {
			console.log('render map',f);

        return `<tr onclick="Flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>${f.dest}</td>
            <td>${f.departure}</td>
            <td>${f.arrival}</td>
            <td>${f.plane}</td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.select = function (fId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let f = Flight.findById(fId);
    let strHtml = '<h2>Flight <span class="pDetailsName"></span> Details</h2>';
    $('.details').html(strHtml);
    $('.pDetailsName').html(f.name);

}


Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj saveFlight', formObj);


    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}

Flight.editFlight = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        let Flight = Flight.findById(pId);
        $('#fId').val(Flight.id);
        $('#fSrc').val(Flight.src);
        $('#fDest').val(Flight.dest);
        $('#fDeparture').val(Flight.departure);
        $('#fArrival').val(Flight.arrival);
        $('#fPlane').val(Flight.plane);
    } else {
        $('#fId').val();
        $('#fSrc').val();
        $('#fDest').val();
        $('#fDeparture').val();
        $('#fArrival').val();
        $('#fPlane').val();
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


