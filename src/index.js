#!/usr/bin/env node

'use strict';

import Umzug from 'umzug';
import commander from 'commander';
import * as rz from './rhinozug';


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

commander.command('list')
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

commander.command('conns')
  .description('list all available connections for use with the -c option in other commands')
  .action((command) => {
     rz.listConnections();
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
  .description('run all seed files in alphabetical order')
  .option('-c, --connection <conn>')
  .action((command) => {
    rz.seed(command.connection);
  });

commander.command('unseed')
  .description('unseed the latest seed file')
  .option('-c, --connection <conn>')
  .action((command) => {
    rz.unseed(command.connection);
  });

commander.command('init')
  .description('set up files and folders needed to track migrations and seeds in a project')
  .action(() => {
    rz.init();
  });

commander.parse(process.argv);
