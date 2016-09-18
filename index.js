var request = require('request');
var credentials = require('./helpers/keys.js');
  
request({
  url: [
  	'https://www.googleapis.com/youtube/v3/search',
  	'?',
  	'&part=id',
  	'&q=dogs',
  	'&key=AIzaSyAjj_mH2B04zVPvHa54hEfTs9gwFw-0F6g'
  ].join(''),
  method: 'GET',
}, function (error, response, body) {
  console.log(body);
});




























