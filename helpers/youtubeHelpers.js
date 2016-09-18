var request = require('request');
var credentials = require('./keys.js');

var getTopVideoIds = function (term, callback) {
  request({
    url: [
      'https://www.googleapis.com/youtube/v3/search',
      '?part=id',
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

    callback(error, videoIds);
  });
}

var getTagsForVideoById = function (videoIds, callback) {
  if (!Array.prototype.isArray(videoId)) {
    videoIds = [videoIds];
  }

  if (typeof videoIds[0] !== string) {
    callback('Did not get an array of video id strings', null);
  }

  request({
    url: [
      'https://www.googleapis.com/youtube/v3/videos',
      '?key=' + credentials.youtubeKey,
      '&id=' + videoIds.join(','),
      

    ].join(''),
    method: 'GET'
  }, function (error, response, body) {




    callback(error);
  })
}

module.exports = {
  getIdsFor: getTopVideoIds,
};





