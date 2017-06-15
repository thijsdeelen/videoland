var express = require('express');
var path = require('path');
var routes = express.Router();

// SQL!
var mysql = require('mysql');

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

// CRUD!
routes.get('/create', function(request, response){
	var query = "INSERT INTO `film` VALUES (NULL, 'Documentaire Avans Hogeschool', 'Een docu over Avans Hogeschool.', '2017', '', NULL, '3', '4.99', '56', '19.99', 'G', NULL, CURRENT_TIMESTAMP)";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[CREATE] - Film created.");
        response.send(results);
    });
});

routes.get('/read', function(request, response){
	var query = "SELECT * FROM film WHERE title LIKE '%Avans%' LIMIT 10";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[READ] - Film read.");
        response.send(results);
    });
});

routes.get('/film/:id', function(request, response){
	var query = "SELECT film.film_id, film.title, rental.rental_id, rental.rental_date, rental.return_date, rental.inventory_id, rental.customer_id FROM film INNER JOIN inventory ON film.film_id = inventory.film_id INNER JOIN rental ON inventory.inventory_id = rental.inventory_id WHERE film.film_id = " + request.params.id;
	connection.query(query, function(err, results, fields)
	{
		if (err) throw err;
		
		if (results == "")
		{
			console.log("[READ] - The film with this ID has no rentals.");
			results = "[FAILED] - De film met id (" + request.params.id + ") heeft geen rentals.";
		} 
		else
		{
			console.log("[READ] - Film with rentals selected on id.");
		}
		response.send(results);
	});
});

routes.get('/update', function(request, response){
	var query = "UPDATE film SET title = 'Docu-Docu van de coole Avans school' WHERE title LIKE '%Avans%'";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[UPDATE] - Film updated.");
        response.send(results);
    });
});

routes.get('/delete', function(request, response){
	var query = "DELETE FROM film WHERE title LIKE '%Avans%'";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[DELETE] - Film deleted.");
        response.send(results);
    });
});

// End.
module.exports = routes;
