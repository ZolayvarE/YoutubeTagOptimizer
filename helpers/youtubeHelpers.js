var request = require('request');
var credentials = require('./keys.js');

var getTopVideoIds = function (number, term, callback) {
  if (number === undefined) {
    number = 25;
  }

  request({
    url: [
      'https://www.googleapis.com/youtube/v3/search',
      '?part=id',
      '&maxResults=' + Math.min(number, 50),
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

var getVideoDetailsById = function (videoIds, callback) {
  if (!Array.isArray(videoIds)) {
    videoIds = [videoIds];
  }

  if (typeof videoIds[0] !== 'string') {
    callback('Did not get an array of video id strings', null);
  }

  request({
    url: [
      'https://www.googleapis.com/youtube/v3/videos',
      '?part=snippet',
      '&key=' + credentials.youtubeKey,
      '&id=' + videoIds.join(','),
    ].join(''),
    method: 'GET',
  }, function (error, response, body) {
    callback(error, body);
  })
}

var getTagsForTopic = function (topic, callback, number) {
  getTopVideoIds(number, topic, function (error, ids) {
    if (error) {
      callback(error, null);
    } else {
      getVideoDetailsById(ids, function (error, videos) {
        if (error) {
          callback(error, null);
        } else { 
          videos = JSON.parse(videos);
          var results = [];
          videos['items'].forEach(function (item) {
            results = results.concat(item.snippet.tags);
          })
          
          callback(null, results);
        }
      })
    }
  })
}

var sortTagsByPopularity = function (tags, callback) {
  var countObject = {};
  tags.forEach(function (tag) {
    if (tag) {
      tag = tag.toLowerCase();
      countObject['' + tag] = countObject['' + tag] + 1 || 1;
    }
  });

  var count, wordCount;
  for (var key in countObject) {
    count = countObject[key];
    wordCount = key.split(' ').length;
    countObject[key] = count + Math.min(count, wordCount) - 1;
  }
  
  
};

module.exports = {
  getIdsFor: getTopVideoIds,
  getVideoDetailsFor: getVideoDetailsById,
  getTagsFor: getTagsForTopic,
};





