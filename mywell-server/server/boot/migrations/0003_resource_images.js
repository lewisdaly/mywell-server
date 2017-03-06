"use strict";

const loopback = require("loopback");
const isNullOrUndefined = require("util").isNullOrUndefined;
const fs = require("fs");

const promiseReadFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

const runMigration = (app) => {
  console.log("     - [0003_resource_images] running migration 0003");
  let data = null; //base64 string

  return promiseReadFile('/usr/src/app/server/data/well.jpg')
    .then(_data => {
      data = _data.toString('base64');
    })
    .then(() => app.models.Resource.find())
    .then(resources => {
      return Promise.all(resources.map(resource => {
        resource.image = data;
        return resource.save()
          .catch(err => {
            console.log('     - [0003_resource_images] Error saving image:', err);
          });
      }));
    })
    .catch(err => {
      console.log("     - [0003_resource_images] Err", err);
    });
}

module.exports = {
  name: '0003_resource_images',
  migration: runMigration
}
