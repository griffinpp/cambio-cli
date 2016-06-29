'use strict';

import proxyquire from 'proxyquire';
import path from 'path';
import moment from 'moment';

let error = new Error('derp!');

let fsStub = {
  readFileSync: sinon.stub().returns('contents'),
  writeFileSync: sinon.stub().returns('ok'),
  mkdirSync: sinon.stub().returns('ok')
};

let loggerStub = {
  log: sinon.stub(),
  warning: sinon.stub(),
  error: sinon.stub()
};

let sut = proxyquire('../helpers/fileHelper', 
  {
    'fs': fsStub,
    './logger': loggerStub
  }
);



describe('fileHelper module', () => {

  beforeEach(() => {
    loggerStub.log.reset();
    loggerStub.warning.reset();
    loggerStub.error.reset();
  });

  describe('.read()', () => {
    it('should return a string of the contents of the file', () => {
      // just verifying that the correct fs function is called
      let result = sut.read('fakeFile.txt');
      expect(fsStub.readFileSync.calledWith('fakeFile.txt')).to.be.true;
      expect(result).to.equal('contents');
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fsStub.readFileSync.throws(error);
      });

      it('should log the error', () => {
        let result = sut.read('fakeFile.txt');
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fsStub.readFileSync = sinon.stub().returns('contents');
      });
    });
  });

  describe('.write()', () => {
    it('should write the string to the specified file', () => {
      // again, just verifying that the correct fs function is called
      sut.write('fakeFile.txt', 'contents');
      expect(fsStub.writeFileSync.calledWith('fakeFile.txt', 'contents')).to.be.true;
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fsStub.writeFileSync.throws(error);
      });

      it('should log the error', () => {
        let result = sut.write('fakeFile.txt', 'contents');
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fsStub.writeFileSync = sinon.stub().returns('ok');
      });
    });
  });

  describe('.makeDir()', () => {
    it('should create a directory with the specified name in the current working directory', () => {
      sut.makeDir('fakeDir');
      expect(fsStub.mkdirSync.calledWith('./fakeDir')).to.be.true;
    });

    describe('when there is an error', () => {
      beforeEach(() => {
        fsStub.mkdirSync.throws(error);
      });

      it('should log the error', () => {
        let result = sut.makeDir('./fakeDir');
        expect(loggerStub.error.called).to.be.true;
      });

      afterEach(() => {
        fsStub.mkdirSync = sinon.stub().returns('ok');
      });
    });
  });

  describe('.getMigrationsPath()', () => {
      it('should return a path to the "./migrations" directory from the current working directory', () => {
          let result = sut.getMigrationsPath();
          expect(result).to.equal('migrations');
      });
  });

  describe('.getSeedsPath()', () => {
    it('should return a path to the "./seeds" directory from the current working directory', () => {
        let result = sut.getSeedsPath();
        expect(result).to.equal('seeds');
    });
  });

  describe('.getInitPath()', () => {
    it('should return a path to the rhinozug app\'s "initFiles" directory', () => {
      // not really a good way to test this, but at least this test will catch if the algorithm changes
      let result = sut.getInitPath();
      let expectedResult = path.normalize([__dirname,'..', 'initFiles'].join('/'));
      expect(result).to.equal(expectedResult);
    });
  });

  describe('.getConfigPath()', () => {
    it('should return a path to the "./config" directory from the current working directory', () => {
        let result = sut.getConfigPath();
        expect(result).to.equal('config');
    });
  });

  describe('.getConfigFilePath()', () => {
    it('should return a path to the specified file in the "./config" directory', () => {
        let result = sut.getConfigFilePath('fake.js');
        expect(result).to.equal('config/fake.js');
    });
  });

  describe('.getInitFile()', () => {
    it('should return the contents of the specified file in the rhinozug app\'s initFiles directory', () => {
        let result = sut.getInitFile('fake.js');
        let expectedPath = path.normalize([__dirname,'..', 'initFiles', 'fake.js'].join('/'));
        expect(fsStub.readFileSync.calledWith(expectedPath)).to.be.true;
        expect(result).to.equal('contents');
    });
  });

  describe('.getMigrationsStoragePath()', () => {
    it('should return a path to the migrations.json file in the current working directory', () => {
          let result = sut.getMigrationsStoragePath();
          expect(result).to.equal('migrations.json');
      });  
  });

  describe('.getSeedsStoragePath()', () => {
    it('should return a path to the seeds.json file in the current working directory', () => {
        let result = sut.getSeedsStoragePath();
        expect(result).to.equal('seeds.json');
    });
  });

  describe('.getCreatedFileName()', () => {
    before(() => {
      /* so this is screwy... Have to stub the prototype for moment (which is exposed via .fn) since moment exports
      a factory */
      sinon.stub(moment.fn, 'format').returns(20160101);    
    });

    it('should prepend a timestamp to the passed string', () => {
      let result = sut.getCreatedFileName('fake');
      expect(result).to.equal('20160101-fake');
    });

    after(() => {
      moment.fn.format.restore();
    });
  });

  describe('.getCreatedFileExtension()', () => {
    it('should return the string "js"', () => {
        let result = sut.getCreatedFileExtension();
        expect(result).to.equal('js');
    });
  });

  describe('.addFileExtension()', () => {
    it('should append ".js" to the passed string', () => {
        let result = sut.addFileExtension('name');
        expect(result).to.equal('name.js');
    });
  });

  describe('.getMigrationFilePath()', () => {
    before(() => {
      /* so this is screwy... Have to stub the prototype for moment (which is exposed via .fn) since moment exports
      a factory */
      sinon.stub(moment.fn, 'format').returns(20160101);    
    });

    it('should return a path to a new migration file based on the name passed', () => {
      let result = sut.getMigrationFilePath('new');
      expect(result).to.equal('migrations/20160101-new.js');
    });

    after(() => {
      moment.fn.format.restore();
    });
  });

  describe('.getSeedFilePath()', () => {
    before(() => {
      /* so this is screwy... Have to stub the prototype for moment (which is exposed via .fn) since moment exports
      a factory */
      sinon.stub(moment.fn, 'format').returns(20160101);    
    });

    it('should return a path to a new seed file based on the name passed', () => {
      let result = sut.getSeedFilePath('new');
      expect(result).to.equal('seeds/20160101-new.js');
    });
    
    after(() => {
      moment.fn.format.restore();
    });
  });

  describe('.getmigrationTemplateFilePath()', () => {
    it('should return a path to the migration template file', () => {
      let result = sut.getMigrationTemplateFilePath();
      expect(result).to.equal('config/migrationTemplate.js');
    });
  });

  describe('.getSeedTemplateFilePath()', () => {
    it('should return a path to the seed template file', () => {
      let result = sut.getSeedTemplateFilePath();
      expect(result).to.equal('config/seedTemplate.js');
    });
  });

  describe('.getMigrationTemplate()', () => {
    it('should return a string with the contents of the migration template', () => {
      let result = sut.getMigrationTemplate();
      expect(fsStub.readFileSync.calledWith('config/migrationTemplate.js')).to.be.true;
      expect(result).to.equal('contents');
    });
  });

  describe('.getSeedTemplate', () => {
    it('should return a string with the contents of the seed template', () => {
      let result = sut.getSeedTemplate();
      expect(fsStub.readFileSync.calledWith('config/seedTemplate.js')).to.be.true;
      expect(result).to.equal('contents');
    });
  });
});
