'use strict';

import * as fileHelpers from './helpers/fileHelper';
import Umzug from 'Umzug';
import * as logger from './helpers/logger';
import cp from 'child_process';

let migrationUmzug = new Umzug({
  storage: 'json',
  storageOptions: {
    path: fileHelpers.getMigrationsStoragePath()
  },
  migrations: {
    path: fileHelpers.getMigrationsPath()
  }
});

let seedUmzug = new Umzug({
  storage: 'json',
  storageOptions: {
    path: fileHelpers.getSeedsStoragePath()
  },
  migrations: {
    path: fileHelpers.getSeedsPath()
  }

});

function printList(list) {
  let num = 1;
  list.map((item) => {
    logger.log(`${num}: ${item.file}`);
    num += 1;
  });
}

export function createMigration(name) {
  let migrationName = name ? name : 'unnamed';
  try {
    let filePath = fileHelpers.getMigrationFilePath(migrationName);
    fileHelpers.write(filePath, fileHelpers.getMigrationTemplate());
    logger.log(`Migration ${filePath} created`);
  } catch (err) {
    logger.error(`Error creating migration file: ${err}`);
  }
}

export function up(to) {
  return Promise.resolve()
    .then(() => {
      if (to && to !== null) {
        return migrationUmzug.up({to})
          .then(() => {
            logger.log(`Migrations up to ${to} complete`);    
          });
      } else {
        return migrationUmzug.up()
          .then(() => {
            logger.log(`All migrations complete`);
          });
      }
    })
    .catch((err) => {
      logger.error(`Error running up migration(s): ${err}`); 
    });
}

export function down(to) {
  return Promise.resolve()
    .then(() => {
      if (to && to !== null) {
        return migrationUmzug.down({to})
          .then(() => {
            logger.log(`Migrations down to ${to} complete`);      
          });        
      } else {
        return migrationUmzug.down()
          .then(() => {
             logger.log(`Latest migration down complete`); 
          });
      }
    })
    .catch((err) => {
      logger.error(`Error running down migration(s): ${err}`);
    });
}

export function listExecuted() {
  migrationUmzug.executed()
    .then((list) => {
      logger.log('Executed Migrations:');
      return list;
    })
    .then(printList)
    .then(() => {
      logger.log('\n');
    });
}

export function listPending() {
  migrationUmzug.pending()
    .then((list) => {
      logger.log('\nPending Migrations:');
      return list
    })
    .then(printList)
    .then(() => {
      logger.log('\n');
    });
}

export function listAll() {
  migrationUmzug.executed()
    .then((list) => {
      logger.log('Executed Migrations:');
      return list;
    })
    .then(printList)
    .then(() => {
      logger.log('\nPending Migrations:');
    })
    .then(() => {
      return migrationUmzug.pending();
    })
    .then(printList)
    .then(() => {
      logger.log('\n');
    });
}
export function createSeed(name) {
  let seedName = name ? name : 'unnamed';
  try {
    let filePath = fileHelpers.getSeedFilePath(seedName);
    fileHelpers.write(filePath, fileHelpers.getSeedTemplate());
    logger.log(`Seed ${filePath} created`);
  } catch (err) {
    logger.error(`Error creating seed file: ${err}`);
  }
}

export function createModel(name, tableName) {
  try {
    let filePath = fileHelpers.getModelFilePath(name);
    let templateText = fileHelpers.getModelTemplate();

    templateText = replace(templateText, '<#modelName>', name);
    templateText = replace(templateText, '<#tableName>', tableName);

    fileHelpers.write(filePath, templateText);
  } catch (err) {
    logger.error(`Error creating model file: ${err}`);
  }
}

export function seed() {
  return seedUmzug.up()
    .then(() => {
      logger.log(`All seed files successfully run`);
    })
    .catch((err) => {
      logger.error(`Error seeding the database: ${err}`);
    });
}

export function init() {
  try {
    let cDefault = fileHelpers.getInitFile('default.connection');
    let mTemplate = fileHelpers.getInitFile('migration.template');
    let sTemplate = fileHelpers.getInitFile('seed.template');
    let modelTemplate = fileHelpers.getInitFile('model.template');

    fileHelpers.makeDir('config');
    fileHelpers.makeDir('migrations');
    fileHelpers.makeDir('seeds');
    fileHelpers.makeDir('models');

    fileHelpers.write(fileHelpers.getConfigFilePath('default.js'), cDefault);
    fileHelpers.write(fileHelpers.getConfigFilePath('migrationTemplate.js'), mTemplate);
    fileHelpers.write(fileHelpers.getConfigFilePath('seedTemplate.js'), sTemplate)
    fileHelpers.write(fileHelpers.getConfigFilePath('model.template'), modelTemplate);

    logger.log(`Rhinozug successfully initialized in this directory`);
    logger.log('Installing Rhinozug as a local dependency.  Please wait...');

    // install the local database adapter
    cp.exec('npm install --save rhinozug', (error, stdout, stderr) => {
      if (error) {
        logger.error('Could not install Rhinozug as a local dependency.  Please run "npm install rhinozug -S"');
      } else {
        logger.log('Rhinozug installed as a local dependency');
      }
    });
  } catch (err) {
    logger.error(`Error initializing Rhinozug: ${err}`);
  }
}

function replace(string, find, replace) {
  return string.split(find).join(replace);
}
