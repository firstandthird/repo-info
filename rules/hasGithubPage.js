var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  callback(null,repo.hasBranch('gh-pages').call(repo));
});