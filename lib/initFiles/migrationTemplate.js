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
        Add altering commands here.
        Return a promise to correctly handle asynchronicity.
         Example that creates two tables with a fk between them:
        return connection.schema.createTableIfNotExists('User', (table) => {
            table.increments('id');
            table.string('name');
            table.string('address1');
        }).createTableIfNotExists('Phone', (table) => {
            table.increments('id');
            table.integer('personId').unsigned().references('User.id');
            table.string('number');
        }).catch((err) => {
            console.error(err);
        // because knex objects return bluebird promises, we can use .finally here
        }).finally(() => {
            // always destory the connection when you are done, regardless of outcome
            connection.destroy();
        });
        */
    },

    down: function down() {
        var connection = _rhinozug2.default.getConnection(_default2.default);
        /*
        Add reverting commands here.
        Return a promise to correctly handle asynchronicity.
         Example that undoes the commands above:
        return connection.schema.dropTable('Phone')
            .dropTable('User')
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                // always destroy the connection when you are done, regardless of outcome
                connection.destroy();
            });
        */
    }
};