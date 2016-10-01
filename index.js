var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){

    const json = { championnat: "", date : "", team1 : "", team2 : "", score: ""}
    
    url = 'https://www.fff.fr/la-vie-des-clubs/13313/agenda';

    request(url, function(error, response, html){
        if(!error){
            const $ = cheerio.load(html)

            let championnat, date, team1, team2
            

            // We'll use the unique header class as a starting point.

            $('.list_links > .item > .list_calendar h3').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

                const data = $(this);

                championnat = data.text();
                if (championnat == 'EXCELLENCE SENIORS - POULE A') {
                    json.championnat = championnat
                    json.date = data.next().find('h4').text()
                    json.team1 = data.next().find('.eqleft > a').text()
                    json.team2 = data.next().find('.eqright > a').text()
                    json.score = data.next().find('.score > .message').text()
                    console.log(json)
                }
            })
        }
    })


    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
        console.log('File successfully written! - Check your project directory for the output.json file');
    })
})

app.listen('8087')
console.log('Magic happens on port 8087');
exports = module.exports = app;