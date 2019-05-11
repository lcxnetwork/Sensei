// Copyright (c) 2018, Fexra, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.
'use strict';

const db = require('../utils').knex;

// Create 'users' table if it does not exist
db.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    return db.schema.createTable('users', function(table) {
      table.increments();
      table.unique('email');
      table.string('email');
      table.string('password', 1024);
      table.string('recovery');
      table.string('secret');
      table.string('validationkey');
      table.string('wallet');
      table.integer('verified').defaultTo(0);
      table.string('name');
      table.string('role');
      table.string('timezone').defaultTo('Europe/Andorra');
      table.integer('terms').defaultTo(0);
      table.datetime('seen');
      table.datetime('created').defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable('nodes').then(function(exists) {
  if (!exists) {
    return db.schema.createTable('nodes', function(table) {
      table.string('id');
      table.string('ip');
      table.string('port');
      table.string('connectionstring');
    });
  }
});

db.schema.hasTable('pings').then(function(exists) {
  if (!exists) {
    return db.schema.createTable('pings', function(table) {
      table.datetime('timestamp').defaultTo(db.fn.now());
      table.string('id');
      table.string('ip');
      table.string('connectionstring');
    });
  }
});

db.schema.hasTable('shares').then(function(exists) {
  if (!exists) {
    return db.schema.createTable('shares', function(table) {
      table.string('id');
      table.integer('shares');
      table.integer('percent');
    });
  }
});

db.schema.hasTable('payments').then(function(exists) {
  if (!exists) {
    return db.schema.createTable('payments', function(table) {
      table.string('id');
      table.string('address')
      table.integer('amount');
      table.string('nonce');
      table.boolean('pending');
      table.string('hash');
    });
  }
});