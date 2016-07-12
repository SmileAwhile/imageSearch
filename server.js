var express = require('express')
var app = express();
var url = process.env.MONGOLAB_URI;
var mongo = require('mongodb').MongoClient;

app.get('/', function (req, res) {

    mongo.connect(url, function (err, db) {
    if (err) {
      res.end('Unable to connect to the mongoDB server. Error:', err);
    } else {
      res.end('Connection established to DB');

      // do some work here with the database.

      //Close connection
      db.close();
    }
  });

});

var port = process.env.PORT || 3000;
app.listen(port);
