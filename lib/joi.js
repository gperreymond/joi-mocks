'use strict';

var Joi = require('joi');
var Hoek = require('hoek');

var populate = require('./populate');
var randomize = require('./randomize');

// Declare internals

var internals = {};

internals.options = {
  onlyRequired: false
}

internals.generate = function (schema, params) {
  if (params) {
    params = Hoek.applyToDefaults(internals.options, params);
  } else {
    params = internals.options;
  }
  return new Promise(function (resolve, reject) {
    try {
      var describe = Joi.compile(schema).describe();
      resolve(populate(describe, params));
    } catch (e) {
      reject(e);
    }
  })
}

// Joi extended

Joi.mocks = function(schema) {
  var obj = this.clone();
  obj.__schema = schema;
  obj.randomize = function(options) {
    internals.generate(obj.__schema, options)
      .then(function(result) {
        console.log(result);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  return obj;
}

Joi.addMethodMock = function (from) {
  var joi = this;
  var base = this[from]().clone();
  var ctor = base.constructor;
  var type = class extends ctor {
    constructor() {
      super();
      this._mock = '';
    };
    describe() {
      if (!this._mock) {
        return super.describe();
      }
      var description = super.describe();
      description.mock = this._mock;
      return description;
    };
    mock(value) {
      var obj = this.clone();
      obj._mock = value;
      return obj;
    };
  }
  var instance = new type();
  joi[from] = function () {
    return instance;
  };
  return joi;
}

Joi
  .addMethodMock('any')
  .addMethodMock('number')
  .addMethodMock('date')
  .addMethodMock('array')
  .addMethodMock('string');

delete Joi.addMethodMock;

// Exports

module.exports = Joi;
