var test = require('blue-tape');
var bible = require('../');

test('get', function (t) {
  t.plan(7);

  bible.get('John 11:35').then(function (res) {
    t.equal(res.text, 'Jesus wept.');
    t.equal(res.passage, 'John.11.35');
  });

  bible.get('John11:35').then(function (res) {
    t.equal(res.text, 'Jesus wept.');
    t.equal(res.passage, 'John.11.35');
  });

  bible.get('Jn11:35').then(function (res) {
    t.equal(res.text, 'Jesus wept.');
  });

  bible.get('John 11:35-36').then(function (res) {
    t.equal(res.text, 'Jesus wept. The Jews therefore said, Behold how he loved him!');
  });

  bible.get('Jn 11:57-12:1').then(function (res) {
    t.equal(res.text, 'Now the chief priests and the Pharisees had given ' +
                 'commandment, that, if any man knew where he was, he ' +
                 'should show it, that they might take him. Jesus therefore ' +
                 'six days before the passover came to Bethany, where ' +
                 'Lazarus was, whom Jesus raised from the dead.');
  });
});