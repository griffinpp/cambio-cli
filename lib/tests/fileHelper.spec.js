'use strict';

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fsStub = {
  readFileSync: sinon.stub().returns('contents'),
  writeFileSync: sinon.stub().returns('ok'),
  mkdirSync: sinon.stub().returns('ok')
};

/* so this is screwy... Have to stub the prototype for moment (which is exposed via .fn) since moment exports
a factory */
sinon.stub(_moment2.default.fn, 'format').returns(20160101);

var sut = (0, _proxyquire2.default)('../helpers/fileHelper', {
  'fs': fsStub
});

describe('fileHelper module', function () {
  describe('.read()', function () {
    it('should return a string of the contents of the file', function () {
      // just verifying that the correct fs function is called
      var result = sut.read('fakeFile.txt');
      expect(fsStub.readFileSync.calledWith('fakeFile.txt')).to.be.true;
      expect(result).to.equal('contents');
    });
  });

  describe('.write()', function () {
    it('should write the string to the specified file', function () {
      // again, just verifying that the correct fs function is called
      sut.write('fakeFile.txt', 'contents');
      expect(fsStub.writeFileSync.calledWith('fakeFile.txt', 'contents')).to.be.true;
    });
  });

  describe('.makeDir()', function () {
    it('should create a directory with the specified name in the current working directory', function () {
      sut.makeDir('fakeDir');
      expect(fsStub.mkdirSync.calledWith('./fakeDir')).to.be.true;
    });
  });

  describe('.getMigrationsPath()', function () {
    it('should return a path to the "./migrations" directory from the current working directory', function () {
      var result = sut.getMigrationsPath();
      expect(result).to.equal('migrations');
    });
  });

  describe('.getSeedsPath()', function () {
    it('should return a path to the "./seeds" directory from the current working directory', function () {
      var result = sut.getSeedsPath();
      expect(result).to.equal('seeds');
    });
  });

  describe('.getInitPath()', function () {
    it('should return a path to the rhinozug app\'s "initFiles" directory', function () {
      // not really a good way to test this, but at least this test will catch if the algorithm changes
      var result = sut.getInitPath();
      var expectedResult = _path2.default.normalize([__dirname, '..', 'initFiles'].join('/'));
      expect(result).to.equal(expectedResult);
    });
  });

  describe('.getConfigPath()', function () {
    it('should return a path to the "./config" directory from the current working directory', function () {
      var result = sut.getConfigPath();
      expect(result).to.equal('config');
    });
  });

  describe('.getConfigFilePath()', function () {
    it('should return a path to the specified file in the "./config" directory', function () {
      var result = sut.getConfigFilePath('fake.js');
      expect(result).to.equal('config/fake.js');
    });
  });

  describe('.getInitFile()', function () {
    it('should return the contents of the specified file in the rhinozug app\'s initFiles directory', function () {
      var result = sut.getInitFile('fake.js');
      var expectedPath = _path2.default.normalize([__dirname, '..', 'initFiles', 'fake.js'].join('/'));
      expect(fsStub.readFileSync.calledWith(expectedPath)).to.be.true;
      expect(result).to.equal('contents');
    });
  });

  describe('.getMigrationsStoragePath()', function () {
    it('should return a path to the migrations.json file in the current working directory', function () {
      var result = sut.getMigrationsStoragePath();
      expect(result).to.equal('migrations.json');
    });
  });

  describe('.getSeedsStoragePath()', function () {
    it('should return a path to the seeds.json file in the current working directory', function () {
      var result = sut.getSeedsStoragePath();
      expect(result).to.equal('seeds.json');
    });
  });

  describe('.getCreatedFileName()', function () {
    it('should prepend a timestamp to the passed string', function () {
      var result = sut.getCreatedFileName('fake');
      expect(result).to.equal('20160101-fake');
    });
  });

  describe('.getCreatedFileExtension()', function () {
    it('should return the string "js"', function () {
      var result = sut.getCreatedFileExtension();
      expect(result).to.equal('js');
    });
  });

  describe('.addFileExtension()', function () {
    it('should append ".js" to the passed string', function () {
      var result = sut.addFileExtension('name');
      expect(result).to.equal('name.js');
    });
  });

  describe('.getMigrationFilePath()', function () {
    it('should return a path to a new migration file based on the name passed', function () {
      var result = sut.getMigrationFilePath('new');
      expect(result).to.equal('migrations/20160101-new.js');
    });
  });

  describe('.getSeedFilePath()', function () {
    it('should return a path to a new seed file based on the name passed', function () {
      var result = sut.getSeedFilePath('new');
      expect(result).to.equal('seeds/20160101-new.js');
    });
  });

  describe('.getmigrationTemplateFilePath()', function () {
    it('should return a path to the migration template file', function () {
      var result = sut.getMigrationTemplateFilePath();
      expect(result).to.equal('config/migrationTemplate.js');
    });
  });

  describe('.getSeedTemplateFilePath()', function () {
    it('should return a path to the seed template file', function () {
      var result = sut.getSeedTemplateFilePath();
      expect(result).to.equal('config/seedTemplate.js');
    });
  });

  describe('.getMigrationTemplate()', function () {
    it('should return a string with the contents of the migration template', function () {
      var result = sut.getMigrationTemplate();
      expect(fsStub.readFileSync.calledWith('config/migrationTemplate.js')).to.be.true;
      expect(result).to.equal('contents');
    });
  });

  describe('.getSeedTemplate', function () {
    it('should return a string with the contents of the seed template', function () {
      var result = sut.getSeedTemplate();
      expect(fsStub.readFileSync.calledWith('config/seedTemplate.js')).to.be.true;
      expect(result).to.equal('contents');
    });
  });
});