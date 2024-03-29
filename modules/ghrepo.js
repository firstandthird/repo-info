"use strict";
var request = require('./request'),
    aug = require('aug'),
    async = require('async');

function GHRepo (conf){
  this.data = aug({},conf);
}

GHRepo.prototype = {
  init: function (cb) {
    var self = this;

    // We need the branches first in order to get the last SHA of the repo, which will give us
    // the ability to get the full repo tree in one single request
    async.parallel([
      function (callback) {
        self._fetchBranches.call(self, callback);
      },
      function (callback) {
        self._fetchTags.call(self, callback);
      }
    ], function (err, result) {
      if (err){
        cb(err);
      }
      else {
        self._fetchFiles(function (err, results) {
          cb(err,results);
        });
      }
    })
  },
  _fetchBranches : function (callback) {
    var self = this;

    request({
      json: true,
      url: this.data.endpoints.branches,
      token: this.data.token
    }, function (err, response, branches) {
      if (err){
        callback(err);
      }
      else {
        self.data.branches = [];
        if (branches){
          branches.forEach(function (branch) {
            self.data.branches.push(branch.name);
            if(branch.name === 'master'){
              self.data.lastSHA = branch.commit.sha;
            }
          });
        }
        callback(null,self.data.branches);
      }
    });

  },
  _fetchTags: function (callback) {
    var self = this;

    request({
      json: true,
      url: this.data.endpoints.tags,
      token: this.data.token
    }, function (err, response, tags) {
      if (err){
        callback(err);
      }
      else {
        self.data.tags = {};
        if (tags){
          tags.forEach(function (tag) {
            self.data.tags[tag.name] = {
              name: tag.name,
              zip: tag.zipball_url,
              tar: tag.tarball_url,
              sha: tag.commit.sha
            }
          });
        }
        callback(null,self.data.tags);
      }
    });
  },
  _fetchFiles: function (callback) {
    var self = this;

    request({
      json: true,
      url: this.data.endpoints.files + this.data.lastSHA + '?recursive=1',
      token: this.data.token
    }, function (err, response, result) {
      if (err){
        callback(err);
      }
      else {
        self.data.files = {};

        if (result.tree){
          result.tree.forEach(function (file) {
            self.data.files[file.path] = {
              path: file.path,
              size: file.size
            };
          });
        }

        callback(null, self.data.files);
      }
    });
  },
  getFile: function (path, callback) {
    var self = this;

    var options = {
      url: this.data.endpoints.content + path,
      json: true,
      token: this.data.token
    };

    request(options, function (err, response, body) {
      if (err){
        callback(err);
      }
      else {
        var content = new Buffer(body.content,'base64').toString('utf8');
        if (path.indexOf('.json') !== -1){
          try {
            content = JSON.parse(content);
          }
          catch (e){
            console.warn('JSON for file %s on %s is not valid!', path, self.data.name);
            content = {};
          }
        }
        callback(null,content);
      }
    });
  },
  hasBranch: function (branch) {
    return typeof this.data.branches[branch] !== "undefined";
  },
  hasFile: function (path) {
    return typeof this.data.files[path] !== "undefined";
  }
};

module.exports = GHRepo;