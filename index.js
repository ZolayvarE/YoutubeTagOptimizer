var settings = require('./helpers/settings.js');
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var youtube = require('./helpers/youtubeHelpers.js');
var strategy = require('passport-youtube-v3').Strategy;

passport.use(new strategy({
  clientID: settings.clientID,
  clientSecret: settings.clientSecret,
  callbackURL: 'http://localhost:3000/auth/youtube/callback',
  scope: ['https://www.googleapis.com/auth/youtube']
}, function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ userId: profile.id }, function (err, user) {
    return done(err, user);
  });
}));



var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/client'));

app.get('/login', passport.authenticate(), function (req, res) {
  console.log(req);
  console.log(res);
});

app.get('/authenticated', function (req, res) {
  console.log(req.body);
  res.send('You did it!');
});

var port = process.env.PORT || 3571;
app.listen(port);
console.log('Listening on port: ' + port);

























