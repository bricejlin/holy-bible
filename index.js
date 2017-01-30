'use strict';

var Promise = require('es6-promise').Promise;
var zeroFill = require('zero-fill');

var BCVParser =
  require('bible-passage-reference-parser/js/en_bcv_parser').bcv_parser;
var bcv = new BCVParser();

var BOOK_TO_INDEX = require('./indexes/book-index-map');
var VERSE_INDEX = require('./indexes/verse-index-map');

var BIBLES = {
  'asv': require('./bibles/asv'),
  'kjv': require('./bibles/kjv')
};

module.exports = (function () {
  var bible = {};

  /**
   * Retrieve bible passages
   *
   * @param {String} psg - bible book/chapter/verse
   * @param {String} ver - bible version
   * @param {Boolean} includeSuperscript - Flag to include verse superscript in
   *    return text.
   * @return {Promise} returns String passage
   */
  bible.get = function (psg, ver, includeSuperscript) {
    if (typeof psg !== 'string') {
      throw new TypeError('Passage should be a string');
    }
    if (typeof ver !== 'undefined' && typeof ver !== 'string') {
      throw new TypeError('Version should be a string');
    }

    var self = this;
    var inclSup = includeSuperscript || false;
    var v = ver || 'asv';
    v = v.toLowerCase();

    // clean/normalize psg to bcv object
    var psgBCV = bcv.parse(psg).parsed_entities()[0].entities[0];

    if (!psgBCV) { throw new Error('Bad bible passage input'); }

    return new Promise(function (res, rej) {
      // parse psg into index ranges
      var start = self._bcvToInd(psgBCV.start);
      var end = self._bcvToInd(psgBCV.end);
      var psgOsis = psgBCV.osis;
      var text = (end - start === 0) ?
        self._getVerses(BIBLES[v], start, null, inclSup) :
        self._getVerses(BIBLES[v], start, end, inclSup);

      if (text) {
        var data = { version: v, passage: psgOsis, text: text };
        res(data);
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
    var book = BOOK_TO_INDEX[psg.b].b;
    var b = zeroFill(2, book);
    var c = zeroFill(3, psg.c);
    var v = zeroFill(3, psg.v);

    return b + c + v;
  };

  /**
   * Convert book, chapter, verse object into verse index
   *
   * @param {Object} bVersions - bible version object
   * @param {String} start - start index
   * @param {String} end - end index
   * @param {Boolean} includeSuperscript - Indicate whether verse superscript
   *    should be returned with text.
   * @return {String} bible passage
   */
  bible._getVerses = function (bVersions, start, end, includeSuperscript) {
    var s = VERSE_INDEX[start];
    var e = VERSE_INDEX[end];
    var arr = [];

    // Return single verse if no end
    if (!e) {
      var prefix = includeSuperscript ? this._getVerseByVerseIndex(s) : '';
      return prefix + bVersions[s];
    }

    var i = Number(s), len = Number(e);
    if (includeSuperscript) {
      for (; i < len + 1; i++) {
        arr.push(this._getVerseByVerseIndex(i) + bVersions[i]);
      }
    } else {
      for (; i < len + 1; i++) {
        arr.push(bVersions[i]);
      }
    }

    return arr.join(' ');
  };

  /**
   * Convert a verse index value into the superscript verse number associated
   *    with the passage.
   *
   * @param {number} value - Value of any key pair within the VERSE_INDEX object
   * @returns {string} - The superscript verse associated with the passed index
   *    value.
   * @private
   */
  bible._getVerseByVerseIndex = function (value) {
    for (var key in VERSE_INDEX) {
      if (VERSE_INDEX.hasOwnProperty(key)) {
        if (VERSE_INDEX[key] === value) {
          return '<sup>' + Number(key.slice(-3)) + '</sup>';
        }
      }
    }
  };

  return bible;
})();
