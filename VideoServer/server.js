// Initializeren.
var http = require('http');
var express = require('express');
var mysql = require('mysql');
var dateTime = require('node-datetime');


var app = express();

var connection = mysql.createConnection({
  host: "146.185.130.82",
  user: "1013",
  password: process.env.DB_PASSWORD,
  database: "1013"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("[Success] - Connected to database.");
});



// Objecten.
var exampleObject =
{
	greeting: "Hello world!",
	farewell: "Goodbye world..."
}

// Port.
app.set("port", (process.env.PORT || 5000))






// Gets.

// Display all requests.
app.all('*', function(request, response, next) {
	var dt = dateTime.create();
	var formatted = dt.format('H:M:S');
	console.log("[" + formatted + "] " + request.method + " " + request.url);
	next();
})

app.get('/', function(request, response) {
	response.send("[Success] - Hello Avans!")
})

app.get('/about', function(request, response) {
	response.send("[Success] - Dit is een webserver voor de toets van Programmeren 4. Gemaakt door Bram van de Griend en Thijs Deelen.")
})

app.use('/api', require('./api/crud.js'));

// 404 response.
app.all('*', function(request, response) {
	response.status(404);
	response.send("[Failed] - Item niet gevonden.");
})



// Start server.
app.listen(app.get('port'), function() {
    console.log("[Success] - Running on port " + app.get('port') + ".")
})
