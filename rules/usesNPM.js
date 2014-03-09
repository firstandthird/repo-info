var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  callback(null, repo.hasFile('package.json').call(repo));
});