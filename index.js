var glob = require('glob')
var getDirectory = require('path').dirname
var exec = require('child_process').execFile
var Through = require('through')

module.exports = function(path, cb){
  var stream = Through()
  var result = []

  glob('**/.git', {cwd: path}, function(err, paths){
    var pending = 0
    paths.forEach(function(path){
      path = getDirectory(path)
      if (!/node_modules/.exec(path)){
        pending += 1
        exec('git', ['status'], {cwd: path}, function(err, stdout){
          if (/Untracked|modified/.exec(stdout)){
            result.push(path)
            stream.queue(path)
          }
          pending -= 1
          check()
        })
      }
    })

    function check(){
      if (!pending){
        stream.queue(null)
        if (typeof cb === 'function'){
          cb(null, result) 
        }
      }
    }
  })

  return stream
}