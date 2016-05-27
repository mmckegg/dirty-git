var GlobStream = require('glob-stream')
var StatusStream = require('./lib/status')
var path = require('path')

module.exports = function (dir, options) {
  var output = new StatusStream(options)

  var depth = options.depth == null ? 3 : parseInt(options.depth)
  var paths = getDepthPaths(depth)

  GlobStream.create(paths, {
    cwd: dir || process.cwd(),
    cwdbase: true,
    allowEmpty: true
  }).pipe(output)

  return output
}

function getDepthPaths (depth) {
  var result = []
  var currentPath = './'
  for (var i = 0;i <= depth;i++) {
    result.push(path.join(currentPath, '.git'))
    currentPath = path.join(currentPath, '*/')
  }
  return result
}
