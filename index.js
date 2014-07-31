var GlobStream = require( 'glob-stream' )
var StatusStream = require( './lib/status' )

module.exports = function( dir, options ) {
  return GlobStream.create( './*/.git', {
    cwd: dir || process.cwd(),
    cwdbase: true
  }).pipe( new StatusStream( options ) )
}
