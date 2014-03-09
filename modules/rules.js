var async = require('async')
    ruleList = {};

module.exports = function (repo, rules, callback) {
  var results = {}, batch = [];

  rules.forEach(function (rule) {
    if (typeof ruleList[rule] === "undefined"){
      try {
        ruleList[rule] = require('../rules/' + rule);
      }
      catch (e){
        console.warn('The rule %s is not available', rule);
        return;
      }
    }
    else if (typeof results[rule] !== "undefined"){
      console.warn('The rule %s has already been ran. This will be skipped', rule);
      return;
    }
    else {
      (function (rule) {
        batch.push(function (callback) {
          ruleList[rule].run(repo, function (err, result) {
            callback(err,result);
            results[rule] = result;
          })
        });
      })(rule);
    }
  });

  async.parallel(batch, function (err) {
    callback(err,results);
  });
};

