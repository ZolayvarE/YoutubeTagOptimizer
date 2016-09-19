var youtube = require('./helpers/youtubeHelpers.js');

youtube.getTagsFor('barbie', function (error, tags) {
  if (error) {
  	console.log(error);
  } else {
  	var countObject = {};
   	tags.forEach(function (tag) {
   	  if (tag) {
  	    tag = tag.toLowerCase();
  	    countObject[tag] = countObject[tag] + 1 || 1;
   	  }
  	});

  	countObject;
  }
});



























