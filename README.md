# dirty-git
[![npm](https://img.shields.io/npm/v/dirty-git.svg?style=flat-square)](https://npmjs.com/dirty-git)
[![npm license](https://img.shields.io/npm/l/dirty-git.svg?style=flat-square)](https://npmjs.com/dirty-git)
[![npm downloads](https://img.shields.io/npm/dm/dirty-git.svg?style=flat-square)](https://npmjs.com/dirty-git)

List git repos that have dirty working directories (uncommited changes)

## Install via [npm](https://npmjs.com/package/dirty-git)

```sh
$ npm install --global dirty-git
```

## Command Line

```bash
$ cd ~/Code # navigate to starting point
$ dirty-git [options] [path]
```

### CLI Options

```
  -i, --ignored    include ignored files
  -u, --untracked  include all untracked file paths
  -l, --symlinks   include symlinked repos in results
  -r  --unreleased force include repos that have no current tag
  -s, --staged     show stats for staged files
  -t, --tree       show stats for work tree files
  -d, --depth <n>  nested sub folders to search (default: 3)
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
  symlink: true | false,
  path: '...',
  relativePath: '...',
  error: null,
}
```

## Contributors

- [Matt McKegg](https://github.com/mmckegg)
- [Jonas Hermsmeier](https://github.com/jhermsmeier)
