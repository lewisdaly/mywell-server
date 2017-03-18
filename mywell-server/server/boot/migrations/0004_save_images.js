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

const promiseReadDir = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

const runMigration = (app) => {
  console.log("     - [0004_save_images] running migration 0004");
  let data = null; //base64 string
  let files = null; //list of file names

  return promiseReadDir('/usr/src/app/server/data/well_photos/')
    .then(_data => {
      files = _data;

      return Promise.all(files.map(fileName => {
        let imageData = null;

        return promiseReadFile(`/usr/src/app/server/data/well_photos/${fileName}`)
          .then(_data => {
            imageData = _data.toString('base64');
            const resourceId = fileName.split(".")[0];

            //TODO: it would be more optimal to lookup all resources, and then map
            return app.models.Resource.findById(resourceId);
          })
          .then(resource => {
            resource.image = imageData;
            return resource.save();
          })
      }));
    });
}

module.exports = {
  name: '0004_save_images',
  migration: runMigration
}
