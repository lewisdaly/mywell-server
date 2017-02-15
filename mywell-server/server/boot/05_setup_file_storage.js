"use strict"
const fs = require('fs');

module.exports = function(app, next) {
  console.log("[05_setup_file_storage] setting up file storage");

  checkAndCreateContainer('/usr/src/app/storage/container1')
    .then(() => next())
    .catch(err => {
      console.log("[05_setup_file_storage] err", err);
      next(err);
    });
}

function checkAndCreateContainer(directory) {
  return new Promise((resolve, reject) => {
    fs.stat(directory, function(err, stats) {
      if (err && err.errno === 34) {
          return app.models.container.createContainer({name:'container1'})
            .then(result => resolve(result))
            .catch(err => reject(err));
        };

        console.log("[05_setup_file_storage] file storage already set up");
        return resolve(true);
    });
  });
}
