(function() {
  var __slice = Array.prototype.slice;
  module.exports = function(config) {
    var createFiles, createFolder, eco, fs, mkdir, newPath, npm, path, print, spawn;
    fs = require("fs");
    path = require("path");
    eco = require("eco");
    spawn = require('child_process').spawn;
    print = require('util').print;
    mkdir = require("mkdirp");
    newPath = function(oldPath) {
      var r;
      r = oldPath.replace(__dirname + "/../templates/", "./" + config.appName + "/");
      console.log("working on " + r);
      return r;
    };
    createFolder = function(pathPrefix) {
      var file, stats, _i, _len, _ref, _results;
      _ref = fs.readdirSync(pathPrefix);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        stats = fs.lstatSync(pathPrefix + file);
        _results.push(stats.isDirectory() ? (createFolder(pathPrefix + file + "/"), mkdir.sync(newPath(pathPrefix + file))) : void 0);
      }
      return _results;
    };
    createFiles = function(pathPrefix) {
      var content, extension, file, filename, stats, _i, _j, _len, _ref, _ref2, _results;
      _ref = fs.readdirSync(pathPrefix);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        stats = fs.lstatSync(pathPrefix + file);
        _results.push(stats.isDirectory() ? createFiles(pathPrefix + file + "/") : (content = fs.readFileSync(pathPrefix + file), (_ref2 = file.split("."), filename = 2 <= _ref2.length ? __slice.call(_ref2, 0, _j = _ref2.length - 1) : (_j = 0, []), extension = _ref2[_j++], _ref2), extension === "template" ? (content = eco.render(content.toString(), config), filename = filename.join(".")) : (content = content.toString(), filename = filename.join(".") + "." + extension), fs.writeFileSync(newPath(pathPrefix + filename), content)));
      }
      return _results;
    };
    createFolder(__dirname + "/../templates/");
    createFiles(__dirname + "/../templates/");
    process.chdir(config.appName);
    npm = spawn("npm", ["install"]);
    npm.stdout.on('data', function(data) {
      return print(data.toString());
    });
    npm.stderr.on("data", function(data) {
      return process.stderr.write(data.toString());
    });
    return console.log("done");
  };
}).call(this);
