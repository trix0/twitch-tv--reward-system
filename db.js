var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'twitch_bot'
});

connection.connect();

connection.query('SELECT * FROasdaM useasdrs', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  console.log("error "+error)
});

connection.end();