"use strict";

const loopback = require("loopback");
const fs = require('fs');
const isNullOrUndefined = require('util').isNullOrUndefined;


const name = '013_fix_rain_images';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
};

const runMigration = (app) => {
  log('running migration');

  return app.models.Resource.find({"where":{"id":1170}})
    .then(_resources => {
      return Promise.all(_resources.map(resource => {
        resource.image = "";
        return resource.save()
          .then(() => console.log("updated resource"))
          .catch(err => {
            console.log("err", err);
          });
      }));
    });
}

module.exports = {
  name: name,
  migration: runMigration
};
