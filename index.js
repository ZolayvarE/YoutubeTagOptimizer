var youtube = require('./helpers/youtubeHelpers.js');

youtube.getTagsFor('barbie genie', function (error, tags) {
  if (error) {
  	console.log(error);
  } else {
  	youtube.sortTags(tags, function (error, sortedTags) {
  	  console.log(sortedTags);
  	})
  }
}, 50);



























