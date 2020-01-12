require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// Variables for the arguments to be entered by the user 
var appCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");


//Using switch statement to execute the code appropriate to the appCommand that is inputed from the user
function liriRun(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getRandom();
            break;
            // If appCommand is left blank, return a default message to user
        default:
            console.log("Please enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says' in order to continue");
    }
};

//----------Function to search Spotify API
function getSpotify(songName) {

    var spotify = new Spotify(keys.spotify);
    if (!songName) {
        songName = "The Sign";
    };

    spotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("=============================");
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

        // Append text into log.txt file
        var logSong = "======Begin Spotify Log Entry======" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\n Preview Link: " + data.tracks.items[0].href + "\nAlbum Name: " + data.tracks.items[0].album.name + "\n======End Spotify Log Entry======" + "\n";

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });

    });
};

//---------Function to search Bands In Town API
function getBandsInTown(artist) {

    var artist = userSearch;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response) {
            console.log("=============================");
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

            // Append text into log.txt file
            var logConcert = "======Begin Concert Log Entry======" + "\nName of the musician: " + artist + "\nName of the venue: " + response.data[0].venue.name + "\nVenue location: " + response.data[0].venue.city + "\n Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n======End Concert Log Entry======" + "\n";

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            });
            //logResults(response)
        });
};

//---------Function to search OMDB API
function getOMDB(movie) {

    if (!movie) {
        movie = "Mr. Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(movieQueryUrl);

    axios.request(movieQueryUrl).then(
        function (response) {
            console.log("=============================");
            console.log("* Title: " + response.data.Title + "\r\n");
            console.log("* Year Released: " + response.data.Year + "\r\n");
            console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("* Country Where Produced: " + response.data.Country + "\r\n");
            console.log("* Language: " + response.data.Language + "\r\n");
            console.log("* Plot: " + response.data.Plot + "\r\n");
            console.log("* Actors: " + response.data.Actors + "\r\n");

            //logResults(response);
            var logMovie = "======Begin Movie Log Entry======" + "\nMovie title: " + response.data.Title + "\nYear released: " + response.data.Year + "\nIMDB rating: " + response.data.imdbRating + "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value + "\nCountry where produced: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n======End Movie Log Entry======" + "\n";

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            });
        });
};


function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }


    });
};

// log results from the other funtions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};


liriRun(appCommand, userSearch);