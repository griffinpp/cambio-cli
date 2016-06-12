'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    read: function read(filePath) {
        return _fs2.default.readFileSync(filePath).toString();
    },
    write: function write(targetPath, content) {
        _fs2.default.writeFileSync(targetPath, content);
    },
    makeDir: function makeDir(name) {
        _fs2.default.mkdirSync('./' + name);
    },
    getUmzugDir: function getUmzugDir() {
        var p = process.cwd().split('/');
        var newP = [];
        var rgFound = false;
        p.map(function (dir) {
            if (!rgFound) {
                newP.push(dir);
            }
            if (dir.toLowerCase() === 'rhinogram') {
                rgFound = true;
            }
        });
        newP.push('.umzug');
        return _path2.default.normalize(newP.join('/'));
    },
    getMigrationsPath: function getMigrationsPath() {
        return _path2.default.normalize('./migrations');
    },
    getSeedsPath: function getSeedsPath() {
        return _path2.default.normalize('./seeds');
    },
    getInitPath: function getInitPath() {
        var p = [__dirname, '..', 'initFiles'].join('/');
        return _path2.default.normalize(p);
    },
    getConfigPath: function getConfigPath() {
        return _path2.default.normalize('./config');
    },
    getConfigFilePath: function getConfigFilePath(filename) {
        var p = [this.getConfigPath(), filename].join('/');
        return _path2.default.normalize(p);
    },
    getInitFile: function getInitFile(filename) {
        var p = [this.getInitPath(), filename].join('/');
        return this.read(p);
    },
    getMigrationsStoragePath: function getMigrationsStoragePath() {
        return _path2.default.normalize('./migrations.json');
    },
    getSeedsStoragePath: function getSeedsStoragePath() {
        return _path2.default.normalize('./seeds.json');
    },
    getCreatedFileName: function getCreatedFileName(name) {
        return [(0, _moment2.default)().utc().format('YYYYMMDDHHmmss'), name].join('-');
    },
    getCreatedFileExtension: function getCreatedFileExtension() {
        return 'js';
    },
    addFileExtension: function addFileExtension(name) {
        return [name, this.getCreatedFileExtension()].join('.');
    },
    getMigrationFilePath: function getMigrationFilePath(name) {
        return [this.getMigrationsPath(), this.addFileExtension(this.getCreatedFileName(name))].join('/');
    },
    getSeedFilePath: function getSeedFilePath(name) {
        return [this.getSeedsPath(), this.addFileExtension(this.getCreatedFileName(name))].join('/');
    },
    getMigrationTemplateFilePath: function getMigrationTemplateFilePath() {
        var p = ['config', 'migrationTemplate.js'].join('/');
        return _path2.default.normalize(p);
    },
    getSeedTemplateFilePath: function getSeedTemplateFilePath() {
        var p = ['config', 'seedTemplate.js'].join('/');
        return _path2.default.normalize(p);
    },
    getMigrationTemplate: function getMigrationTemplate() {
        return this.read(this.getMigrationTemplateFilePath());
    },
    getSeedTemplate: function getSeedTemplate() {
        return this.read(this.getSeedTemplateFilePath());
    }
};