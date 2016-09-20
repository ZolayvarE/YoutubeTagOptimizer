var settings = require('./helpers/settings.js');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var youtube = require('./helpers/youtubeHelpers.js');
var strategy = require('passport-youtube-v3').Strategy;
var request = require('request');
var n = require('nonce')();

var url = [
  'https://accounts.google.com/o/oauth2/v2/auth',
  '?',
  '&scope=https://www.googleapis.com/auth/youtube',
  '&response_type=code',
  '&client_id=' + settings.clientID,
  '&redirect_uri=http://localhost:3571/authenticated'
].join('');

var app = express();

var busy = false;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  if (busy) {
    res.send('The server is busy right now.');
  } else {
    res.redirect(url);
  }
});

app.get('/authenticated', function (req, res) {
  if (busy) {
    res.send('The server is busy right now.');
  } else {
    res.send('We\'re working on it now!');
    if (req.query.code) {
      var tokenUrl = 'https://accounts.google.com/o/oauth2/token';

      request.post(tokenUrl, { 
        form: {
          'grant_type': 'authorization_code',
          'code': req.query.code,
          'client_id': settings.clientID,
          'client_secret': settings.clientSecret,
          'redirect_uri': 'http://localhost:3571/authenticated'
        }
      }, function (error, response, body) {
        token = JSON.parse(body)['access_token'];
        busy = true;
        youtube.getOwnVideos(function (error, videoIds) {
          request({
            url: [
              'https://www.googleapis.com/youtube/v3/videos',
              '?part=snippet',
              '&key=' + settings.youtubeKey,
              '&id=' + videoIds.join(','),
            ].join(''),
            method: 'GET',
          }, function (error, response, body) {
            var videos = JSON.parse(body).items;
            var queryTarget = videos.length;
            videos.forEach(function (video) {
              if (video.snippet.tags.join(', ').length >= 450) { 
                queryTarget--;
                !queryTarget ? busy = false : null;
                return; 
              }

              console.log('check me out, bruh', video.snippet.tags.join(', ').length);

              var title = video.snippet.title;
              console.log(title);
              var firstHyphen = title.indexOf('- ');
              if (firstHyphen) {
                var searchTerm = title.slice(0, firstHyphen);
                youtube.getIdealTagsFor(searchTerm, function (error, tags) {
                  if (error) { console.log(error); }
                  console.log(tags.join(', '));
                  youtube.updateTagsFor(video, tags, token, function (err, resp) {
                    if (err) { 
                      console.log(err);
                    } else {
                      console.log(resp);
                    }

                    queryTarget--;
                    if (!queryTarget) {
                      busy = false;
                    }
                  });
                });
              }
            });
          });
        }, 100);
      });
    }
  }
});


var port = process.env.PORT || 3571;
app.listen(port);
console.log('Listening on port: ' + port);

























