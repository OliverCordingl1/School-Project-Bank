// Flash the title with the current date
// function to write a nice date string from a Date object
function getDateString(date) {
	return date.getHours() + ':' + date.getMinutes() + ' ~ '+ date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear()
}

var timeToggle = false;
// Repeat every 2.5 seconds (2500ms = 2.5s x 1000) to switch the page title
// from the date, to the webpage name.
setInterval(function () {
	var date = new Date();
	if (timeToggle) {
		document.getElementsByTagName('title')[0].innerText = 'The Bank | ' + getDateString(date);
	} else {
		document.getElementsByTagName('title')[0].innerText = getDateString(date);
	}

	// invert the toggle
	timeToggle = !timeToggle;
}, 2.5 * 1000);

// predefine our forms
var createUser = document.getElementById('create-user');
var createTransaction = document.getElementById('create-transaction');

// make a small function to make it easy to send off our data without changing the page.
function sendData(form, slug) {
	// nest a function, as the 'event' parameter is needed by onsubmit.
	return function (event) { 
		// prevent the form from doing its own request so we get full control
		event.preventDefault();

		// Create an instance of XHR so we can send data over HTTP
		var xhr = new XMLHttpRequest();
		// Prepare our form data
		var data = new FormData(form);
		
		// Serialise form data so it can be processed by the webserver
		data = new URLSearchParams(Array.from(data))
			.toString();

		// Send a POST request to the /users endpoint
		xhr.open('POST', slug);
		// Tell the webserver the encoding of the data that we are sending over
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			// Process the response data when we receive it.
			console.log(xhr.responseText);
		};

		// Finally send the data.
		xhr.send(data);
	};
};

// Change the action of what happens when a form submits.
createUser.onsubmit = sendData(createUser, '/users');
createTransaction.onsubmit = sendData(createTransaction, '/transactions');