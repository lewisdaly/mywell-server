"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;

const villages = [
  {id:11, name:"Udaipur", postcode:313001, coordinates:new loopback.GeoPoint({lat:24.594875,lng:73.735913})},
];

const resources = [
  {id:1170,geo:new loopback.GeoPoint({lat:24.594875,lng:73.735913}),last_value:0, last_date:0, villageId:11, owner:"Yogita Dashora", elevation:0, type:"raingauge", postcode:313001, well_depth:0},
]

const name = '0010_register_udaipur';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
}

const runMigration = (app) => {
  log('running migration');

  return Promise.all([
    createModel(app.models.Village, villages, true),
    createModel(app.models.Resource, resources, true),
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
