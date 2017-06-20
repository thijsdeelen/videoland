// Het start bestand van de webserver.
var http 		= require('http');
var express 	= require('express');
var dateTime 	= require('node-datetime');
var jwt 		= require('express-jwt');
var bodyParser 	= require('body-parser');
var app 		= express();

module.exports = {};

// Bodyparsing details.
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


// JWT nodig behalve op gespecifeerde routes.
app.use(jwt({
    secret: process.env.TOPSECRET
}).unless({
    path: 
    [
    	{ url: '/', methods: ['GET'] },
        { url: '/api/login', methods: ['POST'] },
        { url: '/api/register', methods: ['POST'] },
        { url: '/api/film', methods: ['GET'] },
        { url: '/api/films/5', methods: ['GET'] }, //Kan geen variabele instellen voor JWT.
        { url: '/about', methods: ['GET'] }
    ]
}));

// Alle requests loggen.
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

// Routes naar de verdere endpoints.
app.use('/api', require('./api/login.js'));
app.use('/api', require('./api/crud.js'));

// 404 response.
app.all('*', function(request, response) {
	response.status(404);
	response.send("[Failed] - Item niet gevonden.");
})

// Start server.
app.set("port", (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
    console.log("[LAUNCH] - Running on port " + app.get('port') + ".")
})

// Exporteren voor mogelijke testen.
module.exports = app;