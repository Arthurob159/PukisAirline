'use strict';

function getAvailableFlights(){
	let src = $('#searchFrom').val();
	// if (!src)
	let dest = $('#searchTo').val();
	let relaventFlights = Flight.query()
								.filter(flight=>{
									return ((flight.src === src)
										&& (flight.dest === dest)
										);
								});
	console.log('relFlights', relaventFlights);
	renderAvailableFlights(relaventFlights);

}

function renderAvailableFlights() {
  $('#modalTicket').modal('show');
  $('#modalTicketSrc').text($('#searchFrom').val());
  $('#modalTicketDest').text($('#searchTo').val());
  
  //TODO- 1.change flightDate.text to the right curr flight date--from LS
  //      2.change availableSeats.text to the right availableSeats curr flight seats--from LS 
  $('#flightDate').text('flightDate');
  $('#availableSeats').text('availableSeats');
  
}
// function init() {

//     console.log('init: About to query()');
//     query();
//     console.log('init: Done query()');
// }

// function query() {
//     console.log('query: About to find()');
//     find('Puki');
//     console.log('query: Done find()');
// }

// function find(what) {
//     let d = new Date()
//     console.log('find: Found!');
// }

// init();


$(document).ready(()=>{

    Passenger.render();

});