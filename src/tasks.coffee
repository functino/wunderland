module.exports = ->
  fs = require "fs"
  {print} = require 'util'
  {spawn} = require 'child_process'
  compressor = require 'node-minify'

  spawnAndLog = (name, params) ->
    spawned = spawn name, params
    spawned.stdout.on 'data', (data) -> print data.toString()
    spawned.stderr.on "data", (data) -> process.stderr.write data.toString()
    spawned

  config = JSON.parse(fs.readFileSync("config/application.json"))

  task "create", "", ->
    create = require("./create")
    create(appName: "testname")
  bundle = ->
    code = compileTemplates()
    for file in config.bundle
      code += ";\n" + fs.readFileSync("src/" + file)
    fs.writeFileSync('public/application.js', code)
    console.log "bundled js"
  build = (watch) ->
    console.log "Watching .coffee files"
    for folder in ['./src', './test']
      options = ['-c', '-o', folder, folder]
      options.unshift('-w') if watch
      coffee = spawnAndLog 'coffee', options
      coffee.stdout.on 'data', (data) ->
        bundle()

  style = (watch)->
    console.log "Watching stylesheets"
    options = ["compile"]
    options = ['watch'] if watch
    spawnAndLog 'compass', options

  compileTemplates = ->
    path = "./src/templates"
    files = fs.readdirSync path
    eco = require "eco"
    templates = []
    for file in files
      [filename..., extension] = file.split "."
      if extension == "html"
        console.log "compiling #{filename}"
        content = fs.readFileSync path + "/" + file
        templateSource = eco.precompile content.toString()
        templates.push("JST.#{filename} = #{templateSource}")
    code = "JST = {};" + templates.join(";") + ";"
    console.log "compiled templates"
    code

  task 'build', 'Build', ->
    build(false)
    style(false)

  task 'watch', "build and watch", ->
    build true
    style true
    watch = require('watch')
    watch.watchTree "./src/templates", ->
      console.log "detected template change"
      bundle()
  task "bundle", "bundles the javascript files to one file", ->
    bundle()

  task "minify", "minify js and css", ->
    new compressor.minify 
      type: 'yui',
      fileIn: './public/style.css',
      fileOut: './public/style.css',
      callback: (err) ->
        console.log(err)
    new compressor.minify 
      type: 'yui',
      fileIn: './public/application.js',
      fileOut: './public/application.js',
      callback: (err) ->
        console.log(err)    

  option '-w', '--watch', 'should the server task start the watch task?'
  task "server", "Start a development server", (options) ->
    invoke "watch" if options.watch
    process.env.PORT = config.port
    node = spawnAndLog 'node', ['web.js']


  task "test-server", "Start a test server", (options) ->
    spawnAndLog 'buster', ['server']

  task "test-static", "Start a test server", (options) ->
    spawnAndLog 'buster', ['static']

  task "test", "run the tests", ->
    spawnAndLog 'buster', ['test', '--config', 'test/config.js']

  task "manifest", "manifest", ->
    files = []
    execFile = require('child_process').execFile
    execFile 'find', [ './public' ], (err, stdout, stderr) ->
      for file in stdout.toString().replace("/public/", "").split("\n")
        file = file.replace("./public/", "")
        files.push(file) if file[0] != "."
      console.log(files.join("\n"))