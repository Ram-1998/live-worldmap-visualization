var Twitter = require('twitter');
var dotenv = require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

client.stream('statuses/filter', {locations: '-180,-90,180,90'}, function(stream) {
  stream.on('data', function(data) {
    if(data.coordinates){
      console.log(data.coordinates);
      console.log(data.user.followers_count);
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
});
