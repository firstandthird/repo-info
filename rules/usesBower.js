var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  callback(null, repo.hasFile.call(repo,'bower.json') || repo.hasFile.call(repo,'components.json'));
});