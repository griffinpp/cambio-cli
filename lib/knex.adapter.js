'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  new: function _new(connection) {
    if (connection) {
      return (0, _knex2.default)(connection);
    } else {
      throw new Error('a connection object (such as the one in config/default.js) is required.');
    }
  }
};