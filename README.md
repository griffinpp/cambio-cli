# Rhinozug-CLI
Rhinogram's internal database migration tool CLI

## Installing

    npm install -g rhinozug-cli

## Running commands

All commands should be available globally on the command line after installation, and can be called with either of the following:

    rhinozug
    rz

`rz` is used for the remainder of this document, but both are acceptable.

## Listing available commands

You can list all available commands and options at any time with:

    rz -h

## Initializing Rhinozug into a project

Once installed, you can initialize Rhinozug into any (preferably empty) folder in a project by `cd`ing into that folder and:

    rz init

This will create necessary directories and files in your project.  Once initialized, you can run Rhinozug commands from anywhere in your project's directory tree, and Rhinozug will automatically find the folder it was initialized into.  Be sure there is a `package.json` file in your project's folder tree before running `rz init`.

## Migrations

### What are migrations for?

Migrations are meant to alter the schema of a database programatically, and in doing so, help keep the shape of the database under version control.  They are also meant to simplify the work of maintaining and altering the database for developers and minimize the need for learning SQL or a similar query language.

In this case we are using the Knex library to create and alter schema.  The template initially contains some example code and links to help get you started writing schema code.  You can alter the template on a per-project basis, and Rhinozug will use the template in the current project to generate the migrations for that project.

### Creating migrations

Create a new migration with:

    rz create:migration <migrationName>

The migration name is optional. The migration template at `config/migration.template` will be copied into the `migrations` directory with a timestamp in the filename.

When you write your migration, you must write an "up" and a "down" portion of the migration.  The "up" portion contains the changes you wish to make to the database, and the "down" portion exactly undoes those changes.  So if you add a table in the "up" portion, you must remove it in the "down" portion.  If you change a column name in the "up" portion, you must change it back in the "down" portion, and so on.  In this way, if you run a migration up, then immediately run it down, the database should be in an identical state to where it was before you ran the migration.  This is essential to how migrations operate.

### Listing migrations

Show the current status of all migrations with:

    rz list:m

This will show a list of all pending migrations, in order, followed by all executed migrations, in order, on the default connection (see "specifying connections" below, for more information about connections).

### Running migrations

Run all migrations up to the most recent with:

    rz up

This will run the "up" portion of all migrations, in chronological order, against the default connection (see "specifying connections" below, for more information about connections).

Run all migrations up to a specific one with:

    rz up -t <migrationFilename>

This will run the "up" portion of all migrations, in chronological order, up to the migration file named, against the default connection (see "specifying connections" below, for more information about connections).

Undo, or "run down" the most recent migration with:

    rz down

This will run the "down" portion of the most recently run migration against the default connection (see "specifying connections" below, for more information about connections).  Note that the most recently run migration may not be the most recently created one.  Use `rz list` if you are unsure of the status of migrations

Undo, or "run down" all migrations to a specific one with:

    rz down -t <migrationFilename>

This will run the "down" portion of all migrations, in reverse chronological order, down to and including the one specified, against the default connection (see "specifying connections" below, for more information about connections).

### Tracking migrations

Migrations are tracked automatically in the same database that they alter.  A table named `rzMigrations` is created with information about which migrations have already been run.  In this way, every database is aware of its own schema.

## Seeds

### What are seeds for?

Seeds are meant to seed an essentially empty database with some initial data.  They are _not_ meant to provide critical, functional data that the application relies upon (such as the data in lookup tables).  If the application _requires_ a piece of data to function, that piece of data should be added to the database as part of a migration, preferably in the same commit as the code that causes the requirement for the data, so that the requirement for the data and the provision of the data are in sync.  Seeds are generally better suited for operational data, such as adding initial users, locations, and the like.  There should rarely be more than one or two seeds in a project.

### Creating seeds

Create a new seed with:

    rz create:seed <seedName>

The seed name is optional.  The seed template at `config/seed.template` will be copied into the `seeds` directory with a timestamp in the filename.

### Running seeds

Run a seed with:

    rz seed -f <seed filename>

This will run the "up" portion of all seeds, in chronological order, against the default connection (see "specifying connections" below, for more information about connections).

Undo, or "run down" the most recent seed with:

    rz unseed

While most seeds will not have a "down" portion, as this is generally time consuming to write, and not usually needed, if the most recently run seed has a "down" portion, this will run it against the default connection (see "specifying connections" below, for more information about connections).

### Tracking seeds

Seeds are tracked in the same way as migrations, except in a table named `rzSeeds`.  In this way, every database is aware of its own status.

## Creating new connections for use

Connections are simply `.js` files in the `config` folder that export knex connection objects.  `default.js` is provided upon initialization and is used when no connection information is provided to a command.  New connections can be created manually by creating new files that export knex connection objects, but it is generally simpler to use Rhinozug to automatically generate a new connection for you.  Start generating a new connection with:

    rz create:conn

This will begin prompting for the following information:

- The name of the connection
- The host address of the server
- The port that MySql is running on on the server (default is 3306)
- The database to connect to
- The username to connect with
- The password to connect with
- Whether this is an AWS database, in which case it will use a special ssl setting that knex makes available
- Whether to use a connection pool (default is true)
- If using a connection pool, minimum pool size (default is 2)
- If using a connection pool, maximum pool size (default is 10)

Once this information is collected, a new connection file will be created in the `config` folder with the specified information.  This file can be edited further if necessary.  For now, Rhinozug supports MySql connections. 

This connection file can also be `import`ed and used anywhere a knex connection is required, including the Objection.js ORM, once it has been created.

## Specifying connections for rhinozug commands

Many Rhinozug commands can specify a connection to change which database the command is executed against. Rhinozug is initialized with a default connection, defined in `config/default.js`, which is used if no connection is specified.

To use something other than the default connection, use the `-c` option with a command, and specify the name of the connection.  For example, if you had created a connection named "staging", you could run all migrations up on that database with:

    rz up -c staging

If you are not sure what connections are available, you can list all available connections with:

    rz conns

The following commands support the `-c` option:

    up
    down
    seed
    unseed
    list

## Models

Rhinozug can create boilerplate Objection.js model files out of the box.

Create a new model with:

    rz create:model <modelName> <tableName>

Where `<modelName>` is the name you wish the model to have, and `<tableName>` is the name of the table in the database that the model represents.  If no table name is provided, Rhinozug will assume that the model name is the table name.

The model template at `config/model.template` will be copied as `<modelName>.model.js` into the `models` directory, with the model and table names injected into the appropriate places.  Again, Rhinozug will use the local template, so you can modify the template on a per-project basis to fit your needs, or potentially even create models for another ORM with minimal difficulty.

