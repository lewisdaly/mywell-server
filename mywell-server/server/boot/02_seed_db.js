"use strict";

var loopback = require("loopback");
const resources = require("../data/wells.js");
const currentReadings = require("../data/currentReadings_displaced_10.js");
const pastReadings = require("../data/pastReadings_displaced_10.js");
var fs = require('fs');

function alreadySeeded(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err){
    return false;
  }
}

module.exports = function(app, next) {
  console.log("[02_seed_db] Creating seed database");

  const environment = process.env.NODE_ENV;

  //TODO: setup environment variables

  //check to see if db already seeded.
  if (alreadySeeded('server/hasDBSeeded')) {
    console.log("[02_seed_db] db already seeded")
    console.log("[02_seed_db] skipping seed db")
    next();
    return;
  }

  const villages = [
    {id:15, name:"Varni", postcode:313603},
    {id:14, name:"Sunderpura", postcode:313603},
    {id:13, name:"Hinta", postcode:313603},
    {id:12, name:"Dharta", postcode:313603},
    {id:11, name:"Badgaon", postcode:313603}
  ];

  const users = [
    {username:"lewis", email:"lewisdaly@me.com", password:"Password1!"},
    {username:"marvi", email:"marvi@marvi.co.in", password:"marvi"}
  ];

  //TODO: progamaticlly generate months
  const months = [
    {month:"2004-11"},{month:"2004-12"},{month:"2005-01"},{month:"2005-02"},{month:"2005-03"},{month:"2005-04"},{month:"2005-05"},{month:"2005-06"},{month:"2005-07"},{month:"2005-08"},{month:"2005-09"},{month:"2005-10"},{month:"2005-11"},{month:"2005-12"},{month:"2006-01"},{month:"2006-02"},{month:"2006-03"},{month:"2006-04"},{month:"2006-05"},{month:"2006-06"},{month:"2006-07"},{month:"2006-08"},{month:"2006-09"},{month:"2006-10"},{month:"2006-11"},{month:"2006-12"},{month:"2007-01"},{month:"2007-02"},{month:"2007-03"},{month:"2007-04"},{month:"2007-05"},{month:"2007-06"},{month:"2007-07"},{month:"2007-08"},{month:"2007-09"},{month:"2007-10"},{month:"2007-11"},{month:"2007-12"},{month:"2008-01"},{month:"2008-02"},{month:"2008-03"},{month:"2008-04"},{month:"2008-05"},{month:"2008-06"},{month:"2008-07"},{month:"2008-08"},{month:"2008-09"},{month:"2008-10"},{month:"2008-11"},{month:"2008-12"},{month:"2009-01"},{month:"2009-02"},{month:"2009-03"},{month:"2009-04"},{month:"2009-05"},{month:"2009-06"},{month:"2009-07"},{month:"2009-08"},{month:"2009-09"},{month:"2009-10"},{month:"2009-11"},{month:"2009-12"},{month:"2010-01"},{month:"2010-02"},{month:"2010-03"},{month:"2010-04"},{month:"2010-05"},{month:"2010-06"},{month:"2010-07"},{month:"2010-08"},{month:"2010-09"},{month:"2010-10"},{month:"2010-11"},{month:"2010-12"},{month:"2011-01"},{month:"2011-02"},{month:"2011-03"},{month:"2011-04"},{month:"2011-05"},{month:"2011-06"},{month:"2011-07"},{month:"2011-08"},{month:"2011-09"},{month:"2011-10"},{month:"2011-11"},{month:"2011-12"},{month:"2012-01"},{month:"2012-02"},{month:"2012-03"},{month:"2012-04"},{month:"2012-05"},{month:"2012-06"},{month:"2012-07"},{month:"2012-08"},{month:"2012-09"},{month:"2012-10"},{month:"2012-11"},{month:"2012-12"},{month:"2013-01"},{month:"2013-02"},{month:"2013-03"},{month:"2013-04"},{month:"2013-05"},{month:"2013-06"},{month:"2013-07"},{month:"2013-08"},{month:"2013-09"},{month:"2013-10"},{month:"2013-11"},{month:"2013-12"},{month:"2014-01"},{month:"2014-02"},{month:"2014-03"},{month:"2014-04"},{month:"2014-05"},{month:"2014-06"},{month:"2014-07"},{month:"2014-08"},{month:"2014-09"},{month:"2014-10"},{month:"2014-11"},{month:"2014-12"},{month:"2015-01"},{month:"2015-02"},{month:"2015-03"},{month:"2015-04"},{month:"2015-05"},{month:"2015-06"},{month:"2015-07"},{month:"2015-08"},{month:"2015-09"},{month:"2015-10"},{month:"2015-11"},{month:"2015-12"},{month:"2016-01"},{month:"2016-02"},{month:"2016-03"},{month:"2016-04"},{month:"2016-05"},{month:"2016-06"},{month:"2016-07"},{month:"2016-08"},{month:"2016-09"},{month:"2016-10"},{month:"2016-11"},{month:"2016-12"},{month:"2017-01"},{month:"2017-02"},{month:"2017-03"},{month:"2017-04"},{month:"2017-05"},{month:"2017-06"},{month:"2017-07"},{month:"2017-08"},{month:"2017-09"},{month:"2017-10"},{month:"2017-11"},{month:"2017-12"},{month:"2018-01"},{month:"2018-02"},{month:"2018-03"},{month:"2018-04"},{month:"2018-05"},{month:"2018-06"},{month:"2018-07"},{month:"2018-08"},{month:"2018-09"},{month:"2018-10"},{month:"2018-11"},{month:"2018-12"},{month:"2019-01"},{month:"2019-02"},{month:"2019-03"},{month:"2019-04"},{month:"2019-05"},{month:"2019-06"},{month:"2019-07"},{month:"2019-08"},{month:"2019-09"},{month:"2019-10"},{month:"2019-11"},{month:"2019-12"},{month:"2020-01"},{month:"2020-02"},{month:"2020-03"},{month:"2020-04"},{month:"2020-05"},{month:"2020-06"},{month:"2020-07"},{month:"2020-08"},{month:"2020-09"},{month:"2020-10"},{month:"2020-11"},{month:"2020-12"},{month:"2021-01"},{month:"2021-02"},{month:"2021-03"},{month:"2021-04"},{month:"2021-05"},{month:"2021-06"},{month:"2021-07"},{month:"2021-08"},{month:"2021-09"},{month:"2021-10"},{month:"2021-11"},{month:"2021-12"},{month:"2022-01"},{month:"2022-02"},{month:"2022-03"},{month:"2022-04"},{month:"2022-05"},{month:"2022-06"},{month:"2022-07"},{month:"2022-08"},{month:"2022-09"},{month:"2022-10"},{month:"2022-11"},{month:"2022-12"},{month:"2023-01"},{month:"2023-02"},{month:"2023-03"},{month:"2023-04"},{month:"2023-05"},{month:"2023-06"},{month:"2023-07"},{month:"2023-08"},{month:"2023-09"},{month:"2023-10"},{month:"2023-11"},{month:"2023-12"},{month:"2024-01"},{month:"2024-02"},{month:"2024-03"},{month:"2024-04"},{month:"2024-05"},{month:"2024-06"},{month:"2024-07"},{month:"2024-08"},{month:"2024-09"},{month:"2024-10"},{month:"2024-11"},{month:"2024-12"},{month:"2025-01"},{month:"2025-02"},{month:"2025-03"},{month:"2025-04"},{month:"2025-05"},{month:"2025-06"},{month:"2025-07"},{month:"2025-08"},{month:"2025-09"},{month:"2025-10"},{month:"2025-11"},{month:"2025-12"},{month:"2026-01"},{month:"2026-02"},{month:"2026-03"},{month:"2026-04"},{month:"2026-05"},{month:"2026-06"},{month:"2026-07"},{month:"2026-08"},{month:"2026-09"},{month:"2026-10"},{month:"2026-11"},{month:"2026-12"},{month:"2027-01"},{month:"2027-02"},{month:"2027-03"},{month:"2027-04"},{month:"2027-05"},{month:"2027-06"},{month:"2027-07"},{month:"2027-08"},{month:"2027-09"},{month:"2027-10"},{month:"2027-11"},{month:"2027-12"},{month:"2028-01"},{month:"2028-02"},{month:"2028-03"},{month:"2028-04"},{month:"2028-05"},{month:"2028-06"},{month:"2028-07"},{month:"2028-08"},{month:"2028-09"},{month:"2028-10"}
  ];

  //This is a fix as the wellIds have (for some reason) been displaced by 10.
  //Iterate through both currentReadings and pastReadings, and add 10 to each resourceId
  const displacedCurrentReadings = currentReadings.map(currentReading => {
    let villageIdStr = currentReading.villageId.toString();
    if (villageIdStr.length > 2) {
      currentReading.villageId = parseInt(villageIdStr.substring(0,2));
    }

    currentReading.resourceId = currentReading.resourceId + 10;
    return currentReading;
  });

  const displacedPastReadings = pastReadings.map(pastReading => {
    let villageIdStr = pastReading.villageId.toString();
    if (villageIdStr.length > 2) {
      pastReading.villageId = parseInt(villageIdStr.substring(0,2));
    }

    pastReading.resourceId = pastReading.resourceId + 10;
    return pastReading
  })

  Promise.all([
    //Create models here
    createModel(app.models.Reading, displacedPastReadings, true),
    createModel(app.models.Resource, resources, true),
    createModel(app.models.Village, villages, true),
    createModel(app.models.Reading, displacedCurrentReadings, false),
    createModel(app.models.User, users, false),
    createModel(app.models.Month, months, true),
  ])
  .then(() => {
    console.log("[02_seed_db] finshed seeding DB.");

    //create seed file
    fs.openSync('server/hasDBSeeded', 'w');

    next();
  })
  .catch((err) => {
    console.log("Error", err);

    //create seed file - even though we errored out ...
    fs.openSync('server/hasDBSeeded', 'w');

    next();
  })
}

const createModel = (model, list, skipUpdate) => {
  var count = list.length;
  return new Promise((resolve, reject) => {
    list.forEach((item) => {
      model.create(item, { skipUpdateModels:skipUpdate }, (err, model) => {
        if (err) reject(err);

        count--;
        if (count === 0) {
          resolve();
        }
      });
    })
  });
};
