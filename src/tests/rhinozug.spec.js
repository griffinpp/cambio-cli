'use strict';

describe('rhinozug module', () => {
  describe('.createMigration', () => {
      describe('when a name is specified', () => {
          it('should use the name specified as the legible part of the filename', () => {
              
          });
      });

      describe('when a name is not specified', () => {
          it('should use "unnamed" as the legible part of the filename ', () => {
              
          });
      });

      it('should create a new copy of the migration template in the migrations directory', () => {
          
      });

      it('should name the new migration file using the determined name plus a timestamp', () => {
          
      });
  });

  describe('.up()', () => {
      describe('when a file is specified', () => {
        describe('when the file is found', () => {
            it('should run migrations up to the specified file', () => {
                
            });
        });

        describe('when the file is not found', () => {
            it('should log the error to the console', () => {
                
            });
        });
      });

      describe('when a file is not specified', () => {
           it('should run all migrations up the most current file', () => {
               
           });
       }); 
  });

  describe('.down()', () => {
     describe('when a file is specified', () => {
        describe('when the file is found', () => {
            it('should run migrations down to the specified file', () => {
                
            });
        });

        describe('when the file is not found', () => {
            it('should log the error to the console', () => {
                
            });
        });
      });

      describe('when a file is not specified', () => {
           it('should run down the last migration that was run up', () => {
               
           });
       }); 
  });

  describe('.createSeed()', () => {
      describe('when a name is specified', () => {
          it('should use the name specified as the legible part of the filename', () => {
              
          });
      });

      describe('when a name is not specified', () => {
          it('should use "unnamed" as the legible part of the filename ', () => {
              
          });
      });

      it('should create a new copy of the seed template in the seeds directory', () => {
          
      });

      it('should name the new seed file using the legible name plus a timestamp', () => {
          
      });
  });

  describe('.seed()', () => {
      it('should run Umzug.up on any unexecuted seed files', () => {
          
      });
  });

  describe('.init()', () => {
      it('should create a config directory', () => {
          
      });

      it('should create a migrations directory', () => {
            
      }); 

      it('should create a seeds directory', () => {
          
      });

      it('should copy the default connection config file into the new config folder', () => {
          
      });

      it('should copy the migration template into the new config folder', () => {
          
      });

      it('should copy the seed template into the new config folder', () => {
          
      });
  });

  describe('.getConnection()', () => {
      it('should pass the config option to knex.new()', () => {
          
      });
  });
});