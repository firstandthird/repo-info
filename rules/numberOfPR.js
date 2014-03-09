var Rule = require('../modules/rule'),
    request = require('../modules/request');

module.exports = new Rule(function(repo, callback) {
  var options = {
    url: repo.data.endpoints.pullRequests,
    json: true,
    token: repo.data.token
  };

  request(options, function (err, response, body) {
    if (err) {
      console.log(err);
      callback(err,null);
    }
    else {
      callback(null,body.length || 0);
    }
  });
});