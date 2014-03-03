"use strict";
var request = require('./request'),
    async = require('async'),
    GHRepo = require('./ghrepo');

var USER_API = function(user){
  return 'https://api.github.com/users/' + user + '/repos';
};
var ORG_API = function (organization) {
  return 'https://api.github.com/orgs/' + organization + '/repos';
};

exports.getRepos = function (obj, callback) {
  var url, result = [];

  if (obj.user){
    url = USER_API(obj.user);
  }
  else if(obj.organization){
    url = ORG_API(obj.organization);
  }

  if (url){
    var parseRepos = function () {
      var repos = {}, reposInit = [];

      result.forEach(function(batch){
        batch.forEach(function (repo) {
          repos[repo.full_name] = new GHRepo({
            name: repo.name,
            token: obj.token,
            fullName: repo.full_name,
            owner: {
              name: repo.owner.login
            },
            endpoints: {
              tags: repo.tags_url,
              branches: repo.branches_url.replace('{/branch}',''),
              files: repo.trees_url.replace('{/sha}','/')
            },
            isPrivate: repo.private,
            isFork: repo.fork,
            url: repo.html_url,
            created: repo.created_at,
            lastUpdate: repo.updated_at,
            lastPush: repo.pushed_at,
            watchers: repo.watchers_count,
            stars: repo.stargazers_count,
            forks: repo.forks,
            language: repo.language,
            homepage: repo.homepage,
            hasIssues: repo.has_issues,
            hasDownloads: repo.has_downloads,
            hasWiki: repo.has_wiki
          });

          reposInit.push(function (callback) {
            repos[repo.full_name].init.call(repos[repo.full_name],callback);
          });
        });
      });
      async.parallel(reposInit, function (err) {
        callback(err,repos);
      });
    };

    var fetchData = function(url){
      request({
        url: url,
        token: obj.token
      }, function (err, response, body) {
        if (err){
          callback(err,null);
        }
        else {
          result.push(body);
          if (response.headers.link && response.headers.link.next){
            console.log('Fetching page %s', response.headers.link.next.page);
            fetchData(response.headers.link.next.url);
          }
          else {
            parseRepos();
          }
        }
      });
    };
    fetchData(url);
  }
  else {
    throw new Error('Not enough data has been provided. We need to know the user or the organization.');
  }
};