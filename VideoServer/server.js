// Initializeren.
var http = require('http');
var express = require('express');
var app = express();

// Objecten.
var exampleObject = {
	greeting: "Hello world!",
	farewell: "Goodbye world..."
}

// Gets.
app.get('/', function(request, response) {
	response.send("[Success] - Hello Avans!")
})

app.get('/about', function(request, response) {
	response.send("[Success] - Dit is een webserver voor de toets van Programmeren 4. Gemaakt door Bram van de Griend en Thijs Deelen.")
})

app.all('*', function(request, response) {
	response.status(404);
	response.send("[Failed] - Item niet gevonden.");
})

// Launch bericht.
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("[Success] - Server app is listening on port " + port + ".");
})