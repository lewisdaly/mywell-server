"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;


const name = '00_base';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
};

const runMigration = (app) => {
  log('running migration');
}

module.exports = {
  name: name,
  migration: runMigration
};
