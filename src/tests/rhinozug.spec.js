'use strict';

import proxyquire from 'proxyquire';
import * as promiseHelp from './promiseHelper';

let fhStub = {
  getMigrationTemplate: sinon.stub().returns('migration template contents'),
  getSeedTemplate: sinon.stub().returns('seed template contents'),
  getMigrationFilePath: (name) => {
    return `migration/20160101-${name}.js`;
  },
  getSeedFilePath: (name) => {
    return `seed/20160101-${name}.js`;
  },
  getConfigFilePath: (name) => {
    return `config/${name}`;
  },
  getInitFile: sinon.stub().returns('init file contents'),
  read: sinon.stub().returns('fake contents'),
  write: sinon.stub(),
  makeDir: sinon.stub()
};

let error = new Error('derp!');

let cpStub = {
  exec: sinon.stub()
};

let umzugStub = function() {};

// create local stubs so we can monitor what's going on
let up = sinon.stub().returns(Promise.resolve());
let down = sinon.stub().returns(Promise.resolve());

umzugStub.prototype = {
  up,
  down
};

let loggerStub = {
  log: sinon.stub(),
  warning: sinon.stub(),
  error: sinon.stub()
};

let sut = proxyquire('../rhinozug', {
  './helpers/fileHelper': fhStub,
  'Umzug': umzugStub,
  'child_process': cpStub,
  './helpers/logger': loggerStub
});

describe('rhinozug module', () => {
  beforeEach(() => {
    loggerStub.error.reset();
    loggerStub.warning.reset();
    loggerStub.error.reset();      
  });

  describe('.createMigration', () => {
    describe('when a name is specified', () => {
      it('should create a new copy of the migration template in the migrations directory using the name given as the legible part of the filename', () => {
        sut.createMigration('testName');
        expect(fhStub.write.calledWith('migration/20160101-testName.js', 'migration template contents')).to.be.true;
      });
    });

    describe('when a name is not specified', () => {
      it('should create a new copy of the migration template in the migrations directory using "unnamed" as the legible part of the filename', () => {
        sut.createMigration();
        expect(fhStub.write.calledWith('migration/20160101-unnamed.js', 'migration template contents')).to.be.true;
      });
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fhStub.write.throws(error);
      });

      it('should log the error', () => {
        sut.createMigration('testName');
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fhStub.write = sinon.stub(); 
      });        
    });
  });

  describe('.up()', () => {

    beforeEach(() => {
      up.reset();
      up.returns(Promise.resolve());
    });

    describe('when a file is specified', () => {
      it('should run migrations up to the specified file', (done) => {
        promiseHelp.testAfterPromise(sut.up('testFile.js'), () => {
          expect(up.calledWith({to: 'testFile.js'})).to.be.true;
        }, done);
      });
    });

    describe('when a file is not specified', () => {
      it('should run all migrations up the most current file', (done) => {
       promiseHelp.testAfterPromise(sut.up(), () => {
         expect(up.called).to.be.true;
       }, done);
      });
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        up.returns(Promise.reject);
      });

      it('should log the error', (done) => {
        promiseHelp.testAfterPromise(sut.up(), () => {
          expect(loggerStub.error.called).to.be.true;
        }, done);        
      });        
    });
  });

  describe('.down()', () => {

    beforeEach(() => {
      down.reset();
      down.returns(Promise.resolve());
    });

    describe('when a file is specified', () => {
      it('should run migrations down to the specified file', (done) => {
        // done(new Error('test error'));
        promiseHelp.testAfterPromise(sut.down('testFile.js'), () => {
          expect(down.calledWith({to: 'testFile.js'})).to.be.true;    
        }, done);        
      });
    });

    describe('when a file is not specified', () => {
      it('should run down the last migration that was run up', (done) => {
        promiseHelp.testAfterPromise(sut.down(), () => {
          expect(down.called).to.be.true;
        }, done);
      });
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        down.returns(Promise.reject());
      });

      it('should log the error', (done) => {
        promiseHelp.testAfterPromise(sut.down(), () => {
          expect(loggerStub.error.called).to.be.true;
        }, done);        
      });        
    });
  });

  describe('.createSeed()', () => {
    describe('when a name is specified', () => {
      it('should create a new copy of the seed template in the seeds directory using the name given as the legible part of the filename', () => {
        sut.createSeed('testName');
        expect(fhStub.write.calledWith('seed/20160101-testName.js', 'seed template contents')).to.be.true;
      });
    });

    describe('when a name is not specified', () => {
      it('should create a new copy of the seed template in the seeds directory using "unnamed" as the legible part of the filename', () => {
        sut.createSeed();
        expect(fhStub.write.calledWith('seed/20160101-unnamed.js', 'seed template contents')).to.be.true;
      });
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fhStub.write.throws(error);
      });

      it('should log the error', () => {
        sut.createMigration('testName');
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fhStub.write = sinon.stub(); 
      });        
    });
  });

  describe('.seed()', () => {
    beforeEach(() => {
      up.reset();
      up.returns(Promise.resolve());
    });

    it('should run Umzug.up on any unexecuted seed files', () => {
      sut.seed();
      expect(up.called).to.be.true;
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        up.returns(Promise.reject());
      });

      it('should log the error', (done) => {
        promiseHelp.testAfterPromise(sut.seed(), () => {
          expect(loggerStub.error.called).to.be.true;
        }, done);        
      });        
    });
  });

  describe('.init()', () => {
    it('should create a config directory', () => {
      sut.init();
      expect(fhStub.makeDir.calledWith('config')).to.be.true;
    });

    it('should create a migrations directory', () => {
      sut.init();
      expect(fhStub.makeDir.calledWith('migrations')).to.be.true;
    }); 

    it('should create a seeds directory', () => {
      sut.init();
      expect(fhStub.makeDir.calledWith('seeds')).to.be.true;
    });

    it('should copy the default connection config file into the new config folder', () => {
      sut.init();
      expect(fhStub.getInitFile.calledWith('default.connection')).to.be.true;
      expect(fhStub.write.calledWith('config/default.js', 'init file contents')).to.be.true;
    });

    it('should copy the migration template into the new config folder', () => {
      sut.init();
      expect(fhStub.getInitFile.calledWith('migration.template')).to.be.true;
      expect(fhStub.write.calledWith('config/migrationTemplate.js', 'init file contents')).to.be.true;
    });

    it('should copy the seed template into the new config folder', () => {
      sut.init();
      expect(fhStub.getInitFile.calledWith('seed.template')).to.be.true;
      expect(fhStub.write.calledWith('config/seedTemplate.js', 'init file contents')).to.be.true;
    });

    it('should npm install the local rhinozug module', () => {
      sut.init();
      expect(cpStub.exec.calledWith('npm install --save rhinozug')).to.be.true;
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fhStub.write.throws(error); 
      });

      it('should log the error', () => {
        sut.init();
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fhStub.write = sinon.stub(); 
      }); 
    });
  });
});