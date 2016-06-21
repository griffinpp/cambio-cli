'use strict';

import * as fileHelpers from './helpers/fileHelper';
import Umzug from 'Umzug';
import knex from './knex.adapter';

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
        console.log(`${num}: ${item.file}`);
        num += 1;
    });
}

export default {
    createMigration(name) {
        let migrationName = name ? name : 'unnamed';
        try {
            let filePath = fileHelpers.getMigrationFilePath(migrationName);
            fileHelpers.write(filePath, fileHelpers.getMigrationTemplate());
            console.log(`Migration ${filePath} created`);
        } catch (err) {
            console.error(`Error creating migration file: ${err}`);
        }
    },
    up(to) {
        try {
            if (to && to !== null) {
                migrationUmzug.up({to});
            } else {
                migrationUmzug.up();
            }
        } catch (err) {
            console.error(`Error running up migration(s): ${err}`);
        }
    },
    down(to) {
        try {
            if (to && to !== null) {
                migrationUmzug.down({to});
            } else {
                migrationUmzug.down();
            }
        } catch (err) {
            console.error(`Error running down migration(s): ${err}`);
        }
    },
    listExecuted() {
        migrationUmzug.executed()
            .then((list) => {
                console.log('Executed Migrations:');
                return list;
            })
            .then(printList)
            .then(() => {
                console.log('\n');
            });
    },
    listPending() {
        migrationUmzug.pending()
            .then((list) => {
                console.log('\nPending Migrations:');
                return list
            })
            .then(printList)
            .then(() => {
                console.log('\n');
            });
    },
    listAll() {
        migrationUmzug.executed()
            .then((list) => {
                console.log('Executed Migrations:');
                return list;
            })
            .then(printList)
            .then(() => {
                console.log('\nPending Migrations:');
            })
            .then(() => {
                return migrationUmzug.pending();
            })
            .then(printList)
            .then(() => {
                console.log('\n');
            });
    },
    createSeed(name) {
        let seedName = name ? name : 'unnamed';
        try {
            let filePath = fileHelpers.getSeedFilePath(seedName);
            fileHelpers.write(filePath, fileHelpers.getSeedTemplate());
            console.log(`Seed ${filePath} created`);
        } catch (err) {
            console.error(`Error creating seed file: ${err}`);
        }
    },
    seed() {
        try {
            seedUmzug.up();
        } catch (err) {
            console.error(`Error seeding the database: ${err}`);
        }
    },
    init() {
        try {
            let cDefault = fileHelpers.getInitFile('default.js');
            let mTemplate = fileHelpers.getInitFile('migrationTemplate.js');
            let sTemplate = fileHelpers.getInitFile('seedTemplate.js');

            fileHelpers.makeDir('config');
            fileHelpers.makeDir('migrations');
            fileHelpers.makeDir('seeds');

            fileHelpers.write(fileHelpers.getConfigFilePath('default.js'), cDefault);
            fileHelpers.write(fileHelpers.getConfigFilePath('migrationTemplate.js'), mTemplate);
            fileHelpers.write(fileHelpers.getConfigFilePath('seedTemplate.js'), sTemplate);

            // console.log(cDefault);
        } catch (err) {
            console.log(err);
        }
    },
    getConnection(config) {
        return knex.new(config);
    }
};
