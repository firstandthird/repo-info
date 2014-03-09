var Rule = require('../modules/rule');

function monthDiff(date1, date2) {
  var months;
  months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth() + 1;
  months += date2.getMonth();

  return months <= 0 ? 0 : months;
}

module.exports = new Rule(function(repo, callback) {
  callback(null, monthDiff(repo.data.lastPush, new Date()) <= 1);
});