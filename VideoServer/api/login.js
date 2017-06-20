// Hier worden account functies uitgeoefend. LET OP: [GEEN HASHING].
var express         = require('express');
var router          = express.Router();
var connection      = require('../config/connector.js');
var auth            = require('../config/authenticator.js');

// Login met username en password.
router.post('/login', function(request, response) {

    // Username en password moeten uit de body worden gehaald.
    var username = request.body.username;
    var password = request.body.password;

    // In de database wordt gecontrolleerd of de username bestaat, en deze returned in 'results' object.
    var query = "SELECT * FROM customer WHERE first_name = '" + username + "'";
    connection.query(query, function (err, results, fields)
    {
        if (err) throw err;


        // Kijk of de gegevens matchen. Zo ja, dan token genereren en terugsturen.
        if (password == results[0].password)
        {
            console.log("[SUCCESFUL LOGIN]")

            // Hier krijg je een gegenereerde token op basis van je username en password.
            var token = auth.encodeToken(username, password);
            response.status(200).json({
                "token": token,
            });

            console.log("[TOKEN RECEIVED]")
        }

        else
        {
            console.log("[FOUTE LOGIN, GEEN TOKEN]")
            response.status(401).json({ "error": "Inlog gegevens kloppen niet." })
        }
    });

});

// Registreren met username en password.
router.post('/register', function(request, response) {

    // Username en password moeten uit de body worden gehaald.
    var username = request.body.username;
    var password = request.body.password;

    // Nieuwe user toevoegen.
    var query = "INSERT INTO customer VALUES (NULL, '1', '" + username + "', 'Automatische Achternaam', 'auto-email@test.com', '1', '1', '', NOW(), '" + password + "')";
    connection.query(query, function (err, results, fields)
    {
        if (err)
        {
            response.send(err);
        }

        else
        {
            response.send("[SUCCESS] - Gebruiker aangemaakt!");
        }
    });

});

// Exporteren naar andere bestanden.
module.exports = router;
