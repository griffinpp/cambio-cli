'use strict';

/* See: http://knexjs.org/#Schema-Building
for documentation of the schema building api in use */

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rhinozug = require('rhinozug');

var _rhinozug2 = _interopRequireDefault(_rhinozug);

var _default = require('../config/default.js');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    up: function up() {
        // rz.getConnection() returns a knex object
        var connection = _rhinozug2.default.getConnection(_default2.default);
        /*
        Add data insertion commands here.
        Return a promise to correctly handle asynchronicity.
         Example that inserts three rows into the 'User' table created in the migration template:
        return Promise.all([
            connection('User').insert({id: 1, name: 'Aaron', address1: '123 anystreet'}),
            connection('User').insert({id: 2, name: 'Bobby', address1: '456 otherstreet'}),
            connection('User').insert({id: 3, name: 'Chuck', address1: '789 thisstreet'})
        ])
        .then(() => {
            // always destory the connection when you are done, regardless of outcome
            connection.destroy();
        }).catch((err) => {
            connection.destroy();
        });
        */
    },
    // seeds only run up for now, but making them downable is not inconceivable
    down: function down() {}
};