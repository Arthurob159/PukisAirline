'use strict';

const KEY_PASSENGERS = 'passengers';

// This is a constructor function
function Passenger(name, birthdate, id, gender, phone, email, country, img) {
	this.name      = name;
	this.birthdate = new Date(birthdate);
	this.pin       = randomPin();
	this.id        = (id) ? id : Passenger.nextId();
	this.gender    = gender;
	this.phone     = phone;
	this.email     = email;
	this.country   = country;
	this.img       = img;
}

// static methods:
Passenger.nextId = function () {
	let result = 1;
	let jsonPassengers = Passenger.loadJSONFromStorage();
	if (jsonPassengers.length) result = jsonPassengers[jsonPassengers.length - 1].id + 1;
	return result;
}

Passenger.findById = function (pId) {
	let result = null;
	let passengers = Passenger.query()
		.filter(p => p.id === pId);
	if (passengers.length) result = passengers[0];
	return result;
}

Passenger.loadJSONFromStorage = function () {
	let passengers = getFromStorage(KEY_PASSENGERS);
	if (!passengers) passengers = [];
	return passengers;
}

Passenger.query = function () {
	if (Passenger.passengers) return Passenger.passengers;
	let jsonPassengers = Passenger.loadJSONFromStorage();

	Passenger.passengers = jsonPassengers.map(jsonPassenger => {
		return new Passenger(jsonPassenger.name, jsonPassenger.birthdate, jsonPassenger.id,
							 jsonPassenger.gender, jsonPassenger.phone,
							 jsonPassenger.email, jsonPassenger.country, jsonPassenger.img);
	});
	return Passenger.passengers;
}

Passenger.save = function (formObj) {
	console.log('passenger.save()');
	let passengers = Passenger.query();
	let passenger;
	if (formObj.pId) {
		passenger = Passenger.findById(+formObj.pId);
		passenger.name = formObj.pName;
		passenger.birthdate = new Date(formObj.pDate);
		passenger.gender = formObj.pGender;
		passenger.phone = formObj.pPhone;
		passenger.country = formObj.pCountry;
		passenger.email = formObj.pEmail;
		passenger.img = formObj.pImg;
	} else {
		passenger = new Passenger(formObj.pName, formObj.pDate, formObj.pId,formObj.pGender, formObj.pPhone, formObj.pEmail, formObj.pCountry, formObj.pImg);
		// console.log(passenger);
		
		passengers.push(passenger);
	}
	Passenger.passengers = passengers;
	saveToStorage(KEY_PASSENGERS, passengers);
}

Passenger.remove = function (pId, event) {
	event.stopPropagation();
	let passengers = Passenger.query();
	passengers = passengers.filter(p => p.id !== pId)
	saveToStorage(KEY_PASSENGERS, passengers);
	Passenger.passengers = passengers;
	Passenger.render();
}

Passenger.render = function () {

	let passengers = Passenger.query();
	console.log('passengers:',passengers);
	var strHtml = passengers.map(p => {
		return `<tr onclick="Passenger.select(${p.id}, this)">
			<td>${p.id}</td>
			<td>${p.name}</td>
			<td>
				${moment(p.birthdate).format('DD-MM-YYYY')}
				${(p.isBirthday()) ? '<i class="glyphicon glyphicon-gift"></i>' : ''}
			</td>
			<td>${p.gender}</td>
			<td>${p.country}</td>
			<td>
				<button class="btn btn-danger" onclick="Passenger.remove(${p.id}, event)">
					<i class="glyphicon glyphicon-trash"></i>
				</button>
				 <button class="btn btn-info" onclick="Passenger.editPassenger(${p.id}, event)">
					<i class="glyphicon glyphicon-edit"></i>
				</button>
			</td>
		</tr>`

	}).join(' ');
	$('.tblPassengers').html(strHtml);
}

Passenger.select = function (pId, elRow) {
	$('.active').removeClass('active success');
	$(elRow).addClass('active success');
	$('.details').show();
	let p = Passenger.findById(pId);
	let strHtml = `'<h2>Passenger <span class="pDetailsName"></span> Details</h2>
					<div class="passengerDetails">
						<table class="table">
								<th>Id</th>
								<th>Name</th>
								<th>Birthdate</th>
								<th>Gender</th>
								<th>Phone</th>
								<th>Email</th>
								<th>Country</th>
								<th>Image</th>
							<tr>
								<td><p>`+pId+`</p></td>
								<td><p>`+p.name+`</p></td>
								<td><p>`+moment(p.birthdate).format('DD-MM-YYYY')+`</p></td>
								<td><p>`+p.gender+`</p></td>
								<td><p>`+p.phone+`</p></td>
								<td><p>`+p.email+`</p></td>
								<td><p>`+p.country+`</p></td>
								<td><p>`+p.image+`</p></td>
							</tr>
						</table>
					</div>'`;
	$('.details').html(strHtml);
	$('.pDetailsName').html(p.name);
}


Passenger.savePassenger = function () {
	var formObj = $('form').serializeJSON();
	console.log('formObj', formObj);

	Passenger.save(formObj);
	Passenger.render();
	$('#modalPassenger').modal('hide');
}

Passenger.editPassenger = function (pId, event) {
	if (event) event.stopPropagation();
	if (pId) {
		$('.modal-title').text('Edit Passenger');
		let passenger = Passenger.findById(pId);
		$('#pId').val(passenger.id);
		$('#pName').val(passenger.name);
		$('#pDate').val(moment(passenger.birthdate).format('YYYY-MM-DD'));
		$('#pGender').val(passenger.gender);
		$('#pPhone').val(passenger.phone);
		$('#pEmail').val(passenger.email);
		$('#pCountry').val(passenger.country);
		$('#pImg').val(passenger.img);
		
	} else {
		$('#pId').val('');
		$('#pName').val('');
		$('#pDate').val('');
		$('#pGender').val('');
		$('#pPhone').val('');
		$('#pEmail').val('');
		$('#pCountry').val('');
		$('#pImg').val('');
	}


	$('#modalPassenger').modal('show');

}

// instance methods:
Passenger.prototype.isBirthday = function () {
	let now = new Date();
	return (this.birthdate.getMonth() === now.getMonth() &&
		this.birthdate.getDate() === now.getDate());
}

Passenger.prototype.checkPin = function (pin) {
	return pin === this.pin;
}




