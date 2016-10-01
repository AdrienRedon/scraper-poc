const express = require('express');
const fs = require('fs');
const request = require('request-promise');
const cheerio = require('cheerio');
const q = require('q');
const app = express();

app.get('/scrape/club/:club_id/week/:week', function(req, res){

    let result = '';
    q.fcall(function() {
        result += '[';
    }).then(function() {

        q.fcall(function() {
            const options = {
                uri: 'https://www.fff.fr/la-vie-des-clubs/' + req.params.club_id + '/agenda/semaine-' + req.params.week,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
            };

            request (options, function(error, response, html){
                let json = {championnat: "", date: "", team1: "", team2: "", score: ""}
                if(!error){
                    const $ = cheerio.load(html)

                    let championnat, date, team1, team2

                    // We'll use the unique header class as a starting point.

                    $('h3').filter(function(){

                // Let's store the data we filter into a variable so we can easily see what's going on.

                        const data = $(this)

                        championnat = data.text();

                        if (championnat == 'EXCELLENCE SENIORS - POULE A') {
                            json.championnat = championnat;
                            json.date = data.next().find('h4').text();
                            json.team1 = data.next().find('.eqleft > a').text();
                            json.team2 = data.next().find('.eqright > a').text();
                            json.score = data.next().find('.score > .message').text();

                            result += JSON.stringify(json, null, 4) + ',';
                        }
                    })
                }
            }).then(function() {
                result += ']';
                res.send(result);
            })

        })

    })

})

    
    


app.listen('8087')
console.log('Magic happens on port 8087');
exports = module.exports = app;