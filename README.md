[![Build Status](https://travis-ci.org/bricejlin/holy-bible.svg?branch=master)](https://travis-ci.org/bricejlin/holy-bible)

# Holy Bible
Easy to use JS library for retrieving bible scripture.

## Install

  `npm install holy-bible --save`

## Usage

  ```js
  var bible = require('holy-bible');

  bible.get('John 15:13')
    .then(function (res) {
      console.log(res);
    });

  // Greater love hath no man than this, that a man lay down his life for his friends.
  ```
## Tests

  `gulp test`