"use strict";

var loopback = require("loopback");
const resources = require("../data/wells.js");
const currentReadings = require("../data/currentReadings.js");
const pastReadings = require("../data/pastReadings.js");

module.exports = function(app, next) {
  console.log("Creating seed database");

  const environment = process.env.NODE_ENV;
  console.log("environment", environment);

  //TODO: setup environment variables
  
  //TODO: check to see if db already seeded.

  //Temp skip function
  // console.log("Skipping seed db")
  // next();
  // return;

  const villages = [
    {id:5, name:"Varni", postcode:313603},
    {id:4, name:"Sunderpura", postcode:313603},
    {id:3, name:"Hinta", postcode:313603},
    {id:2, name:"Dharta", postcode:313603},
    {id:1, name:"Badgaon", postcode:313603}
  ];

    Promise.all([
      //Create models here
      createModel(app.models.Reading, pastReadings, true),
      createModel(app.models.Resource, resources, true),
      createModel(app.models.Village, villages, true),
      createModel(app.models.Reading, currentReadings, false)
    ])
    .then(() => {
      console.log("finshed making readings I think.");
      next();
    })
    .catch((err) => {
      console.log("Error", err);
      next();
    })
}

const createModel = (model, list, skipUpdate) => {
  var count = list.length;
  return new Promise((resolve, reject) => {
    list.forEach((item) => {
      // console.log("creating:", item);
      model.create(item, { skipUpdateModels:skipUpdate }, (err, model) => {
        if (err) reject(err);

        // console.log("created", model);
        count--;
        if (count === 0) {
          resolve();
        }
      });
    })
  });
};

