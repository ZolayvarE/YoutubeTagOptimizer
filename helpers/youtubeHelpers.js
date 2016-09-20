var request = require('request');
var settings = require('./settings.js');

var memCache = {};

var getTopVideoIds = function (term, callback, number) {
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
      videoIds.push(value['id']['videoId']);
    });

    callback(error, videoIds);
  });
};

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
      '&key=' + settings.youtubeKey,
      '&id=' + videoIds.join(','),
    ].join(''),
    method: 'GET',
  }, function (error, response, body) {
    callback(error, body);
  });
};

var getTagsForTopic = function (topic, callback, number) {
  getTopVideoIds(topic, function (error, ids, number) {
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
          });
          
          callback(null, results);
        }
      });
    }
  });
};

var sortTagsByPopularity = function (tags, callback) {
  var countObject = {};
  tags.forEach(function (tag) {
    if (tag) {
      tag = tag.toLowerCase();
      countObject['' + tag] = countObject['' + tag] + 1 || 1;
    }
  });

  var results = [];
  var count;
  var wordCount;
  for (var key in countObject) {
    count = countObject[key];
    wordCount = key.split(' ').length;
    countObject[key] = count + Math.min(count, (wordCount)) - 1;
    results.push({
      tag: key,
      popularity: countObject[key],
    });
  }
  
  results.sort(function (a, b) {
    return b.popularity - a.popularity;
  });

  return results.map(function (item) {
    return item.tag;
  });
};

var getSortedTagsForTopic = function (topic, callback, number) {
  getTagsForTopic(topic, function (error, tags) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, sortTagsByPopularity(tags));
    }
  }, number);
};

var getIdealTagsForTopic = function (topic, callback, number) {
  if (memCache[topic] !== undefined) {
    callback(null, memCache[topic]);
  } else {
    getSortedTagsForTopic(topic, function (error, tags) {
      var idealTags = settings.defaultTags.slice(0);
      tags.forEach(function (tag, index) {
        if (idealTags.join(', ').length + tag.length + 2 < 490) {
          idealTags.push(tag);
        }
      });

      memCache[topic] = idealTags;

      callback(null, idealTags);
    }, number);
  }
};

var getMostRecentVideosByChannelId = function (callback, number) {
  if (!number) {
    number = 25;
  }

  request({
    url: [
      'https://www.googleapis.com/youtube/v3/search',
      '?part=id',
      '&channelId=' + settings.channelId,
      '&maxResults=' + Math.min(number, 50),
      '&type=video',
      '&order=date',
      '&key=AIzaSyAjj_mH2B04zVPvHa54hEfTs9gwFw-0F6g'
    ].join(''),
    method: 'GET',
  }, function (error, response, body) {
    if (error) {
      callback(error, null);
    } else {
      body = JSON.parse(body);
      var videoIds = [];
      body['items'].forEach(function (value, index) {
        videoIds.push(value['id']['videoId']);
      });

      callback(error, videoIds);
    }
  });
};

var updateTagsForVideo = function (videoObject, tags, token, callback) { 
  request({
    url: [
      'https://www.googleapis.com/youtube/v3/videos',
      '?access_token=' + token,
      '&part=snippet'
    ].join(''),
    method: 'PUT',
    json: { 
      'id': videoObject.id + '',
      'kind': 'youtube#video',
      'snippet': {
        'title': videoObject.snippet.title,
        'categoryId': videoObject.snippet.categoryId,
        'tags': tags,
        'description': videoObject.snippet.description
      }
    }
  }, function (error, response, body) {
    callback(error, body);
  });
};


module.exports = {
  getIdsFor: getTopVideoIds,
  getVideoDetailsFor: getVideoDetailsById,
  getTagsFor: getTagsForTopic,
  sortTags: sortTagsByPopularity,
  getSortedTagsFor: getSortedTagsForTopic,
  getIdealTagsFor: getIdealTagsForTopic,
  getOwnVideos: getMostRecentVideosByChannelId,
  updateTagsFor: updateTagsForVideo,
};





