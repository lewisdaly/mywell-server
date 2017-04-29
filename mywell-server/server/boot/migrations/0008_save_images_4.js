"use strict";

/**
 * The images were given to me in multiple batches. Instead of re uploading the first lot, we are just running another migration
 */
const loopback = require("loopback");
const isNullOrUndefined = require("util").isNullOrUndefined;
const fs = require("fs");

const name = '0008_save_images_4';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
}

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
  log('running migration');
  let data = null; //base64 string
  let files = null; //list of file names

  return promiseReadDir('/usr/src/app/server/data/well_photos4/')
    .then(_data => {
      files = _data;

      return Promise.all(files.map(fileName => {
        let imageData = null;
        if (fileName === '.DS_Store') {
          return Promise.resolve(true);
        }

        let resourceId = null
        return promiseReadFile(`/usr/src/app/server/data/well_photos4/${fileName}`)
          .then(_data => {
            imageData = _data.toString('base64');
            resourceId = fileName.split(".")[0];

            //TODO: it would be more optimal to lookup all resources, and then map
            return app.models.Resource.findById(resourceId, {where:{villageId:383350}});
          })
          .then(resource => {
            if (!resource) {
              log("No Resource for:", resourceId);
              return true;
            }
            resource.image = imageData;
            return resource.save();
          })
      }));
    });
}

module.exports = {
  name: name,
  migration: runMigration
}
