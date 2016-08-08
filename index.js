//Created by Kevin Dupuy - August 8, 2016
// "Go Autobots" - Wilborn Nobles III

var request = require('request');
var cheerio = require('cheerio');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var tweettext;
var url = "http://www.espn.com/olympics/summer/2016/medals/_/view/overview/sort/gold?";


function gather() {
    'use strict';
    request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);

            var first = new Object();
            var second = new Object();
            var third = new Object();
            var winners = [first, second, third];

            var medals = $('.medals').text().replace("Total Medals By CountryGroupGSBTotal", "").split(" ").splice(1, 3);
            for (var i = 0; i < medals.length; i++) {
                winners[i].country = medals[i].substr(0, 3);
                winners[i].gold = medals[i].charAt(3);
                winners[i].silver = medals[i].charAt(4);
                winners[i].bronze = medals[i].charAt(5);
                winners[i].total = medals[i].charAt(6);
            }
            tweettext = "#Rio2016 Olympic Medals: \n";
            for (var i = 0; i < winners.length; i++) {
                tweettext = tweettext + (i + 1) + ". #" + winners[i].country + " " + winners[i].gold + "G " + winners[i].silver + "S " + winners[i].bronze + "B " + winners[i].total + " Total \n"
            }
            console.log(tweettext);

        } else {
            console.log("We’ve encountered an error: " + error);
        }

    });
}

function tweet() {
    client.post('statuses/update', {
        status: tweettext
    }, function (error, tweet, response) {
        if (!error) {
            console.log(tweet);
        }
        if (error) {
            console.log(error);
        }
    });
}

gather();
setTimeout(tweet, 5000);
