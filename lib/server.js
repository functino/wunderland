(function() {
  module.exports = function() {
    var app, express, fs, port;
    express = require('express');
    fs = require("fs");
    app = express.createServer();
    app.use(express.static('./public'));
    app.use(express.logger());
    app.get("/cache.manifest", function(req, res) {
      res.header("Content-Type", "text/cache-manifest");
      return res.end(fs.readFileSync("public/cache.manifest"));
    });
    port = process.env.PORT || 3000;
    return app.listen(port, function() {
      return console.log("Server started on :" + port);
    });
  };
}).call(this);
