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

// console.log('\n\nAuthentication Url:\n' + url + '\n\n')


var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/client'));

app.get('/', function (req, res) {
  res.redirect(url);
});

app.get('/login', passport.authenticate(), function (req, res) {
  console.log(req);
  console.log(res);
});

app.get('/authenticated', function (req, res) {
  if (req.query.code) {
    var tokenUrl = [
      'https://accounts.google.com/o/oauth2/token',
      '?',
      '&grant_type=authorization_code',
      '&code=' + req.query.code,
      '&client_id=' + settings.clientID,
      '&client_secret=' + settings.clientSecret,
      '&redirect_uri=http://localhost:3571/authenticated',
    ].join('');

    console.log('\n\nToken Url:\n' + tokenUrl);

    request.post(tokenUrl, { 
      form: {
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'client_id': settings.clientID,
        'client_secret': settings.clientSecret,
        'redirect_uri': 'http://localhost:3571/authenticated'
      }
    }, function (error, response, body) {
      console.log('\n\nError:\n' + error);
      console.log('\n\nBody:\n' + body);
    });

    res.send('You did it!');
  }
});

var port = process.env.PORT || 3571;
app.listen(port);
console.log('Listening on port: ' + port);

























