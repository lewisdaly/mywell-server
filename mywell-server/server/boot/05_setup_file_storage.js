"use strict"
const fs = require('fs');

module.exports = function(app, next) {
  console.log("[05_setup_file_storage] setting up file storage");

  // app.dataSources.storage.connector.getFilename = function(fileInfo, req, res) {
  //   var origFilename = fileInfo.name;
  //
  //   // optimisticly get the extension
  //   var parts = origFilename.split('.'),
  //       extension = parts[parts.length-1];
  //
  //   // Using a local timestamp + user id in the filename (you might want to change this)
  //   var newFilename = (new Date()).getTime()+'.'+extension;
  //   return next();
  //   return newFilename;
  // }

  if (alreadyCreated('/usr/src/app/storage/container1')) {
    console.log("[05_setup_file_storage] already created. Skipping this step.");
    return next();
  }

  app.models.container.createContainer({name:'container1'}, (err, res) => {
    if (err) return next(err);

    console.log("[05_setup_file_storage] created container, container1");

    next();
  });
}

function alreadyCreated(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  }
  catch (err){
    return false;
  }
}
