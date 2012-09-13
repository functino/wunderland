module.exports = (config) ->
  fs = require("fs")
  path = require("path")
  eco = require("eco")
  {spawn} = require 'child_process'
  {print} = require 'util'
  mkdir = require("mkdirp")

  newPath = (oldPath) ->
    r = oldPath.replace(__dirname + "/../templates/", "./#{config.appName}/")
    console.log "working on " + r
    r

  createFolder = (pathPrefix) ->
    for file in fs.readdirSync(pathPrefix)
      stats = fs.lstatSync(pathPrefix + file)
      if stats.isDirectory()
        createFolder(pathPrefix + file + "/")
        mkdir.sync(newPath(pathPrefix + file))

  createFiles = (pathPrefix) ->
    for file in fs.readdirSync(pathPrefix)
      stats = fs.lstatSync(pathPrefix + file)
      if stats.isDirectory()
        createFiles(pathPrefix + file + "/")
      else
        content = fs.readFileSync pathPrefix + file
        [filename..., extension] = file.split "."
        if extension == "template"
          content = eco.render content.toString(), config
          filename = filename.join(".")
        else 
          content = content.toString()
          filename = filename.join(".") + "." + extension
        fs.writeFileSync newPath(pathPrefix + filename), content      
  createFolder(__dirname + "/../templates/")
  createFiles(__dirname + "/../templates/")

  process.chdir(config.appName)
  console.log("installing npm dependencies")
  npm = spawn "npm", ["install"]
  npm.stdout.on 'data', (data) -> print data.toString()
  npm.stderr.on "data", (data) -> process.stderr.write data.toString()

  console.log("installing bower dependencies")
  bower = spawn "bower", ["install"]
  bower.stdout.on 'data', (data) -> print data.toString()
  bower.stderr.on "data", (data) -> process.stderr.write data.toString()