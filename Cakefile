{spawn} = require 'child_process'	

spawnAndLog = (name, params) ->
  spawned = spawn name, params
  spawned.stdout.on 'data', (data) -> print data.toString()
  spawned.stderr.on "data", (data) -> process.stderr.write data.toString()
  spawned

build = (watch) ->
  console.log "Watching .coffee files"
  options = ['-c', '-o', "lib", "src"]
  options.unshift('-w') if watch
  coffee = spawnAndLog 'coffee', options

task "build", "", ->
  build()

task "watch", "", ->
  build(true)

task "create", "", ->
  create = require("./src/create")
  create(appName: "test")