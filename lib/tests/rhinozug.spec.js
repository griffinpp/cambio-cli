'use strict';

describe('rhinozug module', function () {
    describe('.createMigration', function () {
        describe('when a name is specified', function () {
            it('should use the name specified as the legible part of the filename', function () {});
        });

        describe('when a name is not specified', function () {
            it('should use "unnamed" as the legible part of the filename ', function () {});
        });

        it('should create a new copy of the migration template in the migrations directory', function () {});

        it('should name the new migration file using the determined name plus a timestamp', function () {});
    });

    describe('.up()', function () {
        describe('when a file is specified', function () {
            describe('when the file is found', function () {
                it('should run migrations up to the specified file', function () {});
            });

            describe('when the file is not found', function () {
                it('should log the error to the console', function () {});
            });
        });

        describe('when a file is not specified', function () {
            it('should run all migrations up the most current file', function () {});
        });
    });

    describe('.down()', function () {
        describe('when a file is specified', function () {
            describe('when the file is found', function () {
                it('should run migrations down to the specified file', function () {});
            });

            describe('when the file is not found', function () {
                it('should log the error to the console', function () {});
            });
        });

        describe('when a file is not specified', function () {
            it('should run down the last migration that was run up', function () {});
        });
    });

    describe('.createSeed()', function () {
        describe('when a name is specified', function () {
            it('should use the name specified as the legible part of the filename', function () {});
        });

        describe('when a name is not specified', function () {
            it('should use "unnamed" as the legible part of the filename ', function () {});
        });

        it('should create a new copy of the seed template in the seeds directory', function () {});

        it('should name the new seed file using the legible name plus a timestamp', function () {});
    });

    describe('.seed()', function () {
        it('should run Umzug.up on any unexecuted seed files', function () {});
    });

    describe('.init()', function () {
        it('should create a config directory', function () {});

        it('should create a migrations directory', function () {});

        it('should create a seeds directory', function () {});

        it('should copy the default connection config file into the new config folder', function () {});

        it('should copy the migration template into the new config folder', function () {});

        it('should copy the seed template into the new config folder', function () {});
    });

    describe('.getConnection()', function () {
        it('should pass the config option to knex.new()', function () {});
    });
});