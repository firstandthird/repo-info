var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  callback(null,repo.hasBranch.call(repo, 'gh-pages'));
});