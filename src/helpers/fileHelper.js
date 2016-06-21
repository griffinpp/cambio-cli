'use strict';

import fs from 'fs';
import moment from 'moment';
import path from 'path';

export function read(filePath) {
        return fs.readFileSync(filePath).toString();
    }

export function write(targetPath, content) {
        fs.writeFileSync(targetPath, content);
    }

export function makeDir(name) {
        fs.mkdirSync(`./${name}`);
    }

export function getMigrationsPath() {
        return path.normalize('./migrations');
    }

export function getSeedsPath() {
        return path.normalize('./seeds');
    }

export function getInitPath() {
        let p = [
            __dirname,
            '..',
            'initFiles'
        ].join('/');
        return path.normalize(p);
    }

export function getConfigPath() {
        return path.normalize('./config');
    }

export function getConfigFilePath(filename) {
        let p = [
            this.getConfigPath(),
            filename
        ].join('/');
        return path.normalize(p);
    }

export function getInitFile(filename) {
        let p = [
            this.getInitPath(),
            filename
        ].join('/');
        return this.read(p);
    }

export function getMigrationsStoragePath() {
        return path.normalize('./migrations.json');
    }

export function getSeedsStoragePath() {
        return path.normalize('./seeds.json');
    }

export function getCreatedFileName(name) {
        return [
            moment().utc().format('YYYYMMDDHHmmss'),
            name
        ].join('-');
    }

export function getCreatedFileExtension() {
        return 'js';
    }

export function addFileExtension(name) {
        return [name, this.getCreatedFileExtension()].join('.');
    }

export function getMigrationFilePath(name) {
        return [
            this.getMigrationsPath(),
            this.addFileExtension(this.getCreatedFileName(name))
        ].join('/');
    }

export function getSeedFilePath(name) {
        return [
            this.getSeedsPath(),
            this.addFileExtension(this.getCreatedFileName(name))
        ].join('/');
    }

export function getMigrationTemplateFilePath() {
        let p = [
            getConfigPath(),
            'migrationTemplate.js'
        ].join('/');
        return path.normalize(p);
    }

export function getSeedTemplateFilePath() {
        let p = [
            getConfigPath(),
            'seedTemplate.js'
        ].join('/');
        return path.normalize(p);
    }

export function getMigrationTemplate() {
        return this.read(this.getMigrationTemplateFilePath());
    }

export function getSeedTemplate() {
        return this.read(this.getSeedTemplateFilePath());
    }
