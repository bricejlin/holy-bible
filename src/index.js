import { Promise } from 'es6-promise';

const zeroFill = require('zero-fill');

import { bcv_parser as BCVParser }  from 'bible-passage-reference-parser/js/en_bcv_parser';
const bcv = new BCVParser();

import * as BOOK_TO_INDEX from '../indexes/book-index-map';
import * as VERSE_INDEX from '../indexes/verse-index-map';

const BIBLES = {
  'asv': require('../bibles/asv'),
  'kjv': require('../bibles/kjv')
};

module.exports = (function () {
  const bible = {};

  /**
   * Retrieve bible passages
   *
   * @param {String} psg - bible book/chapter/verse
   * @param {String} ver - bible version
   * @return {Promise} returns String passage
   */
  bible.get = function (psg, v = 'asv') {
    if (typeof psg !== 'string') { throw new TypeError('Expected a string'); }

    const self = this;

    // clean/normalize psg to bcv object
    const psgBCV = bcv.parse(psg).parsed_entities()[0].entities[0];

    if (!psgBCV) { throw new Error('Bad bible passage input'); }

    return new Promise((res, rej) => {
      // parse psg into index ranges
      const start = this._bcvToInd(psgBCV.start);
      const end = this._bcvToInd(psgBCV.end);
      const psgOsis = psgBCV.osis;
      const text = (end - start === 0) ? this._getVerses(BIBLES[v], start)
                                       : this._getVerses(BIBLES[v], start, end);

      if (text) {
        let data = { version: v, passage: psgOsis, text: text };
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
  bible._bcvToInd = (psg) => {
    const book = BOOK_TO_INDEX[psg.b].b;
    const b = zeroFill(2, book);
    const c = zeroFill(3, psg.c);
    const v = zeroFill(3, psg.v);

    return b + c + v;
  };

  /**
   * Convert book, chapter, verse object into verse index
   *
   * @param {Object} bVersions - bible version object
   * @param {String} start - start index
   * @param {String} end - end index
   * @return {String} bible passage
   */
  bible._getVerses = (bVersions, start, end) => {
    const s = VERSE_INDEX[start];
    const e = VERSE_INDEX[end];
    const arr = [];

    // Return single verse if no end
    if (!e) { return bVersions[s]; }

    for (var i = Number(s), len = Number(e);
           i < len + 1; i++) {
      arr.push(bVersions[i]);
    }

    return arr.join(' ');
  };

  return bible;
})();
