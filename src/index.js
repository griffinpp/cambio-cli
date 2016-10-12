#!/usr/bin/env node

'use strict';

import Umzug from 'umzug';
import commander from 'commander';
import prompt from 'prompt';
import * as rz from 'rhinozug';

console.log(rz);

let umzug = new Umzug({storage: 'json'});

commander.version('0.0.1');
commander.command('create:migration [value]')
  .description('create a new migration file, using an optional name and a timestamp. "unnamed" is used if no name is provided.')
  .action((command) => {
    rz.createMigration(command);
  });

commander.command('up')
  .description('run migrations up to the one specified, or up to the most recent if none is specified.')
  .option('-c, --connection <conn>')
  .option('-t, --to <to>')
  .action((command) => {
    rz.up(command.to, command.connection);
  });

commander.command('down')
  .description('revert migrations down to the one specified, or revert only the most recent if none is specified.')
  .option('-c, --connection <conn>')
  .option('-t, --to <to>')
  .action((command) => {
    rz.down(command.to, command.connection);
  });

commander.command('list:m')
  .description('list all migrations')
  .option('-p, --pending <pend>', 'list only pending migrations')
  .option('-e, --executed <exec>', 'list only executed migrations')
  .option('-c, --connection <conn>')
  .action((command) => {
    if (command.pending) {
      rz.listPending(command.connection);
    } else if (command.executed) {
      rz.listExecuted(command.connection);
    } else {
      rz.listAll(command.connection);
    }
  });

commander.command('list:s')
  .description('list all seeds')
  .option('-p, --pending <pend>', 'list only unapplied seeds')
  .option('-e, --executed <exec>', 'list only applied seeds')
  .option('-c, --connection <conn>')
  .action((command) => {
    if (command.pending) {
      rz.listPendingSeeds(command.connection);
    } else if (command.executed) {
      rz.listExecutedSeeds(command.connection);
    } else {
      rz.listAllSeeds(command.connection);
    }
  })

commander.command('conns')
  .description('list all available connections for use with the -c option in other commands')
  .action((command) => {
    rz.listConnections();
  });

commander.command('create:conn')
  .description('create a new connection file')
  .action((command) => {
    prompt.start();

    prompt.get([
    {
      name: 'name',
      type: 'string',
      description: 'Connection name',
      message: 'Connection name is required',
      required: true
    },
    {
      name: 'host',
      type: 'string',
      description: 'Host address',
      message: 'Host address is required',
      required: true
    },
    {
      name: 'port',
      type: 'integer',
      description: 'Host port',
      message: 'Host port must be a positive integer',
      default: 3306
    },
    {
      name: 'database',
      type: 'string',
      description: 'Database name',
      message: 'Database name is required',
      required: true
    },
    {
      name: 'aws',
      type: 'boolean',
      description: 'Is this an AWS database? (T/F)',
      message: 'This field is required, and must be either T or F',
      required: true
    },
    {
      name: 'user',
      type: 'string',
      description: 'User name to log into the database',
      message: 'User name is required',
      required: true
    },
    {
      name: 'password',
      type: 'string',
      description: 'Password',
      default: '',
      hidden: true,
      replace: '*',
    },
    {
      name: 'pool',
      type: 'boolean',
      description: 'Pool connections? (T/F)',
      message: 'This field is required, and must be either T or F',
      default: true,
    },
    {
      name: 'poolMin',
      type: 'integer',
      description: 'Minimum pool size',
      ask: () => {
        return prompt.history('pool').value;
      },
      default: 2,
      required: false
    },
    {
      name: 'poolMax',
      type: 'integer',
      description: 'Maximum pool size',
      ask: () => {
        return prompt.history('pool').value;
      },
      default: 10,
      required: false
    }
    ], (err, result) => {
      rz.createConn(result);
    });
  });

commander.command('create:seed [value]')
  .description('create a new seed file, using an optional name and a timestamp.  "unnamed" is used if no name is provided')
  .action((command) => {
    rz.createSeed(command);
  });

commander.command('create:model [name] [tableName]')
  .description('create a new model file, with a name for the object, and the name of the table that it maps.')
  .action(rz.createModel);

commander.command('seed')
  .description('run a seed file')
  .option('-c, --connection <conn>')
  .option('-f, --file <file>')
  .action((command) => {
    rz.seed(command.file, command.connection);
  });

commander.command('unseed')
  .description('unseed a file')
  .option('-c, --connection <conn>')
  .option('-f, --file <file>')
  .action((command) => {
    rz.unseed(command.file, command.connection);
  });

commander.command('init')
  .description('set up files and folders needed to track migrations and seeds in a project')
  .action(() => {
    rz.init();
  });

commander.parse(process.argv);
