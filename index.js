'use strict';

var Promise = require('es6-promise').Promise;
var zeroFill = require('zero-fill');

var BCVParser = require('./lib/bcv_parser.min').bcv_parser;
var bcv = new BCVParser();

var BOOK_TO_INDEX = require('./indexes/book-index-map');
var VERSE_INDEX = require('./indexes/verse-index-map');

// TODO Add option to choose bible version
var ASV_BIBLE = require('./bibles/asv');

module.exports = (function () {
  var bible = {};

  /**
   * Retrieve bible passages
   *
   * @param {String} psg - bible book/chapter/verse
   * @return {Promise} returns String passage
   */
  bible.get = function (psg) {
    if (typeof psg !== 'string') {
      throw new TypeError('Expected a string');
    }
    var self = this;
    // clean/normalize psg to bcv object
    var psgBCV = bcv.parse(psg).parsed_entities()[0].entities[0];

    if (!psgBCV) {
      throw new Error('Bad bible passage input');
    }

    return new Promise (function (res, rej) {
      var passage;

      // parse psg into index ranges
      var start = self._bcvToInd(psgBCV.start);
      var end = self._bcvToInd(psgBCV.end);

      if (end - start === 0) {
        passage = self._getVerses(ASV_BIBLE, start);
      } else {
        passage = self._getVerses(ASV_BIBLE, start, end);
      }

      if (passage) {
        res(passage);
      } else {
        rej(Error('Ahhhhh!!! Nooo!!!'));
      }
    });
  };

  /**
   * Convert book, chapter, verse object into verse index
   *
   * @param {Object} psg - bible book/chapter/verse obj
   * @return {String} verse index (ie: 01001001)
   */
  bible._bcvToInd = function (psg) {
    var book = BOOK_TO_INDEX[psg.b]['b'];
    var b = zeroFill(2, book);
    var c = zeroFill(3, psg.c);
    var v = zeroFill(3, psg.v);

    return b + c + v;
  };

  /**
   * Convert book, chapter, verse object into verse index
   *
   * @param {Object} bible - bible version object
   * @param {String} start - start index
   * @param {String} end - end index
   * @return {String} bible passage
   */
  bible._getVerses = function (bible, start, end) {
    var s = VERSE_INDEX[start];
    var e = VERSE_INDEX[end];
    var arr = [];

    // Return single verse if no end
    if (!e) {
      return bible[s];
    }

    for (var i = Number(s), len = Number(e);
           i < len + 1; i++) {
      arr.push(bible[i]);
    }

    return arr.join(' ');
  };

  return bible;
})();