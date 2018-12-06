// npm install: dotenv, axios, --save node-spotify-api, moment //
require('dotenv').config();
var axios = require('axios');
var spotify = require('node-spotify-api');
var moment = require('moment');

// load the keys file //
var keys = require('./keys.js');

// command-line arguments stored into a variable //
var cmdArgs = process.argv;

// liri command will always be the second command-line argument //
var liriCmd = cmdArgs[2];

// empty variable for holding the name of a song, movie, or artist //
var liriArg = "";

// The parameter to the LIRI command may contain spaces //
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// OMDB retrievel //
// request with axios to the OMDB API with the movie specified //
var queryUrl = "http://www.omdbapi.com/?t=" + liriArg + "&y=&plot=short&apikey=trilogy";
// prints the movie information //
axios.get(queryUrl).then(
  function(response) {
    console.log('\x1b[36m%s\x1b[0m',`Title: ${response.data.Title}
Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1]}
Produced in: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}`);
  }
);
