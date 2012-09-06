module.exports = ->
  express = require('express')
  fs = require("fs")
  app = express.createServer()
  app.use(express.static('./public'))
  app.use(express.logger())
  app.get "/cache.manifest", (req, res) ->
    res.header("Content-Type", "text/cache-manifest")
    res.end(fs.readFileSync("public/cache.manifest"))
  port = process.env.PORT || 3000
  app.listen port, ->
    console.log("Server started on :" + port)