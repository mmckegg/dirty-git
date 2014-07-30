var Glob = require('glob').Glob
var getDirectory = require('path').dirname
var exec = require('child_process').execFile
var Through = require('through')

module.exports = function(root, cb){
  var stream = Through()
  var result = []

  var processing = 0
  var queue = []
  var pending = 3
  
  // only search 4 levels down
  glob(['.git', '*/.git', '*/*.git', '*/*/*/.git', '*/*/*/*.git'])

  function glob(patterns){
    patterns.forEach(function(pattern){
      new Glob(pattern, {cwd: root}).on('match', add).on('end', function(){
        pending -= 1
        check()
      })
    })
  }

  function add(path){
    path = getDirectory(path)
    if (!/node_modules/.exec(path)){
      if (processing > 50){
        queue.push(path)
      } else {
        process(path)
      }
    }
  }

  function process(path){
    processing += 1
    exec('git', ['status'], {cwd: path}, function(err, stdout){
      if (/Untracked|modified/.exec(stdout)){
        result.push(path)
        stream.queue(path)
      }
      processing -= 1
      check()
    })
  }

  function check(){
    if (processing == 0){
      if (queue.length){
        while (queue.length && processing < 50){
          process(queue.shift())
        }
      } else if (!pending) {
        stream.queue(null)
        if (typeof cb === 'function'){
          cb(null, result) 
        }
      }
    }
  }

  return stream
}