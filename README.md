# Rhinozug-CLI
Rhinogram's internal database migration tool CLI

## Installing

Until released on NPM, pull down the repository, `cd` to the folder that you copied the repository to, and install with:

    npm install -g

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

This will create necessary directories and files in your project.  Once initialized, you can run Rhinozug commands from anywhere in your project's directory tree, and Rhinozug will automatically find the folder it was initialized into.

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

    rz list

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

Run all seeds up to the most recent one with:

    rz seed

This will run the "up" portion of all seeds, in chronological order, against the default connection (see "specifying connections" below, for more information about connections).

Undo, or "run down" the most recent seed with:

    rz unseed

While most seeds will not have a "down" portion, as this is generally time consuming to write, and not usually needed, if the most recently run seed has a "down" portion, this will run it against the default connection (see "specifying connections" below, for more information about connections).

### Tracking seeds

Seeds are tracked in the same way as migrations, except in a table named `rzSeeds`.  In this way, every database is aware of its own status.

##  Specifying connections

Many Rhinozug commands can specify a connection to change which database the command is executed against.  Rhinozug is initialized with a default connection, defined in `config/default.js`.  This file simply exports a knex connection object.  To add another connection for Rhinozug to use, simply create another `.js` file in the `config` directory that exports a knex connection object.  For now, Rhinozug supports MySql connections. 

To use another connection, use the `-c` option with a command, and specify the filename of the connection file, without the `.js` portion.  For example, if you had added a second connection file to `config` called `staging.js`, you could run all migrations up on that database with:

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

