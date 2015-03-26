# Holy Bible [![Build Status](https://travis-ci.org/bricejlin/holy-bible.svg?branch=master)](https://travis-ci.org/bricejlin/holy-bible) [![npm version](https://badge.fury.io/js/holy-bible.svg)](http://badge.fury.io/js/holy-bible)


  Easy-to-use JS library for retrieving bible scripture.


## Installation

  ```bash
  $ npm install holy-bible --save
  ```

## Usage

  ```js
  var bible = require('holy-bible');

  bible.get('John 15:13', 'ASV') // also supports 2-letter abbrev (ie: Jn 15:13)
    .then(function (res) {
      console.log(res.passage);
    });

  // Greater love hath no man than this, that a man lay down his life for his friends.
  ```

## Documentation

###.get(verse [, version]) => Promise

######verse - A bible passage
  Type: `String`

######version - Bible version
  Type: `String`
  Default: `'ASV'`


######Resolves into an object
```js
{
  version: 'ASV',
  passage: 'John.15.13',
  text: 'Greater love...'
}
```
  
## Currently Supported Versions

  - ASV
  - KJV

## Tests

  ```bash
  $ npm install
  $ npm test
  ```

## License

  [MIT](https://github.com/bricejlin/holy-bible/blob/master/LICENSE)