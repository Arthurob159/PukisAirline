'use strict';

function getAvailableFlights(){
	let src = $('#searchFrom').val();
	// console.log('src:',src);
	if (!src){
		alert('no source');
		return;
	}
	let relaventFlights = Flight.query()
								.filter(flight=>
									flight.src === src);
	let dest = $('#searchTo').val();
	// console.log('dest:',dest);

	if(dest){
		relaventFlights = relaventFlights
							.filter(flight =>
								flight.dest === dest);
	}
	// console.log('relFlights', relaventFlights);
	renderAvailableFlights(relaventFlights);
}

function renderAvailableFlights(relFlights) {
	// console.log('relFlights:',relFlights);
	$('#modalTicket').modal('show');

	//clean the body from previous results
	$('.modal-body').html('');
	relFlights.forEach(flight=>{
		$('.modal-body').append($('template').html()
							.replace('%id%', flight.id)
							.replace('%src%', flight.src)
							.replace('%dest%', flight.dest)
							.replace('%dep%', flight.departure)
							.replace('%arr%', flight.arrival)
							// .replace('%seats%',flight.src)
							);
	});
	// console.log('renderAvailableFlights');
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
	getCountriesFromStorage();
    Passenger.render();

});
function bookFlight(el){
	// console.log('el:',$(el).children()[0].value);
	bookFlightByPId();
}
function bookFlightByPId() {
  $('#modalTicket').modal('show');
  // $('.modal-body').html('');
  let passengers = Passenger.query().map(p => '<option value="'+p.name+'">'+p.name+'</option>').join(' ');
  // console.log('passengers:' ,passengers);
  let strHtml    = `<label for="passengers">Choose Passenger</label>
				    <select name="passengers" id="passengers" class="form-control">`+passengers+`</select>
				    <div class="passImg"><img src="" alt="Passenger image"></div>`;
  let strHtmlBtn = `<input type="button" class="btn btn-default" value="book a seat" onclick="bookSeatToPassenger($('select').val())">
  				    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>`;
  $('.modal-body') .html(strHtml);
  $('.modal-footer').html(strHtmlBtn);
// <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
  //<label for="pGender">Gender</label>
                            //<select name="pGender" id="pGender" class="form-control">
}
function bookSeatToPassenger(el) {
	console.log('el: ',el);
	//TODO - 1.insert to curr passenger this flight
	//		 2.seatLeft/seatAvailable -1
	//		 3.need to reference between passenger and
	//		   flights-->Passenger.flights--> Exist!

	//THIS.Passenger.flights.push(this.flight);
	
}