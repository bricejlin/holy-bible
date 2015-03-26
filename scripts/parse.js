'use strict';
var fs = require('fs');
var abbr = require('../bibles/convertcsv');
var arr = [];

for (let i = 0; i < abbr.length; i++) {
  // arr[abbr[i]['FIELD1']] = abbr[i]['FIELD5'];
  arr.push(abbr[i]['FIELD5']);
}

fs.writeFile('kjv.json', JSON.stringify(arr), function (err) {
  if (err) throw err;
  console.log('done!');
});