// npm install: dotenv, axios, --save node-spotify-api, moment //
require('dotenv').config();
var Axios = require('axios');
var Spotify = require('node-spotify-api');
var Moment = require('moment');

// load the keys file //
var keys = require('./keys.js');

// command-line arguments stored into a variable //
var cmdArgs = process.argv;

// liri command will always be the second command-line argument //
var liriCmd = cmdArgs[2];

// The parameter to the LIRI command may contain spaces //
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

// OMDB retrievel //
var movieName = process.argv[3];
// request with axios to the OMDB API with the movie specified //
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
// console.log to help debug against the actual URL //
console.log(queryUrl);
// prints the movie information //
axios.get(queryUrl).then(
    function(response) {
      console.log("Release Year: " + response.data.Year);
    }
  );
