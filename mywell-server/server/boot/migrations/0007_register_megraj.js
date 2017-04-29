"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;

const villages = require('../../data/megraj_villages');
const wells = require('../../data/megraj_wells');

const name = '0007_register_megraj';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
}

const runMigration = (app) => {
  log('running migration');

  return Promise.all([
    createModel(app.models.Village, villages, true),
    createModel(app.models.Resource, wells, true),
  ])
  .then(() => {
    log("seeded the megraj villages and resources");
  });
}

module.exports = {
  name: name,
  migration: runMigration
}

/* Copied from 02_seed_db.js coz I'm feeling lazy */
const createModel = (model, list, skipUpdate) => {
  var count = list.length;
  return new Promise((resolve, reject) => {
    list.forEach((item) => {
      model.create(item, { skipUpdateModels:skipUpdate }, (err, model) => {
        if (err) reject(err);

        count--;
        if (count === 0) {
          resolve();
        }
      });
    })
  });
};
