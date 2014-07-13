#!/usr/bin/env node

var dirtyGit = require('../index')
dirtyGit(process.cwd()).on('data', function(data){
  console.log(data)
})