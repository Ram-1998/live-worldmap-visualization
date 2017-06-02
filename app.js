var Twitter = require('twitter');
var dotenv = require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;

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

io.on('connection', function(socket){
  console.log('a user connected ' + count);
  count++;
  client.stream('statuses/filter', {locations: '-180,-90,180,90'}, function(stream) {
  	stream.on('data', function(data) {
      if (data.coordinates) {
  			console.log(data.coordinates.coordinates);
        var r = Math.sqrt(data.user.followers_count);
  			console.log(r);
  					io.emit('twitter', {
  						coordinates: data.coordinates,
  						radius: r
  					});
  				}
  			});
    stream.on('error', function(error) {
      throw error;
    });
    socket.on('disconnect', function(){
      console.log('user disconnected ' + count);
      count--;

      if(count == 0){
        stream.destroy();
      }
    });
  });
});
