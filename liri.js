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

// Helper function that gets the artist name
var getArtistNames = function(artist) {
  return artist.name;
};


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
var getConcertInfo = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=BIT_ID";

  axios.get(queryURL).then(
    function(response) {
      var jsonData = response.data;

      if (!jsonData.length) {
        console.log('\x1b[32m%s\x1b[0m', `No results found for ${artist}`);
        return;
      }

console.log('\x1b[32m%s\x1b[0m', `Upcoming concerts for ${artist}:
------------------------
Concert Information
------------------------`);

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

console.log('\x1b[32m%s\x1b[0m',
`${show.venue.city}, ${(show.venue.region || show.venue.country)}
`,
`at ${show.venue.name} ${moment(show.datetime).format("MM/DD/YYYY")}
`
        );
      }
    }
  );
};


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
								'------------------------\n' + 
								'Artist: ' + songInfo.artists[0].name + '\n' +
								'Song: ' + songInfo.name + '\n' + 
								'Preview: ' + songInfo.preview_url + '\n' +
								'Album: ' + songInfo.album[0];

				// Append the output to the log file //
				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log('\x1b[33m%s\x1b[0m',outputStr);
				});
			}
	    }
	});
}


// Function for running a command based on text file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);

    var dataArr = data.split(",");

    if (dataArr.length === 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      pick(dataArr[0]);
    }
  });
};

// Function for determining which command is executed
var pick = function(caseData, functionData) {
  switch (caseData) {
  case "concert-this":
    getConcertInfo(functionData);
    break;
  case "spotify-this-song":
    getSongInfo(functionData);
    break;
  case "movie-this":
    getMovieInfo(functionData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("LIRI doesn't know that");
  }
};

var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv.slice(3).join(" "));
