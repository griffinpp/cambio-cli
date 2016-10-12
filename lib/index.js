#!/usr/bin/env node


'use strict';

var _umzug = require('umzug');

var _umzug2 = _interopRequireDefault(_umzug);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _rhinozug = require('rhinozug');

var rz = _interopRequireWildcard(_rhinozug);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var umzug = new _umzug2.default({ storage: 'json' });

_commander2.default.version('0.1.4');
_commander2.default.command('create:migration [value]').description('create a new migration file, using an optional name and a timestamp. "unnamed" is used if no name is provided.').action(function (command) {
  rz.createMigration(command);
});

_commander2.default.command('up').description('run migrations up to the one specified, or up to the most recent if none is specified.').option('-c, --connection <conn>').option('-t, --to <to>').action(function (command) {
  rz.up(command.to, command.connection);
});

_commander2.default.command('down').description('revert migrations down to the one specified, or revert only the most recent if none is specified.').option('-c, --connection <conn>').option('-t, --to <to>').action(function (command) {
  rz.down(command.to, command.connection);
});

_commander2.default.command('list:m').description('list all migrations').option('-p, --pending <pend>', 'list only pending migrations').option('-e, --executed <exec>', 'list only executed migrations').option('-c, --connection <conn>').action(function (command) {
  if (command.pending) {
    rz.listPending(command.connection);
  } else if (command.executed) {
    rz.listExecuted(command.connection);
  } else {
    rz.listAll(command.connection);
  }
});

_commander2.default.command('list:s').description('list all seeds').option('-p, --pending <pend>', 'list only unapplied seeds').option('-e, --executed <exec>', 'list only applied seeds').option('-c, --connection <conn>').action(function (command) {
  if (command.pending) {
    rz.listPendingSeeds(command.connection);
  } else if (command.executed) {
    rz.listExecutedSeeds(command.connection);
  } else {
    rz.listAllSeeds(command.connection);
  }
});

_commander2.default.command('conns').description('list all available connections for use with the -c option in other commands').action(function (command) {
  rz.listConnections();
});

_commander2.default.command('create:conn').description('create a new connection file').action(function (command) {
  _prompt2.default.start();

  _prompt2.default.get([{
    name: 'name',
    type: 'string',
    description: 'Connection name',
    message: 'Connection name is required',
    required: true
  }, {
    name: 'host',
    type: 'string',
    description: 'Host address',
    message: 'Host address is required',
    required: true
  }, {
    name: 'port',
    type: 'integer',
    description: 'Host port',
    message: 'Host port must be a positive integer',
    default: 3306
  }, {
    name: 'database',
    type: 'string',
    description: 'Database name',
    message: 'Database name is required',
    required: true
  }, {
    name: 'aws',
    type: 'boolean',
    description: 'Is this an AWS database? (T/F)',
    message: 'This field is required, and must be either T or F',
    required: true
  }, {
    name: 'user',
    type: 'string',
    description: 'User name to log into the database',
    message: 'User name is required',
    required: true
  }, {
    name: 'password',
    type: 'string',
    description: 'Password',
    default: '',
    hidden: true,
    replace: '*'
  }, {
    name: 'pool',
    type: 'boolean',
    description: 'Pool connections? (T/F)',
    message: 'This field is required, and must be either T or F',
    default: true
  }, {
    name: 'poolMin',
    type: 'integer',
    description: 'Minimum pool size',
    ask: function ask() {
      return _prompt2.default.history('pool').value;
    },
    default: 2,
    required: false
  }, {
    name: 'poolMax',
    type: 'integer',
    description: 'Maximum pool size',
    ask: function ask() {
      return _prompt2.default.history('pool').value;
    },
    default: 10,
    required: false
  }], function (err, result) {
    rz.createConn(result);
  });
});

_commander2.default.command('create:seed [value]').description('create a new seed file, using an optional name and a timestamp.  "unnamed" is used if no name is provided').action(function (command) {
  rz.createSeed(command);
});

_commander2.default.command('create:model [name] [tableName]').description('create a new model file, with a name for the object, and the name of the table that it maps.').action(rz.createModel);

_commander2.default.command('seed').description('run a seed file').option('-c, --connection <conn>').option('-f, --file <file>').action(function (command) {
  rz.seed(command.file, command.connection);
});

_commander2.default.command('unseed').description('unseed a file').option('-c, --connection <conn>').option('-f, --file <file>').action(function (command) {
  rz.unseed(command.file, command.connection);
});

_commander2.default.command('init').description('set up files and folders needed to track migrations and seeds in a project').action(function () {
  rz.init();
});

_commander2.default.parse(process.argv);