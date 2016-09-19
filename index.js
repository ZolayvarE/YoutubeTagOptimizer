var youtube = require('./helpers/youtubeHelpers.js');

youtube.getIdealTagsFor('dogs', function (err, tags) {
  console.log(tags.join(', '));
  console.log(tags.join(', ').length);
});



























