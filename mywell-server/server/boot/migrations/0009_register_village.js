"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;

const villages = [
  {id:11, name:"Vallabhnagar", postcode:313601, coordinates:new loopback.GeoPoint({lat:24.6734,lng:74.0022})},
];

const name = '0009_register_village';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
}

const runMigration = (app) => {
  log('running migration');

  return Promise.all([
    createModel(app.models.Village, villages, true),
  ])
  .then(() => {
    log("seeded the village");
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
