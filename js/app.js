'use strict';

function getAvailableFlights(){
	let src = $('#searchFrom').val();
	console.log('src:',src);
	if (!src){
		alert('no source');
		return;
	}
	let relaventFlights = Flight.query()
								.filter(flight=>
									flight.src === src);
	let dest = $('#searchTo').val();
	console.log('dest:',dest);

	if(dest){
		relaventFlights = relaventFlights
							.filter(flight =>
								flight.dest === dest);
	}
	console.log('relFlights', relaventFlights);
	renderAvailableFlights(relaventFlights);
}

function renderAvailableFlights(relFlights) {
	console.log('relFlights:',relFlights);
	$('#modalTicket').modal('show');

	//clean the body from previous results
	$('.modal-body').html('');
	relFlights.forEach(flight=>{
		$('.modal-body').append($('template').html()
							.replace('%src%', flight.src)
							.replace('%dest%', flight.dest)
							.replace('%dep%', flight.departure)
							.replace('%arr%', flight.arrival)
							// .replace('%seats%',flight.src)
							);
	});
	console.log('renderAvailableFlights');
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
bookFlight(){
	
}