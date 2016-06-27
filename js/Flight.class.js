'use strict';

const KEY_FLIGHTS = 'flight';

$(document).ready(()=>{

	Flight.render();

});// This is a constructor function
function Flight(id, src, dest, departure, arrival, plane) {
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
	if (!flights) flights = [];
	return flights;
}


//get all flights
Flight.query = function(){
	if (Flight.flights) return Flight.flights;
	let jsonFlights = Flight.loadJSONFromStorage();
	Flight.flights = jsonFlights.map(jsonFlight => {
		return new Flight(jsonFlight.id, jsonFlight.src, jsonFlight.dest,
							 jsonFlight.departure, jsonFlight.arrival,
							 jsonFlight.plane);
	});

	return Flight.flights;
}

Flight.save = function (formObj) {
	let flights = Flight.query();
	let flight;
	if (formObj.fId) {
		flight = Flight.findById(+formObj.fId);
		flight.src = formObj.fSrc;
		flight.dest = formObj.fDest;
		flight.departure = formObj.fDeparture;
		flight.arrival = formObj.fArrival;
		flight.plane = formObj.fPlane;
	} else {
		flight = new Flight(formObj.fId, formObj.fSrc, formObj.fDest, formObj.fDeparture, formObj.fArrival, formObj.fPlane);
		flights.push(flight);
	}
	Flight.flights = flights;
	saveToStorage(KEY_FLIGHTS, flights);
}

Flight.remove = function (fId, event) {
	event.stopPropagation();
	let flights = Flight.query();
	flights = Flights.filter(f => f.id !== fId)
	saveToStorage(KEY_FLIGHTS, flights);
	Flight.flights = flights;
	Flight.render();
}

Flight.render = function(){

	let flights = Flight.query();
	let strHtml = Flight.printFlights(flights, true);
	$('.tblFlights').html(strHtml);
}

Flight.printFlights = function(flights, canEdit){
	let strHtml = flights.map(f => {

		let html = `<tr onclick="Flight.select(${f.id}, this)">
			<td>${f.id}</td>
			<td>${f.src}</td>
			<td>${f.dest}</td>
			<td>${f.departure}</td>
			<td>${f.arrival}</td>
			<td>${f.plane}</td>
			<td>
				<button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
					<i class="glyphicon glyphicon-trash"></i>
				</button>` 
			if(canEdit){
				html +=      
				`<button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
					<i class="glyphicon glyphicon-edit"></i>
				</button>`
			}
			html +=`	
			</td>
		</tr>`
		return html;
	}).join(' ');
	return strHtml;
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
	Flight.save(formObj);
	Flight.render();
	$('#modalFlight').modal('hide');
}

Flight.editFlight = function (fId, event) {
	if (event) event.stopPropagation();
	if (fId) {
		let flight = Flight.findById(fId);
		$('#fId').val(flight.id);
		$('#fSrc').val(flight.src);
		$('#fDest').val(flight.dest);
		$('#fDeparture').val(flight.departure);
		$('#fArrival').val(flight.arrival);
		$('#fPlane').val(flight.plane);
	} else {
		$('#fId').val();
		$('#fSrc').val();
		$('#fDest').val();
		$('#fDeparture').val();
		$('#fArrival').val();
		$('#fPlane').val();
	}
	let planesId = Plane.query()
			.map(plane => '<option value="'+plane.id+'"">'+plane.id+'-'+plane.model+'</option>').join('');
	console.log('planesId:',planesId);
	$('#fPlane').append(planesId);
	$('#modalFlight').modal('show');

}