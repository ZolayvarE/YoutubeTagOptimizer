var request = require('request');
var credentials = require('./helpers/keys.js');

var getTopVideoIds = function (term, callback) {
request({
  url: [
      'https://www.googleapis.com/youtube/v3/search',
      '?',
      '&part=id',
      '&maxResults=5',
      '&q=' + term,
      '&type=video',
      '&key=AIzaSyAjj_mH2B04zVPvHa54hEfTs9gwFw-0F6g'
    ].join(''),
    method: 'GET',
  }, function (error, response, body) {
    body = JSON.parse(body);
    var videoIds = [];
    body['items'].forEach(function (value, index) {
      videoIds.push(value['id']['videoId'])
    })

    callback(videoIds);
  });
}



























