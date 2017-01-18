"use strict"
const fs = require('fs');

module.exports = function(app, next) {
  console.log("[05_setup_file_storage] setting up file storage");

  // fs.openSync('/tmp/storage/container1', 'w');
  if (alreadyCreated('/tmp/storage/container1')) {
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
