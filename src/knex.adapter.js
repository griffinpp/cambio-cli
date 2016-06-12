'use strict';

import Knex from 'knex';

export default {
  new(connection) {
    if(connection) {
      return Knex(connection);
    } else {
      throw new Error('a connection object (such as the one in config/default.js) is required.');
    }
  }
};
