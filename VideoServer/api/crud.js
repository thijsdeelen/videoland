// In dit bestand worden database acties uitgevoerd.
var express 		= require('express');
var router 			= express.Router();
var jwt 			= require('jsonwebtoken');
var connection 		= require('../config/connector.js');
var authenticator 	= require('../config/authenticator.js');

// CRUD!
router.get('/create', function(request, response){
	var query = "INSERT INTO `film` VALUES (NULL, 'Documentaire Avans Hogeschool', 'Een docu over Avans Hogeschool.', '2017', '', NULL, '3', '4.99', '56', '19.99', 'G', NULL, CURRENT_TIMESTAMP)";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[CREATE] - Film created.");
        response.send(results);
    });
});

router.get('/read', function(request, response){
	var query = "SELECT * FROM film WHERE title LIKE '%Avans%' LIMIT 10";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[READ] - Film read.");
        response.send(results);
    });
});

router.get('/films/:id', function(request, response){
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

// Films ophalen die gehuurd zijn door specifiek user ID.
router.get('/rentals/:id', function(request, response){
	var query = "SELECT film.film_id, film.title, film.description, film.release_year FROM film INNER JOIN inventory ON film.film_id = inventory.film_id INNER JOIN rental ON inventory.inventory_id = rental.inventory_id INNER JOIN customer ON rental.customer_id = customer.customer_id WHERE customer.customer_id = " + request.params.id;
	connection.query(query, function(err, results, fields)
	{
		if (err) throw err;

		if (results == "")
		{
			console.log("[READ] - The customer doesn't rent any movies at this time.")
			results = "[FAILED] - U heeft nog geen films geleend.";
		}
		else
		{
			console.log("[READ] - Rentals shown for customer with selected id.")
		}

		response.send(results);
	});
});


//Maakt een nieuwe uitlening voor de gegeven
//gebruiker van het exemplaar met
//gegeven inventoryid.
router.post('/rentals/:userid/:inventoryid', function(request, response){
	var query = "INSERT INTO rental VALUES ('', CURRENT_DATE, '" + request.params.userid + "', '" + request.params.inventoryid + "', NOW() + INTERVAL 7 DAY, '', '')";
	connection.query(query, function(err, results, fields)
	{
		if (err) throw err;

		if (results == "")
		{
			console.log("[FAILED] - Kon geen nieuwe rental aanmaken.")
			results = "[FAILED] - Kon geen nieuwe rental aanmaken.";
		}
		else
		{
			console.log("[READ] - Rental created.")
		}

		response.send(results);
	});
});

//Wijzig bestaande uitlening voor de gegeven
//gebruiker van het exemplaar met
//gegeven inventoryid.
router.put('/rentals/:userid/:inventoryid', function(request, response){
	var query = "UPDATE rental SET customer_id = " + request.params.userid + " WHERE inventory_id = " + request.params.inventoryid;
	connection.query(query, function(err, results, fields)
	{
		if (err) throw err;

		if (results == "")
		{
			console.log("[FAILED] - Couldn't edit rental.")
			results = "[FAILED] - Couldn't edit rental.";
		}
		else
		{
			console.log("[UPDATE] - Rental userid edited.")
		}

		response.send(results);
	});
});

//Verwijder bestaande uitlening voor de
//gegeven gebruiker van het exemplaar
//met gegeven inventoryid.
router.delete('/rentals/:userid/:inventoryid', function(request, response){
	var query = "DELETE FROM rental where customer_id = "+ request.params.userid + " AND inventory_id = " + request.params.inventoryid;
	connection.query(query, function(err, results, fields)
	{
		if (err) throw err;

		if (results == "")
		{
			console.log("[FAILED] - Delete failed.")
			results = "[FAILED] - Delete failed.";
		}
		else
		{
			console.log("[DELETE] - Delete successful based on customer_id and inventory_id.")
		}

		response.send(results);
	});
});


router.get('/update', function(request, response){
	var query = "UPDATE film SET title = 'Docu-Docu van de coole Avans school' WHERE title LIKE '%Avans%'";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[UPDATE] - Film updated.");
        response.send(results);
    });
});

router.get('/delete', function(request, response){
	var query = "DELETE FROM film WHERE title LIKE '%Avans%'";
	connection.query(query, function (err, results, fields) {
        if (err) throw err;
        console.log("[DELETE] - Film deleted.");
        response.send(results);
    });
});

// Export.
module.exports = router;