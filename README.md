dirty-git
===

List git repos that have dirty working directories (uncommited changes)

## Install

```bash
$ npm install dirty-git -g
```

## Command Line

```bash
$ cd ~/Code # navigate to starting point
$ dirty-git
```

## API

```js
var dirtyGit = require('dirty-git')
dirtyGit(process.cwd()).on('data', function(data){
  console.log(data)
})
```