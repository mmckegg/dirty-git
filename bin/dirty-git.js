#!/usr/bin/env node
var dirty = require( '../' )
var program = require( 'commander' )
var package = require( '../package' )
var format = require( '../lib/format' )

program
  .version( package.version )
  .usage( '[options] [path]' )
  .option( '-i, --ignored', 'include ignored files' )
  .option( '-u, --untracked', 'include all untracked file paths' )
  .option( '-s, --staged', 'show stats for staged files' )
  .option( '-t, --tree', 'show stats for work tree files' )
  .option( '-d, --depth <n>', '(not implemented)' )
  .parse( process.argv )

var options = {
  ignored: !!program.ignored,
  untracked: !!program.untracked,
  staged: !!program.staged,
  tree: !!program.tree,
  depth: program.depth || 0,
}

if( !options.staged && !options.tree )
  options.tree = true

dirty( program.path || process.cwd(), options )
  .pipe( new format( options ) )
  .pipe( process.stdout )
