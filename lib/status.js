var Stream = require( 'stream' )
var inherit = require( 'derive' ).inherit
var path = require( 'path' )
var spawn = require( 'child_process' ).spawn
var lstat = require( 'fs' ).lstat

function exec( cmd, argv, options, callback ) {
  
  var buffer = ''
  
  var child = spawn( cmd, argv, options )
    .on( 'error', callback )
    .on( 'close', function( code ) {
      if( code !== 0 )
        return callback(
          new Error( 'Child process exited with code ' + code )
        )
      callback( null, buffer )
    })
  
  child.stdout.on( 'data', function( chunk ) {
    buffer += chunk
  })
  
}

/**
 * Status constructor
 * @returns {Status}
 */
function Status( options ) {
  
  if( !(this instanceof Status) )
    return new Status( options )
  
  options = this.options = options || {}
  options.objectMode = true
  options.highWatermark = 1
  options.ignored = options.ignored != null ?
    options.ignored : false
  options.untracked = options.untracked != null ?
    options.untracked : false
  
  Stream.Transform.call( this, options )
  
}

Status.parseBranch = function( line ) {
  
  // Handle <branch>[...<remote>]
  var pattern = /##\s+([^\s]+?)(?:\.{3}|$)(?:([^\s]+))?/
  var info = pattern.exec( line )
  
  if( info != null ) {
    return {
      index: info[1],
      remote: info[2]
    }
  }
  
  // Handle repos in initial state
  pattern = /##\s+Initial\s+commit\s+on\s+([^\s]+)/i
  info = pattern.exec( line )
  
  if( info != null ) {
    return {
      index: info[1] + ':initial',
      remote: null
    }
  }
  
  // Well, shit happened
  return {}
  
}

Status.parseStatus = function( line ) {
  return {
    index: line[0],
    tree: line[1],
    path: line.substring( 3 ),
  }
}

Status.parseOutput = function( str ) {
  return str
    .replace( /^\s+|\s+$/, '' )
    .split( /\r?\n/g )
    .map( function( line, i ) {
      return ( i === 0 ) ?
        Status.parseBranch( line ) :
        Status.parseStatus( line )
    })
}

/**
 * Status prototype
 * @type {Object}
 */
Status.prototype = {
  
  constructor: Status,
  
  _getStatus: function( dir, done ) {
    
    var argv = [ 'status', '--porcelain', '-b' ]
    
    // List ignored files as well
    if( this.options.ignored )
      argv.push( '--ignored' )
    
    // List all untracked files
    if( this.options.untracked )
      argv.push( '--untracked-files=all' )
    
    return exec( 'git', argv, { cwd: dir }, done )
  },

  _checkTag: function( dir, done ) {
    var argv = [ 'describe', '--exact-match', '--abbrev=0' ]
    return exec( 'git', argv, { cwd: dir }, done )
  },
  
  _transform: function( data, encoding, next ) {
    
    var self = this
    var root = path.join( data.path, '..' )
    
    self._getStatus( root, function( error, output ) {
      self._checkTag( root, function( tagError, tag ) {
        lstat( root, function( statError, directory ) {
          var status = Status.parseOutput( output )
          next( null, {
            branch: status.shift(),
            tag: (tag || '').trim(),
            status: status,
            path: root,
            symlink: directory.isSymbolicLink(),
            relativePath: path.relative( data.base, root ),
            error: error,
          })
        })
      })
    })
  }
  
}

// Inherit from transform stream
inherit( Status, Stream.Transform )

// Exports
module.exports = Status
