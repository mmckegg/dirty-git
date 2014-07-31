dirty-git
===

List git repos that have dirty working directories (uncommited changes)

## Install

```bash
$ npm install --global dirty-git
```

## Command Line

```bash
$ cd ~/Code # navigate to starting point
$ dirty-git [options] [path]
```

### CLI Options

```
  --ignored, -i         include ignored files
  --untracked, -u       include all untracked file paths
  --staged, -s          show stats for staged files
  --tree, -t            show stats for work tree files
  --depth, -d <number>  (not implemented)
```

## API

```js
var dirtyGit = require( 'dirty-git' )
var stream = dirtyGit( process.cwd(), options )
  .on( 'readable', function() {
    var repo = null
    while( repo = this.read() ) {
      // do things with it...
    }
  })
```

```js
// Repository data structure
// (emitted by the dirtyGit stream)
{
  branch: { index: 'master', remote: 'origin/master' },
  status: [
    { index: 'M', tree: ' ', path: '...' },
    ...
  ],
  path: '...',
  relativePath: '...',
  error: null,
}
```
