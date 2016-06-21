'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fileHelper = require('./helpers/fileHelper');

var fileHelpers = _interopRequireWildcard(_fileHelper);

var _Umzug = require('Umzug');

var _Umzug2 = _interopRequireDefault(_Umzug);

var _knex = require('./knex.adapter');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var migrationUmzug = new _Umzug2.default({
    storage: 'json',
    storageOptions: {
        path: fileHelpers.getMigrationsStoragePath()
    },
    migrations: {
        path: fileHelpers.getMigrationsPath()
    }
});

var seedUmzug = new _Umzug2.default({
    storage: 'json',
    storageOptions: {
        path: fileHelpers.getSeedsStoragePath()
    },
    migrations: {
        path: fileHelpers.getSeedsPath()
    }

});

function printList(list) {
    var num = 1;
    list.map(function (item) {
        console.log(num + ': ' + item.file);
        num += 1;
    });
}

exports.default = {
    createMigration: function createMigration(name) {
        var migrationName = name ? name : 'unnamed';
        try {
            var filePath = fileHelpers.getMigrationFilePath(migrationName);
            fileHelpers.write(filePath, fileHelpers.getMigrationTemplate());
            console.log('Migration ' + filePath + ' created');
        } catch (err) {
            console.error('Error creating migration file: ' + err);
        }
    },
    up: function up(to) {
        try {
            if (to && to !== null) {
                migrationUmzug.up({ to: to });
            } else {
                migrationUmzug.up();
            }
        } catch (err) {
            console.error('Error running up migration(s): ' + err);
        }
    },
    down: function down(to) {
        try {
            if (to && to !== null) {
                migrationUmzug.down({ to: to });
            } else {
                migrationUmzug.down();
            }
        } catch (err) {
            console.error('Error running down migration(s): ' + err);
        }
    },
    listExecuted: function listExecuted() {
        migrationUmzug.executed().then(function (list) {
            console.log('Executed Migrations:');
            return list;
        }).then(printList).then(function () {
            console.log('\n');
        });
    },
    listPending: function listPending() {
        migrationUmzug.pending().then(function (list) {
            console.log('\nPending Migrations:');
            return list;
        }).then(printList).then(function () {
            console.log('\n');
        });
    },
    listAll: function listAll() {
        migrationUmzug.executed().then(function (list) {
            console.log('Executed Migrations:');
            return list;
        }).then(printList).then(function () {
            console.log('\nPending Migrations:');
        }).then(function () {
            return migrationUmzug.pending();
        }).then(printList).then(function () {
            console.log('\n');
        });
    },
    createSeed: function createSeed(name) {
        var seedName = name ? name : 'unnamed';
        try {
            var filePath = fileHelpers.getSeedFilePath(seedName);
            fileHelpers.write(filePath, fileHelpers.getSeedTemplate());
            console.log('Seed ' + filePath + ' created');
        } catch (err) {
            console.error('Error creating seed file: ' + err);
        }
    },
    seed: function seed() {
        try {
            seedUmzug.up();
        } catch (err) {
            console.error('Error seeding the database: ' + err);
        }
    },
    init: function init() {
        try {
            var cDefault = fileHelpers.getInitFile('default.js');
            var mTemplate = fileHelpers.getInitFile('migrationTemplate.js');
            var sTemplate = fileHelpers.getInitFile('seedTemplate.js');

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
    getConnection: function getConnection(config) {
        return _knex2.default.new(config);
    }
};