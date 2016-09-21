var request = require('request');

var url = 'https://accounts.google.com/o/oauth2/v2/auth?&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube&response_type=code&client_id=552208115327-19791jooknk80n0agadd18inajvcdv0t.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3571%2Fauthenticated&pageId=114243413493704477781';

request.get(url, function (err, body, resp) {
  if (err) {
    console.log(err);
  } else {
    console.log(resp);
  }
});