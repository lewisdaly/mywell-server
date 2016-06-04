"use strict";

var loopback = require("loopback");


module.exports = function(app, next) {
  console.log("Creating seed database");

  const environment = process.env.NODE_ENV;
  console.log("environment", environment);

  //TODO: setup environment variables

  const readings = [
    {
      id:1,
      resourceId: 100,
      date: "2016-05-11T03:04:59.764Z",
      value: 10,
      village_id: 1,
    },
    {
      id:2,
      resourceId: 101,
      date: "2016-05-11T03:04:59.764Z",
      value: 11,
      village_id: 1,
    },
    {
      id:3,
      resourceId: 102,
      date: "2016-05-11T03:04:59.764Z",
      value: 12,
      village_id: 1,
    },
  ]

  const resources = [
    {
      id: 100,
      geo: new loopback.GeoPoint({lat: 10.32424, lng: 5.84978}),
      last_value:10,
      last_date: "2016-05-11T03:04:59.764Z",
      villageId: 1,
      owner: "Lewis",
      elevation: 10,
      type: "well"
    },
    {
      id: 101,
      geo: new loopback.GeoPoint({lat: 11.32424, lng: 5.84978}),
      last_value:12,
      last_date: "2016-05-11T03:04:59.764Z",
      villageId: 1,
      owner: "Lewis",
      elevation: 10,
      type: "well"
    }
  ]

  const villages = [
    {
      "name": "Varni",
      "postcode": 510934,
      "village_id": 5,
      "id":1
    }
  ]

    Promise.all([
      //Create models here
      createModel(app.models.Reading, readings),
      createModel(app.models.Resource, resources),
      createModel(app.models.Village, villages),
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

const createModel = (model, list) => {
  var count = list.length;
  return new Promise((resolve, reject) => {
    list.forEach((item) => {
      console.log("creating:", item);
      model.create(item, { skipUpdateModels:true }, (err, model) => {
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

