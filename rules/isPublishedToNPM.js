var Rule = require('../modules/rule'),
    request = require('../modules/request');

module.exports = new Rule(function(repo, callback) {
  var published = false;

  if (repo.hasFile('package.json')){
    repo.getFile.call(repo, 'package.json', function (err, result) {
      if (err) {
        callback(err);
      }
      else {
        if (typeof result.repository !== 'undefined' && !result.private){
          var options = {
            url: 'https://registry.npmjs.org/' + result.name,
            json: true
          };

          request(options, function (err, response, body) {
            if (err){
              callback(err);
            }
            else {
              if (typeof body.repository !== "undefined" && body.repository.url === result.repository.url){
                published = true;
              }

              callback(null, published);
            }
          });
        }
        else {
          callback(null, published);
        }
      }
    });
  }
  else {
    callback(null,published);
  }
});