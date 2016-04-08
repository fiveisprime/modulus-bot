const Util = require('util');

const Hoek = require('hoek');
const Request = require('request');

module.exports = function (token) {
  const Options = {
    json: true,
    qs: { authToken: token }
  };

  function listProjects(userId, done) {
    var opts = {
      url: Util.format('https://api.onmodulus.net/user/%s/projects', userId)
    };

    Request(
      Hoek.applyToDefaults(Options, opts),
      function (err, response, body) {
        if (err) return done(err);
        done(null, body);
      }
    );
  }

  function restartProject(id, done) {
    var opts = {
      url: Util.format('https://api.onmodulus.net/project/%s/restart')
    };

    Request(
      Hoek.applyToDefaults(Options, opts),
      function (err, response, body) {
        if (err) return done(err);
        done(null, body);
      }
    );
  }

  return {
    listProjects: listProjects,
    restartProject: restartProject
  };
};
