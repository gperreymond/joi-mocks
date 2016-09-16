'use strict';

var Joi = require('../lib');

// schema
var schema = Joi.object().keys({
  first: Joi.string().required().mock(Joi.Randomizers.chance.email()),
  second: Joi.string().required()
});

// options for mocks
var options = {
  onlyRequired: false
}

// randomize
Joi.mocks(schema).randomize(options);
