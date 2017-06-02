var Twitter = require('twitter');
var dotenv = require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var tweetdata = require('./tweetdata.json');
var fs = require('fs');
var json2csv = require('json2csv');
var fields = ['country', 'population'];


app.use(express.static(__dirname));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.send('<h1>Live Worldmap Visualisation</h1>');
});

http.listen( process.env.PORT || 3000, function(){
  console.log('listening on ' + process.env.PORT || 3000);
});

var client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
});

 var findIndex = function(code){
   code = code.toLowerCase();
   for (i=0;i<232;i++){
     if(tweetdata[i].country == code)
      return i;
   }
   return -1;
 }

  client.stream('statuses/filter', {locations: '-180,-90,180,90'}, function(stream) {
  	stream.on('data', function(data) {
      if (data.place){
        console.log(data.place.country_code);
        var i = findIndex(data.place.country_code);
        if(i != -1){
          tweetdata[i].population++;
        }
      }
  	});
    stream.on('error', function(error) {
      throw error;
    });
    setTimeout(function(){
      stream.destroy();
      var json = json2csv({data: tweetdata, fields: fields, quotes: ''});
      fs.writeFile('tweetdata1.csv', json , 'utf8');
    },12000);
  });
