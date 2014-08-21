var GlobStream = require( 'glob-stream' )
var StatusStream = require( './lib/status' )

module.exports = function( dir, options ) {
  var output = new StatusStream( options )

  var depth = options.depth == null ? 3 : parseInt(options.depth)
  var paths = getDepthPaths(depth)
  
  GlobStream.create(paths, {
    cwd: dir || process.cwd(),
    cwdbase: true
  }).pipe(output)

  return output
}

function getDepthPaths(depth){
  var result = []
  var currentPath = './'
  for (var i=0;i<=depth;i++){
    result.push(currentPath + '.git')
    currentPath += '*/'
  }
  return result
}