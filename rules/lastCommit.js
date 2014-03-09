var Rule = require('../modules/rule'),
    request = require('../modules/request');

module.exports = new Rule(function(repo, callback) {
  var options = {
    url: repo.data.endpoints.commits,
    json: true,
    token: repo.data.token
  };

  request(options, function (err, response, body) {
    if (err) {
      callback(err,null);
    }
    else {
      var lastCommit = {};
      if (Array.isArray(body)){
        lastCommit = body[0];
      }
      else {
        lastCommit = 'Not found';
      }
      callback(null,lastCommit);
    }
  });
});