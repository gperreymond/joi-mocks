'use strict';

var populate = require('./populate');

var randomize = function (source, params) {
  var result = null;
  var chance = new Chance();
  // fixed mock or not ?
  if (source.mock) {
    return source.mock;
  }
  switch (source.type) {
  case 'array':
    result = chance.pickset(['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'], chance.d6());
    break;
  case 'string':
    result = chance.sentence({
      words: 3
    });
    if (source.rules) {
      // rules
      var uriEnable = _.findIndex(source.rules, function (o) {
        return o.name === 'uri';
      }) !== -1
      var guidEnable = _.findIndex(source.rules, function (o) {
        return o.name === 'guid';
      }) !== -1
      var emailEnable = _.findIndex(source.rules, function (o) {
        return o.name === 'email';
      }) !== -1
      var regexEnableIndex = _.findIndex(source.rules, function (o) {
        return o.name === 'regex';
      })
      var regexEnable = regexEnableIndex !== -1;
      // randomize
      if (uriEnable) {
        result = chance.url({
          domain: 'mock.viadeo.com'
        });
      }
      if (regexEnable) {
        result = new RandExp(source.rules[regexEnableIndex].arg).gen();
      }
      if (guidEnable) {
        result = chance.guid();
      }
      if (emailEnable) {
        result = chance.email({
          domain: 'mockviadeo.com'
        })
      }
    }
    if (source.valids) {
      result = chance.pickset(source.valids, 1)[0];
    }
    break;
  case 'date':
    result = chance.birthday({
      string: true,
      american: false
    });
    if (source.flags && source.flags.timestamp) {
      result = chance.timestamp();
    }
    break;
  case 'number':
    result = chance.integer();
    break;
  case 'boolean':
    result = chance.bool();
    break;
  case 'object':
    result = populate(source, params);
    break;
  default:
    result = 'mock::' + source.type;
    break;
  }
  return result;
}
