var express = require('express')
var app = express();

app.get('/', function (req, res) {

    res.end("HELLO");

});

var port = process.env.PORT || 3000;
app.listen(port);
