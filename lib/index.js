#!/usr/bin/env node


'use strict';

var _umzug = require('umzug');

var _umzug2 = _interopRequireDefault(_umzug);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _rhinozug = require('./rhinozug');

var _rhinozug2 = _interopRequireDefault(_rhinozug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var umzug = new _umzug2.default({ storage: 'json' });

_commander2.default.version('0.0.1');
_commander2.default.command('create:migration [value]').description('create a new migration file, using an optional name and a timestamp. "unnamed" is used if no name is provided.').action(function (command) {
    // console.log(command);
    _rhinozug2.default.createMigration(command);
});

_commander2.default.command('up [value]').description('run migrations up to the one specified, or up to the most recent if none is specified.').action(function (command) {
    _rhinozug2.default.up(command);
});

_commander2.default.command('down [value]').description('revert migrations down to the one specified, or revert only the most recent if none is specified.').action(function (command) {
    _rhinozug2.default.down(command);
});

_commander2.default.command('list').description('list all migrations').option('-p, --pending', 'list only pending migrations').option('-e, --executed', 'list only executed migrations').action(function (command) {
    if (command.pending) {
        _rhinozug2.default.listPending();
    } else if (command.executed) {
        _rhinozug2.default.listExecuted();
    } else {
        _rhinozug2.default.listAll();
    }
});

_commander2.default.command('create:seed [value]').description('create a new seed file, using an optional name and a timestamp.  "unnamed" is used if no name is provided').action(function (command) {
    _rhinozug2.default.createSeed(command);
});

_commander2.default.command('seed').description('run all seed files in alphabetical order').action(function () {
    _rhinozug2.default.seed();
});

_commander2.default.command('init').description('set up files and folders needed to track migrations and seeds in a project').action(function () {
    _rhinozug2.default.init();
});

_commander2.default.parse(process.argv);