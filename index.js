'use strict';
var ghRepos = require('./modules/ghrepos'),
    options;

options = {
  user: process.argv[2],
  token: process.argv[3]
};

if (!options.token){
  console.warn('No token has been specified. It\'s likely you\'ll run out of requests');
}

ghRepos.getRepos(options, function (error, repos) {
  // Debugging
  var fs = require('fs');
  var outputFilename = 'tmp/repos.json';

  fs.writeFile(outputFilename, JSON.stringify(repos, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  });
  //console.log(repos);
});