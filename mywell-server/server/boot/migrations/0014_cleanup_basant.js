"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;

const name = '0014_cleanup_basant';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
};

const runMigration = (app) => {
  log('running migration');

  return app.models.Village.destroyAll({"and":[{"id":11}, {"postcode":2756}]})
    .then(() => app.models.Resource.destroyAll({"and":[{"id":1170}, {"postcode":2756}]}))
    .then(() => app.models.Reading.destroyAll({"and":[{"resourceId":1170}, {"postcode":2756}]}))
}

module.exports = {
  name: name,
  migration: runMigration
};
