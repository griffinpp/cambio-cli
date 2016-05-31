'use strict';

let fs = require('fs');
let moment = require('moment');
let path = require('path');

let helpers = {
    read(filePath) {
        return fs.readFileSync(filePath).toString();
    },
    write(targetPath, content) {
        fs.writeFileSync(targetPath, content);
    },
    makeDir(name) {
        fs.mkdirSync(`./${name}`);
    },
    getUmzugDir() {
        let p = process.cwd().split('/');
        let newP = [];
        let rgFound = false;
        p.map((dir) => {
            if (!rgFound) {
                newP.push(dir);
            }
            if (dir.toLowerCase() === 'rhinogram') {
                rgFound = true;
            }
        });
        newP.push('.umzug');
        return path.normalize(newP.join('/'));
    },
    getMigrationsPath() {
        return path.normalize('./migrations');
    },
    getSeedsPath() {
        return path.normalize('./seeds');
    },
    getInitPath() {
        let p = [
            __dirname,
            '..',
            'initFiles'
        ].join('/');
        return path.normalize(p);
    },
    getConfigPath() {
        return path.normalize('./config');
    },
    getConfigFilePath(filename) {
        let p = [
            this.getConfigPath(),
            filename
        ].join('/');
        return path.normalize(p);
    },
    getInitFile(filename) {
        let p = [
            this.getInitPath(),
            filename
        ].join('/');
        return this.read(p);
    },
    getMigrationsStoragePath() {
        return path.normalize('./migrations.json');
    },
    getSeedsStoragePath() {
        return path.normalize('./seeds.json');
    },
    getCreatedFileName(name) {
        return [
            moment().utc().format('YYYYMMDDHHmmss'),
            name
        ].join('-');
    },
    getCreatedFileExtension() {
        return 'js';
    },
    addFileExtension(name) {
        return [name, this.getCreatedFileExtension()].join('.');
    },
    getMigrationFilePath(name) {
        return [
            this.getMigrationsPath(),
            this.addFileExtension(this.getCreatedFileName(name))
        ].join('/');
    },
    getSeedFilePath(name) {
        return [
            this.getSeedsPath(),
            this.addFileExtension(this.getCreatedFileName(name))
        ].join('/');
    },
    getMigrationTemplateFilePath() {
        let p = [
            'config',
            'migrationTemplate.js'
        ].join('/');
        return path.normalize(p);
    },
    getSeedTemplateFilePath() {
        let p = [
            'config',
            'seedTemplate.js'
        ].join('/');
        return path.normalize(p);
    },
    getMigrationTemplate() {
        return this.read(this.getMigrationTemplateFilePath());
    },
    getSeedTemplate() {
        return this.read(this.getSeedTemplateFilePath());
    }
};

module.exports = helpers;
