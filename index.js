'use strict';
var ghRepos = require('./modules/ghrepos'),
    rules = require('./modules/rules'),
    async = require('async'),
    options;

options = {
  user: process.argv[2],
  token: process.argv[3]
};

if (!options.token){
  console.warn('No token has been specified. It\'s likely you\'ll run out of requests');
}

ghRepos.getRepos(options, function (error, repos) {
  var rulesResults = {};

  for (var repo in repos) {
    if(repos.hasOwnProperty(repo)){
      (function (repo) {
        rules(repos[repo], ['version'], function (err, result) {
          rulesResults[repo] = result;
        });
      })(repo);
    }
  }

  // Debugging
  var fs = require('fs');
  var outputFilename = 'tmp/repos.json';

  fs.writeFile(outputFilename, JSON.stringify(rulesResults, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  });
  //console.log(repos);
});