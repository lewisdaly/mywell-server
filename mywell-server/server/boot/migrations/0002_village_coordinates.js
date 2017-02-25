"use strict";

const loopback = require("loopback");
const isNullOrUndefined = require("util").isNullOrUndefined;

/* I got these values from the actual wells in the village */
const approxVillageCenters = {
  11: {
    lat: 24.5925886,
    lng: 74.1921055
  },
  12: {
    lat: 24.5236538,
    lng: 74.2257458
  },
  13: {
    lat: 24.5691236,
    lng: 74.1969905
  },
  14: {
    lat: 24.5694388,
    lng: 74.1705252
  },
  15: {
    lat: 24.5714177,
    lng: 74.2294288
  },
}

const runMigration = (app) => {
  console.log("     - [0002_village_coordinates] running migration 0002");

  return app.models.Village.find()
    .then(villages => {
      return Promise.all(villages.map(village => {
        const geo = approxVillageCenters[village.id];
        village.coordinates = geo;
        return village.save()
          .catch(err => {
            console.log("error saving individual village", err);
          });
      }));
    })
    .catch(err => {
      console.log("Err", err);
    });
}


module.exports = {
  name: '0002_village_coordinates',
  migration: runMigration
}
