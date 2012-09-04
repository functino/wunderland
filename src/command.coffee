exports.run = ->
  create = require "./create"
  args = process.argv.splice(2)
  if args[0] == "create"
  	console.log("creating app #{args[1]}")
  	create appName: args[1]