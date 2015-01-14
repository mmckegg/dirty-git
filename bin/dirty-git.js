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
  .option( '-l, --symlinks', 'include symlinked repos in results')
  .option( '-r, --unreleased', 'force include repos that have no current tag')
  .option( '-s, --staged', 'show stats for staged files' )
  .option( '-t, --tree', 'show stats for work tree files' )
  .option( '-d, --depth <n>', 'nested sub folders to search (default: 3)' )
  .parse( process.argv )

var options = {
  ignored: !!program.ignored,
  untracked: !!program.untracked,
  unreleased: !!program.unreleased,
  staged: !!program.staged,
  tree: !!program.tree,
  depth: program.depth,
  symlinks: !!program.symlinks
}

if( !options.staged && !options.tree )
  options.tree = true

dirty( program.args.shift() || process.cwd(), options )
  .pipe( new format( options ) )
  .pipe( process.stdout )
