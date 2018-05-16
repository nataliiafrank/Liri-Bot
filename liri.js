// Code to read and set any environment variables with the dotenv package
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require('./keys');
var fs = require('fs');

var input = process.argv
var comand = input[2];
var searchName = input[3];

// Add the code required to import the keys.js file and store it in a variable.
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


function runTwitter() {
    // GET request
    client.get('statuses/user_timeline', {
        count: 5
    }, function (error, tweets, response) {
        if (!error) {
            // console.log(JSON.stringify(tweets, null, 2))
            console.log("YOUR LATEST TWEETS")

            var array = tweets;

            for (var i = 0; i < array.length; i++) {
                console.log('- - -')
                console.log('Posted on: ', array[i].created_at);
                console.log('Your tweet: ', '"' + array[i].text + '"');
            }
        } else {
            console.log(error)
        }
    });
}

function runSpotify(searchName) {
    if (!searchName) {
        searchName = "'The Sign'";
        console.log('You did not provide a Song Name. I will search for "The Sign" by Ace of Base for ya!\n')
    }

    spotify.search({
        type: 'track',
        query: searchName,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var dataArr = data.tracks.items;

        for (var i = 0; i < 5; i++) {
            var path = data.tracks.items[i];
            console.log('Artists: ', path.artists[0].name);
            console.log('Song Name: ', path.name);
            console.log('Preview link: ', path.preview_url);
            console.log('Album: ', path.album.name);
            console.log('Song ID: ', path.id);
            // Creares a spase between search results
            console.log('\n');
        };
    });
}

function runOMDB() {
    if (!searchName) {
        movieName = "Mr+Nobody"
    } else {
        // Create an empty variable for holding the movie name
        var movieName = "";

        // Loop through all the words in the node argument
        for (var i = 3; i < input.length; i++) {

            if (i > 3 && i < input.length) {
                movieName = movieName + "+" + input[i];
            } else {
                movieName += input[i];
            }
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


    request(queryUrl, function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("------------ MOVIE ------------")
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Released);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country Origin: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

switch (comand) {
    case 'my-tweets':
        runTwitter();
        break;
    case 'spotify-this-song':
        runSpotify(searchName);
        break;
    case 'movie-search':
        runOMDB();
        break;
    case 'do-what-it-says':

        fs.readFile('random.txt', 'utf8', function (error, data) {
            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }

            console.log(data);

            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);

            var searchName = dataArr[1];
            if (dataArr[0] === 'my-tweets') {
                runTwitter();
            } else if (dataArr[0] === 'spotify-this-song') {
                var searchName = dataArr[1];
                runSpotify(searchName);
            } else if (dataArr[0] === 'movie-search') {
                runOMDB();
            }

        })
}