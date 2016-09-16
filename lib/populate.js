'use strict';

var _ = require('lodash');

var Joi = require('./../lib');

// Declare internals

var internals = {};

internals.populate = function (property, params) {
  var result = {};
  if (property.type === 'object') {
    var children = Object.keys(property.children);
    _.map(children, function (key) {
      var child = property.children[key];
      var jump = false;
      if (params.onlyRequired && child.flags && child.flags.presence !== 'required') {
        jump = true;
      }
      if (jump === false) {
        switch (child.type) {
        case 'array':
          result[key] = [];
          if (!child.items) {
            result[key] = Joi.mocks(child).generate(params);
          } else {
            var arrayItem = child.items[0];
            result[key] = [];
            for (var i = 0; i < Joi.Randomizers.chance.d4(); i++) {
              result[key].push(Joi.mocks(arrayItem).generate(params));
            }
          }
          break;
        case 'object':
          result[key] = internals.populate(child, params);
          break;
        default:
          result[key] = Joi.mocks(child).generate(params);
          break;
        }
      }
    });
    return result;
  }
}

module.exports = internals.populate;
