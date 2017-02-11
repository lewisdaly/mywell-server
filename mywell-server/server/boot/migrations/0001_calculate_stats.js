"use strict";

var loopback = require("loopback");
var fs = require('fs');
var isNullOrUndefined = require('util').isNullOrUndefined;

function alreadySeeded(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err){
    return false;
  }
}

function findVillageIdFromResourceId(id) {
  return parseInt(id.toString()[0]);
}

module.exports = function(app) {
  return new Promise((resolve, reject) => {

    if (alreadySeeded('server/0001_run')) {
      console.log('     - [0001_calculate_stats] already run');
      return resolve(true);
    }

    console.log("running migration 0001");

    //Do all calculations in SQL:
    const query = "SELECT resourceId, postcode, DATE_FORMAT(date, '%Y-%m') as month, CAST(AVG(value) AS CHAR(255)) as ave_reading, villageId FROM reading GROUP BY DATE_FORMAT(date, '%Y-%m'), resourceId;";
    const datasource = app.models.reading.dataSource;

    datasource.connector.query(query, (err, results) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      console.log("     - [0001_calculate_stats] got", results.length, "results");

      //Now save to new model
      return Promise.all(
        results.map(result => {
          if (!isNullOrUndefined(result.ave_reading)) {
            result.ave_reading = parseFloat(result.ave_reading);
          }

          result.villageId = findVillageIdFromResourceId(result.resourceId);
          result.resourceType = "well";
          return app.models.resource_stats.upsert(result);
        })
      )
      .then(savedValues => {
        console.log('     - [0001_calculate_stats] saved', savedValues.length, 'values');
        fs.openSync('server/0001_run', 'w');

        return resolve(true);
      })
      .catch(err => {
        return reject(err);
      });

    });
  });
}
