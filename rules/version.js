var Rule = require('../modules/rule');

module.exports = new Rule(function(repo, callback) {
  var version = '0.0.0';

  for (var tag in repo.data.tags){
    if (repo.data.tags.hasOwnProperty(tag)){
      if (tag > version){
        version = tag;
      }
    }
  }
  if(Object.getOwnPropertyNames(repo.data.tags).length === 0){
    version = 'Not found';
  }

  callback(null,version);
});