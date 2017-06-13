// Initializeren.
//var http = require('http')
var express = require('express')
var app = express()

// Objecten.
var exampleObject = {
	greeting: "Hello world!",
	farewell: "Goodbye world..."
}

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 5000))

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


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
