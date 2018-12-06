console.log('this is loaded');

exports.Spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.bandsintown = {
  id: process.env.BIT_ID
};

exports.omdb = {
  id: process.env.OMDB_ID
};