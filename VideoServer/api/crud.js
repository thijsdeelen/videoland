var express = require('express');
var routes = express.Router();



routes.get('/create', function(request, response){
	res.contentType('application/json');
	res.status(200);
	res.json(mijnObject);
});

routes.get('/update', function(request, response){
	res.contentType('application/json');
	res.status(200);
	res.json(mijnObject);
});

routes.get('/delete', function(request, response){
	res.contentType('application/json');
	res.status(200);
	res.json(mijnObject);
});

module.exports = routes;