// Flash the title with the current date
// function to write a nice date string from a Date object
function getDateString(date) {
	return date.getHours() + ':' + date.getMinutes() + ' ~ '+ date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear()
}

var timeToggle = false;
setInterval(function () {
	var date = new Date();
	if (timeToggle) {
		document.getElementsByTagName('title')[0].innerText = 'NUAST Bank | ' + getDateString(date);
	} else {
		document.getElementsByTagName('title')[0].innerText = getDateString(date);
	}

	timeToggle = !timeToggle;
}, 2.5 * 1000);

var createUser = document.getElementById('create-user');

createUser.onsubmit = function (event) {
	// prevent the form from doing its own request so we get full control
	event.preventDefault();

	// Create an instance of XHR so we can send data over HTTP
	var xhr = new XMLHttpRequest();
	// Prepare our form data
	var data = new FormData(this);
	
	// Serialise form data so it can be processed by the webserver
	data = new URLSearchParams(Array.from(data))
		.toString();

	// Send a POST request to the /users endpoint
	xhr.open('POST', '/users');
	// Tell the webserver the encoding of the data that we are sending over
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		// Process the response data when we receive it.
		console.log(xhr.responseText);
	};

	// Finally send the data.
	xhr.send(data);
};