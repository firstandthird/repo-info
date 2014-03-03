"use strict";

var cache = {},
    aug = require('aug'),
    parseLinks = require('parse-link-header'),
    request = require('request');

var addTokenToURL = function (token, url) {
  if (token){
    var connector = '?';
    if (url.indexOf(connector) !== -1){
      connector = '&';
    }
    url += connector + 'access_token=' + token;
  }

  return url;
};

var defaults = {
  headers: {
    'User-Agent': 'repos-First-Third'
  }
};

var doRequest = function(opt, callback){
  if (typeof cache[opt.url] === "undefined"){
    console.log('Doing request to %s', opt.url);
    var url = addTokenToURL(opt.token,opt.url),
        options = {
          url : url,
          json : !!opt.json
        };

    options = aug({},defaults,options);

    request.get(options, function(err, response, body){
      if (!err){
        cache[url] = {
          response : response,
          body: body
        };
      }
      if (response.headers.link){
        response.headers.link = parseLinks(response.headers.link);
      }

      callback(err,response,body);
    });
  }
  else {
    var data = cache[opt.url];
    callback(null, data.response, data.body);
  }
};


module.exports = doRequest;