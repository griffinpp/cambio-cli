'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fileHelper = require('./helpers/fileHelper');

var _fileHelper2 = _interopRequireDefault(_fileHelper);

var _Umzug = require('Umzug');

var _Umzug2 = _interopRequireDefault(_Umzug);

var _knex = require('./knex.adapter');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var migrationUmzug = new _Umzug2.default({
    storage: 'json',
    storageOptions: {
        path: _fileHelper2.default.getMigrationsStoragePath()
    },
    migrations: {
        path: _fileHelper2.default.getMigrationsPath()
    }
});

var seedUmzug = new _Umzug2.default({
    storage: 'json',
    storageOptions: {
        path: _fileHelper2.default.getSeedsStoragePath()
    },
    migrations: {
        path: _fileHelper2.default.getSeedsPath()
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
            var filePath = _fileHelper2.default.getMigrationFilePath(migrationName);
            _fileHelper2.default.write(filePath, _fileHelper2.default.getMigrationTemplate());
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
            var filePath = _fileHelper2.default.getSeedFilePath(seedName);
            _fileHelper2.default.write(filePath, _fileHelper2.default.getSeedTemplate());
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
            var cDefault = _fileHelper2.default.getInitFile('default.js');
            var mTemplate = _fileHelper2.default.getInitFile('migrationTemplate.js');
            var sTemplate = _fileHelper2.default.getInitFile('seedTemplate.js');

            _fileHelper2.default.makeDir('config');
            _fileHelper2.default.makeDir('migrations');
            _fileHelper2.default.makeDir('seeds');

            _fileHelper2.default.write(_fileHelper2.default.getConfigFilePath('default.js'), cDefault);
            _fileHelper2.default.write(_fileHelper2.default.getConfigFilePath('migrationTemplate.js'), mTemplate);
            _fileHelper2.default.write(_fileHelper2.default.getConfigFilePath('seedTemplate.js'), sTemplate);

            // console.log(cDefault);
        } catch (err) {
            console.log(err);
        }
    },
    getConnection: function getConnection(config) {
        return _knex2.default.new(config);
    }
};