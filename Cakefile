{spawn} = require 'child_process'	

build = (watch) ->
  console.log "Watching .coffee files"
  options = ['-c', '-o', "lib", "src"]
  options.unshift('-w') if watch

  coffee = spawn 'coffee', options
  coffee.stdout.on 'data', (data) -> console.log data.toString()
  coffee.stderr.on "data", (data) -> process.stderr.write data.toString()

task "build", "", ->
  build()

task "watch", "", ->
  build(true)