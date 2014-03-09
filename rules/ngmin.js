var Rule = require('../modules/rule'),
    request = require('../modules/request');

module.exports = new Rule(function(repo, callback) {
  var ngmin = false;

  if (repo.hasFile('package.json')){
    repo.getFile.call(repo, 'package.json', function (err, result) {
      if (err) {
        callback(err);
      }
      else {
        if (typeof result.devDependencies !== "undefined" && typeof result.devDependencies['grunt-ngmin'] !== "undefined"){
          ngmin = true;
        }
        callback(null,ngmin);
      }
    });
  }
  else {
    callback(null,ngmin);
  }
});