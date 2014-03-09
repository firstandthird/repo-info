var Rule = function (ruleFunc) {
  this.ruleFunc = ruleFunc;
};

Rule.prototype.run = function (repo,callback) {
  this.ruleFunc(repo,callback);
};

module.exports = Rule;