#!/usr/bin/env node

'use strict';

import Umzug from 'umzug';
import commander from 'commander';
import rz from './rhinozug';


let umzug = new Umzug({storage: 'json'});

commander.version('0.0.1');
commander.command('create:migration [value]')
    .description('create a new migration file, using an optional name and a timestamp. "unnamed" is used if no name is provided.')
    .action((command) => {
        // console.log(command);
        rz.createMigration(command);
    });

commander.command('up [value]')
    .description('run migrations up to the one specified, or up to the most recent if none is specified.')
    .action((command) => {
        rz.up(command);
    });

commander.command('down [value]')
    .description('revert migrations down to the one specified, or revert only the most recent if none is specified.')
    .action((command) => {
        rz.down(command);
    });

commander.command('list')
    .description('list all migrations')
    .option('-p, --pending', 'list only pending migrations')
    .option('-e, --executed', 'list only executed migrations')
    .action((command) => {
        if (command.pending) {
            rz.listPending();
        } else if (command.executed) {
            rz.listExecuted();
        } else {
            rz.listAll();
        }
    });

commander.command('create:seed [value]')
    .description('create a new seed file, using an optional name and a timestamp.  "unnamed" is used if no name is provided')
    .action((command) => {
        rz.createSeed(command);
    });

commander.command('seed')
    .description('run all seed files in alphabetical order')
    .action(() => {
        rz.seed();
    });

commander.command('init')
    .description('set up files and folders needed to track migrations and seeds in a project')
    .action(() => {
        rz.init();
    });

commander.parse(process.argv);
