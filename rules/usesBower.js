var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  callback(null, repo.hasFile('bower.json').call(repo) || repo.hasFile('components.json').call(repo));
});