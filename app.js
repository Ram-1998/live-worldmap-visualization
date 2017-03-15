var Twitter = require('twitter');
var dotenv = require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/custom.geo.json');
 //res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
});

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
});
