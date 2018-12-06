// npm install: dotenv, axios, --save node-spotify-api, moment //
require('dotenv').config();
var axios = require('axios');
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');

let spotify = new Spotify({
  id: "cd8edd03a0434fdd93e546e65e7ee52a",
  secret: "aefe8d314d0e461f806178e8a862c408"
});

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

// OMDB retrieval //
var getMovieInfo = function(liriArg) {
// request with axios to the OMDB API with the movie specified //
var movieUrl = "http://www.omdbapi.com/?t=" + liriArg + "&y=&plot=short&apikey=trilogy";
// prints the movie information //
axios.get(movieUrl).then(
  function(response) {
    console.log('\x1b[36m%s\x1b[0m',
    '------------------------\n' + 
    'Movie Information:\n' + 
    '------------------------\n' +
`Title: ${response.data.Title}
Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}
Rotten Tomatoes Rating: ${response.data.Ratings[1]}
Produced in: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}`);
  }
)};

// BandsInTown retrieval //
var getConcertInfo = function(liriArg) {
// request with axios to the BandsInTown API with the artist/band name specified //
var bandsUrl = "https://rest.bandsintown.com/artists/" + liriArg + "/events?app_id=BIT_ID";
// prints the event information //
axios.get(bandsUrl).then(
  function(response) {
    console.log('\x1b[33m%s\x1b[0m',`Name: ${data.Name}`);
  }
)};

// Spotify retrieval //
function getSongInfo(liriArg) {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + liriArg + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no song is provided, LIRI defaults to 'The Sign' by Ace Of Base
	var search;
	if (liriArg === '') {
		search = 'The Sign Ace Of Base';
	} else {
		search = liriArg;
	}

	spotify.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;

			// Append the error string to the log file //
			fs.appendFile('./log.txt', errorStr1, (err) => {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

				// Append the error string to the log file //
				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
				// Pretty print the song information //
				var outputStr = '------------------------\n' + 
								'Song Information:\n' + 
								'------------------------\n\n' + 
								'Song Name: ' + songInfo.name + '\n'+ 
								'Artist: ' + songInfo.artists[0].name + '\n';

				// Append the output to the log file //
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log('\x1b[33m%s\x1b[0m',outputStr);
				});
			}
	    }
	});
}


// Determine which LIRI command is being requested by the user //
if (liriCmd === 'movie-this') {
	getMovieInfo(liriArg); 

} else if (liriCmd === 'spotify-this-song') {
	getSongInfo(liriArg);

} else if (liriCmd === 'concert-this') {
	getConcertInfo(liriArg);

} else if (liriCmd ===  'do-what-it-says') {
	doWhatItSays();

};
