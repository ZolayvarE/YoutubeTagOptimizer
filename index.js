var youtube = require('./helpers/youtubeHelpers.js');

youtube.getTagsFor('barbie genie', function (error, tags) {
  if (error) {
    console.log(error);
  } else {
    console.log(youtube.sortTags(tags));
  }
}, 50);



























