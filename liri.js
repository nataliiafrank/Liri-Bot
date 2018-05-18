// Require all the packages
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var keys = require('./keys');
var fs = require('fs');

// Global variables
var input = process.argv;
var comand = input[2];
var searchName = input[3];

// Code required to import the keys.js file and store it in a variable
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// FUNCTIONS
function runTwitter() {
    // GET request
    client.get('statuses/user_timeline', {
        count: 20
    }, function (error, tweets, response) {
        if (!error) {
            // console.log(JSON.stringify(tweets, null, 2))
            console.log("YOUR LATEST TWEETS");

            // save response array in a variable
            var array = tweets;

            // loop through the tweets and print them on the screen
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

function runSpotify(songName) {
    // Default search if the song name wasn't provided. Will search for 'The Sign' track name
    if (!searchName && !songName) {
        songName = "'The Sign'";
        console.log('You did not provide a Song Name. I will search for "The Sign" by Ace of Base for ya!\n')
    }
    // reading song name from random.txt file
    else if(songName) {
        songName;
    } 
    else {
        // Create an empty variable for holding the movie name
        var songName = "";

        // Loop through all the words in the node argument
        for (var i = 3; i < input.length; i++) {

            if (i > 3 && i < input.length) {
                songName = songName + "+" + input[i];
            } else {
                songName += input[i];
            }
        }
    }

    spotify.search({
        type: 'track',
        query: songName,
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Saves an array of utems into variable
        var dataArr = data.tracks.items;

        // Loops through each search result in the array and print it on the screen
        for (var i = 0; i < 20; i++) {
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

function runOMDB(movieName) {
    // Default search if movie name wasn't provided
    if (!searchName && !movieName) {
        movieName = "Mr+Nobody";
    } 
    // reading movie name from random.txt file
    else if(movieName){
        movieName;
    }
    else {
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
    // Create a query URL
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful (if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Print movie data
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
        else {
            console.log(error);
        }
    });
}

// Running the functions
switch (comand) {
    case 'my-tweets':
        runTwitter();
        break;
    case 'spotify-this-song':
        runSpotify();
        break;
    case 'movie-search':
        runOMDB();
        break;
    case 'do-what-it-says':

        fs.readFile('random.txt', 'utf8', function (error, data) {
            // If the code experiences any errors it will log the error to the console
            if (error) {
                return console.log(error);
            }

            // Split data string by commas (to make it more readable) and write in array
            var dataArr = data.split(",");

            // Display the content as an array
            console.log(dataArr);

            var searchName = dataArr[1];
            if (dataArr[0] === 'my-tweets') {
                runTwitter();
            } else if (dataArr[0] === 'spotify-this-song') {
                var songName = dataArr[1];
                runSpotify(songName);
            } else if (dataArr[0] === 'movie-search') {
                var movieName = dataArr[1];
                runOMDB(movieName);
            }
        })
}