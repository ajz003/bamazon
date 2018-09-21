var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'playlist_db'
});
 
connection.connect(function() {
  deleteExample();
});

function deleteExample() {
  connection.query("DELETE FROM songs WHERE id = ?;", [6], function() {
    console.log("record deleted");
  });
}

function updateExample() {
  connection.query("UPDATE songs SET genre = ? WHERE ?;", [
    "old-timey",
    {
      id: 5
    }
  ], function() {
    console.log("record updated");
  });
}

function insertExample() {
  var artist = "The Beatles";
  var title = "Yellow Submarine";
  var genre = "awesome";
  
  connection.query('INSERT INTO songs SET artist = ?, title = ?, genre = ?;', [artist, title, genre], function() {
    console.log("new record inserted!");
  });
}

function selectExample() {
  var genre = "Rap";
   
  var query = connection.query('SELECT * FROM songs WHERE genre = ? OR genre = ?', [genre, "R&B"], function (error, results, fields) {
    if (error) throw error;
    
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].artist + " is a " + results[i].genre + " band");
    }
  });
  
  console.log(query.sql);
}