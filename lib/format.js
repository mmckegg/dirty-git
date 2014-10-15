var Stream = require( 'stream' )
var inherit = require( 'derive' ).inherit
var color = require( 'cli-color' )
var indent = require( 'indent' )
var path = require( 'path' )
var statusCodes = require( './status-codes' )

/**
 * Format constructor
 * @returns {Format}
 */
function Format( options ) {
  
  if( !(this instanceof Format) )
    return new Format( options )
  
  options = this.options = options || {}
  options.objectMode = true
  options.highWatermark = 1
  options.staged = options.staged != null ?
    options.staged : true
  options.tree = options.tree != null ?
    options.tree : true
  
  Stream.Transform.call( this, options )
  
}

Format.detail = function( repo, staged ) {
  
  // Render work tree or staged index?
  var tree = staged ? 'index' : 'tree'
  
  // Sum up all the stati
  var stati = repo.status.reduce( function( dist, stat ) {
    dist[ stat[ tree ] ]++
    return dist
  }, {
    'M': 0, 'A': 0, 'D': 0,
    'R': 0, 'C': 0, 'U': 0,
    '?': 0, '!': 0, ' ': 0
  })
  
  var summary = Object.keys( stati ).map( function( k ) {
    // Don't render unmodified or ignored files
    if( /[! ]/.test( k ) ) return
    // Don't render untracked files for staging
    if( staged && /[^ADRCU]/.test( k ) ) return
    // Don't render, if there's nothing to show
    if( stati[ k ] === 0 ) return
    // Get the human readable status
    var name = statusCodes[ k ]
    return stati[ k ] + ' ' + name
  })
  .filter( function( i ) { return !!i })
  .join( ', ' )
  
  return summary
  
}

Format.error = function( repo ) {
  var msg = repo.error.message ?
    repo.error.message : 'Unknown error'
  return 'Error: ' + msg
}

/**
 * Format prototype
 * @type {Object}
 */
Format.prototype = {
  
  constructor: Format,
  
  _transform: function( repo, encoding, next ) {
    
    var unreleased = !repo.tag && this.options.unreleased
    var shouldIgnore = !this.options.symlinks && repo.symlink

    if( (!unreleased && repo.status.length === 0) || shouldIgnore )
      return next()
    
    var output = ''
    var hasModifications = false
    
    output += repo.relativePath + ' '

    if (repo.symlink){
      output += color.yellow( '[sym] ')
    }

    output += color.green( '(' + repo.branch.index + ')' )

    if (repo.tag){
      output += color.cyan(' ' + repo.tag)
    }

    if (unreleased){
      output += color.cyan(' unreleased')
      hasModifications = true
    }

    output += '\n'
    
    if( repo.error ) {
      var error = Format.error( repo )
      output += color.red( error ) + '\n'
      return next( null, output )
    }
    
    if( this.options.staged ) {
      var staged = Format.detail( repo, true )
      if( staged.length > 0 ) {
        staged = color.cyan( staged )
        output += indent( staged, 2 ) + '\n'
        hasModifications = true
      }
    }
    
    if( this.options.tree ) {
      var tree = Format.detail( repo )
      if( tree.length > 0 ) {
        tree = color.magenta( tree )
        output += indent( tree, 2 ) + '\n'
        hasModifications = true
      }
    }
    
    hasModifications ?
      next( null, output + '\n' ) :
      next()
    
  }
  
}

// Inherit from transform stream
inherit( Format, Stream.Transform )

// Exports
module.exports = Format
