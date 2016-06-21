'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.read = read;
exports.write = write;
exports.makeDir = makeDir;
exports.getMigrationsPath = getMigrationsPath;
exports.getSeedsPath = getSeedsPath;
exports.getInitPath = getInitPath;
exports.getConfigPath = getConfigPath;
exports.getConfigFilePath = getConfigFilePath;
exports.getInitFile = getInitFile;
exports.getMigrationsStoragePath = getMigrationsStoragePath;
exports.getSeedsStoragePath = getSeedsStoragePath;
exports.getCreatedFileName = getCreatedFileName;
exports.getCreatedFileExtension = getCreatedFileExtension;
exports.addFileExtension = addFileExtension;
exports.getMigrationFilePath = getMigrationFilePath;
exports.getSeedFilePath = getSeedFilePath;
exports.getMigrationTemplateFilePath = getMigrationTemplateFilePath;
exports.getSeedTemplateFilePath = getSeedTemplateFilePath;
exports.getMigrationTemplate = getMigrationTemplate;
exports.getSeedTemplate = getSeedTemplate;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function read(filePath) {
    return _fs2.default.readFileSync(filePath).toString();
}

function write(targetPath, content) {
    _fs2.default.writeFileSync(targetPath, content);
}

function makeDir(name) {
    _fs2.default.mkdirSync('./' + name);
}

function getMigrationsPath() {
    return _path2.default.normalize('./migrations');
}

function getSeedsPath() {
    return _path2.default.normalize('./seeds');
}

function getInitPath() {
    var p = [__dirname, '..', 'initFiles'].join('/');
    return _path2.default.normalize(p);
}

function getConfigPath() {
    return _path2.default.normalize('./config');
}

function getConfigFilePath(filename) {
    var p = [this.getConfigPath(), filename].join('/');
    return _path2.default.normalize(p);
}

function getInitFile(filename) {
    var p = [this.getInitPath(), filename].join('/');
    return this.read(p);
}

function getMigrationsStoragePath() {
    return _path2.default.normalize('./migrations.json');
}

function getSeedsStoragePath() {
    return _path2.default.normalize('./seeds.json');
}

function getCreatedFileName(name) {
    return [(0, _moment2.default)().utc().format('YYYYMMDDHHmmss'), name].join('-');
}

function getCreatedFileExtension() {
    return 'js';
}

function addFileExtension(name) {
    return [name, this.getCreatedFileExtension()].join('.');
}

function getMigrationFilePath(name) {
    return [this.getMigrationsPath(), this.addFileExtension(this.getCreatedFileName(name))].join('/');
}

function getSeedFilePath(name) {
    return [this.getSeedsPath(), this.addFileExtension(this.getCreatedFileName(name))].join('/');
}

function getMigrationTemplateFilePath() {
    var p = [getConfigPath(), 'migrationTemplate.js'].join('/');
    return _path2.default.normalize(p);
}

function getSeedTemplateFilePath() {
    var p = [getConfigPath(), 'seedTemplate.js'].join('/');
    return _path2.default.normalize(p);
}

function getMigrationTemplate() {
    return this.read(this.getMigrationTemplateFilePath());
}

function getSeedTemplate() {
    return this.read(this.getSeedTemplateFilePath());
}