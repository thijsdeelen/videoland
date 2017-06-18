// Dit bestand wordt gebruikt om de database aan te spreken.
var mysql = require('mysql');

// Connectie instellingen.
var connection = mysql.createConnection({
  host: "146.185.130.82",
  user: "1013",
  password: process.env.DB_PASSWORD,
  database: "1013"
});

// Connectie.
connection.connect(function(err) {
  if (err) throw err;
  console.log("[CONNECTIE] - Verbonden met de database.");
});

// Exporteren voor gebruik in andere bestanden.
module.exports = connection;