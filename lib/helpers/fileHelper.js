'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = read;
exports.write = write;
exports.makeDir = makeDir;
exports.getMigrationsPath = getMigrationsPath;
exports.getSeedsPath = getSeedsPath;
exports.getModelsPath = getModelsPath;
exports.getInitPath = getInitPath;
exports.getConfigPath = getConfigPath;
exports.getConfigFilePath = getConfigFilePath;
exports.getInitFile = getInitFile;
exports.getMigrationsStoragePath = getMigrationsStoragePath;
exports.getSeedsStoragePath = getSeedsStoragePath;
exports.getCreatedFileName = getCreatedFileName;
exports.getModelFileName = getModelFileName;
exports.getCreatedFileExtension = getCreatedFileExtension;
exports.addFileExtension = addFileExtension;
exports.getMigrationFilePath = getMigrationFilePath;
exports.getSeedFilePath = getSeedFilePath;
exports.getModelFilePath = getModelFilePath;
exports.getMigrationTemplateFilePath = getMigrationTemplateFilePath;
exports.getSeedTemplateFilePath = getSeedTemplateFilePath;
exports.getModelTemplateFilePath = getModelTemplateFilePath;
exports.getMigrationTemplate = getMigrationTemplate;
exports.getModelTemplate = getModelTemplate;
exports.getSeedTemplate = getSeedTemplate;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('./logger');

var logger = _interopRequireWildcard(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function read(filePath) {
  try {
    return _fs2.default.readFileSync(filePath).toString();
  } catch (err) {
    logger.error('Error reading file: ' + err);
  }
}

function write(targetPath, content) {
  try {
    _fs2.default.writeFileSync(targetPath, content);
    logger.log('Created file: ' + targetPath);
  } catch (err) {
    logger.error('Error creating file ' + targetPath + ': ' + err);
  }
}

function makeDir(name) {
  try {
    _fs2.default.mkdirSync('./' + name);
    logger.log('Created directory: ' + name);
  } catch (err) {
    logger.error('Error creating directory: ' + err);
  }
}

function getMigrationsPath() {
  return _path2.default.normalize('./migrations');
}

function getSeedsPath() {
  return _path2.default.normalize('./seeds');
}

function getModelsPath() {
  return _path2.default.normalize('./models');
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

function getModelFileName(name) {
  return [name, 'model'].join('.');
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

function getModelFilePath(name) {
  return [this.getModelsPath(), this.addFileExtension(this.getModelFileName(name))].join('/');
}

function getMigrationTemplateFilePath() {
  var p = [getConfigPath(), 'migrationTemplate.js'].join('/');
  return _path2.default.normalize(p);
}

function getSeedTemplateFilePath() {
  var p = [getConfigPath(), 'seedTemplate.js'].join('/');
  return _path2.default.normalize(p);
}

function getModelTemplateFilePath() {
  var p = [getConfigPath(), 'model.template'].join('/');
  return _path2.default.normalize(p);
}

function getMigrationTemplate() {
  return this.read(this.getMigrationTemplateFilePath());
}

function getModelTemplate() {
  return this.read(this.getModelTemplateFilePath());
}

function getSeedTemplate() {
  return this.read(this.getSeedTemplateFilePath());
}