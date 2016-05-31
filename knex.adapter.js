'use strict';

let Knex = require('knex');

let knex = {
  new(connection) {
    if(connection) {
      return Knex(connection);
    } else {
      throw new Error('a connection object (such as the one in config/default.js) is required.');
    }
  }
};

module.exports = knex;
