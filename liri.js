require("dotenv").config();

//Add the code required to import the keys.js file and store it in a variable.

var keys = require("./keys");

var spotify = new Spotify(keys.spotify);

