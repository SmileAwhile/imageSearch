var express = require('express')
var app = express();
var url = process.env.MONGOLAB_URI;
var mongo = require('mongodb').MongoClient;
var col = 'searches'


app.get('/imgsearch/:term', function (req, res) {

  // check if paginate offset is present and initialze appropriately
  if (Object.keys(req.query).length === 0) {
    var ind = 0;
  }
  else {
     var ind = req.query.offset;
  }

 var startI = 1 + ind * 10; // start index of search results for paginating
 var query = req.params.term  // search term
 // json url
 var jurl = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBHTJAao4UVbF1btqTUhmsZjia1zhMJpAU&cx=004585480663318558198:mhuuozy0zba&searchType=image&q=" + query + "&start=" + startI;
 var request = require("request")

  request({
      url: jurl,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
           var items = body.items;
           var rv = [];  // return object array

           // iterate through item results to store relevant values in rv
           for (i=0; i<items.length; i++) {
             rv[i] = {
               "imgurl": items[i].link,
               "snippet": items[i].snippet,
               "pageurl": items[i].image.contextLink
             }
           }  // end for
           res.end(JSON.stringify(rv));

           var now = new Date()

           var entry = {
             searchterm: query,
             date: now
           }

           mongo.connect(url, function (err, db) {
             var collection = db.collection(col);
             collection.insert(entry, function(err, data) {
               console.log(JSON.stringify(entry));
               db.close();
             });
           });

           console.log(entry);

      }  // end if !not error
      else {
        res.end(error);
      }
  });  // end json request
}); // end get(imgsearch:term)

app.get('/latest', function(req, res) {
  mongo.connect(url, function (err, db) {
    var collection = db.collection(col);
    collection.find().limit(30).sort({date: -1}).toArray(function(err, docs) {
      res.end(JSON.stringify(docs));
    });
  });
}); // end get(/latest/)

app.use(express.static('public'));

var port = process.env.PORT || 3000;
app.listen(port);
