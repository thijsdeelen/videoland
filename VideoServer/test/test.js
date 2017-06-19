var expect  = require('chai').expect;
var request = require('request');

it('Home pagina.', function() {
    request('http://localhost:5000' , function(error, response, body) 
    {
        
    });
});

it('About pagina.', function() {
    request('http://localhost:5000/about' , function(error, response, body) 
    {

    });
});