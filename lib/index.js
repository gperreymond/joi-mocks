'use strict';

var Faker = require('faker');
var Chance = require('chance');
var RandExp = require('randexp');

var Joi = require('./joi');

// Declare internals

var internals = {};

// Randomizers

internals.faker = Faker;
internals.chance = new Chance();;
internals.randexp = function (expression) {
  return new RandExp(expression).gen();
}

// Exports

module.exports = Joi;

module.exports.Randomizers = {
  faker: internals.faker,
  chance: internals.chance,
  randexp: internals.randexp
}
