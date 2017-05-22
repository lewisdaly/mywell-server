"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;

const villages = [
  {id:11, name:"Udaipur", postcode:313001, coordinates:new loopback.GeoPoint({lat:24.594875,lng:73.735913})},
];

const name = '0011_fix_village_latlng';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
}

const newCoords = {
  11: new loopback.GeoPoint({lat:23.547992,lng:73.27948}),
  12: new loopback.GeoPoint({lat:23.934222,lng:73.775917}),
  13: new loopback.GeoPoint({lat:23.564808,lng:73.491394}),
  14: new loopback.GeoPoint({lat:23.531410, lng:73.457797}),
  15: new loopback.GeoPoint({lat:23.534862, lng:73.469086}),
  16: new loopback.GeoPoint({lat:23.533582, lng:73.4823345}),
};

const runMigration = (app) => {
  log('running migration');

  return app.models.Village.find({"where":{"postcode":383350}})
  .then(_villages => {
    console.log("villages:", _villages)
    return Promise.all(_villages.map(_village => {
      _village.coordinates = newCoords[_village.id];
      return _village.save();
    }));
  })
  .then(() => {
    log("fixed village coords");
  });
}

module.exports = {
  name: name,
  migration: runMigration
};
