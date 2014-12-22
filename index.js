var spawn = require('child_process').spawn
var path = require('path')

module.exports = function (config) {

  config = config || require('./config')

  return function (cmd, callback) {
    if (typeof cmd != 'string') throw new Error('Command must be a string')
    callback = callback || function noop() {}

    if (cmd.toLowerCase().indexOf('list') === 0) {
      console.log('The following commands are available:')
      cmd = 'ls -1 ' + config.scripts
    }
    else {
      var prefix = (config.scripts[0] !== '/' ? './' : '')
      var env = 'SCRIPTS=' + prefix + config.scripts
      cmd = env + ' '  + prefix + config.scripts + '/' + cmd
      cmd = cmd.replace('&&', '\\&\\&')
    }

    var args = [
      '-p', config.port,
      '-l', config.user,
      '-o', 'LogLevel=QUIET'
    ]

    // force interactive mode
    if (isTTY()) args.push('-t')

    if (config.key) {
      args = args.concat([ '-i', keyPath(config.key) ])
    }

    args = args.concat([config.host, cmd])

    var child = spawn('ssh', args, { stdio: 'inherit' })

    child.on('close', function (code) {
      if (code === 0) return callback()
      callback(new Error('Child process failed with error code: ' + code))
    })

    child.on('error', function() {})
  }

}

function keyPath(key) {
  return key.replace(/~/, process.env.HOME)
}

function isTTY() {
  return process.stdin.isTTY
    && process.stdout.isTTY
    && process.stderr.isTTY
}
