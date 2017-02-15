"use strict";

var loopback = require("loopback");
var fs = require('fs');
var isNullOrUndefined = require('util').isNullOrUndefined;


function findVillageIdFromResourceId(id) {
  return parseInt(id.toString()[0]);
}

const runMigration = (app) => {
  return new Promise((resolve, reject) => {
    console.log("     - [0001_calculate_stats] running migration 0001");

    //Do all calculations in SQL:
    const query = "SELECT resourceId, postcode, DATE_FORMAT(date, '%Y-%m') as month, CAST(AVG(value) AS CHAR(255)) as ave_reading, villageId FROM reading GROUP BY DATE_FORMAT(date, '%Y-%m'), resourceId;";
    console.log(query);
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
        // app.models.Migration.create({name:'0001_calculate_stats'});
        return resolve(true);
      })
      .catch(err => {
        return reject(err);
      });
    });
  });
}

module.exports = {
  name: '0001_calculate_stats',
  migration: runMigration
}
