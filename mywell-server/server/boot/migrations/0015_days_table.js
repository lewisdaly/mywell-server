"use strict";

const loopback = require("loopback");
const fs = require('fs');
const moment = require('moment');

const isNullOrUndefined = require('util').isNullOrUndefined;
const Utils = require('../../../common/Utils');

const name = '0015_days_table';
const log = (details) => {
  console.log(`     - [${name}] ${details}`)
};

const datesForRange = (startDateString, number) => {
  const startMoment = moment(startDateString).utc().startOf('day');
  const dates = [{date:startMoment.toDate()}];

  for (var i = 1; i < number; i++) {
    const newDate = startMoment.clone().add(i, 'days').toDate();
    dates.push({date:newDate});
  }

  return dates;
}

const saveWithPromise = (app, dates) => {
  return new Promise((resolve, reject) => {
    app.models.Day.create(dates, (err, obj) => {
      if (err) {
        return reject(err);
      }

      resolve(obj);
    });
  });
}

const runMigration = (app) => {
  log('running migration');

  //This is really sucky - we made an SQL query to do this job, but running it is quite tricky
  const dates = datesForRange('2010-01-01', 365 * 25);
  return saveWithPromise(app, dates)
    .then(() => console.log(`created ${dates.length} dates`))
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
}

module.exports = {
  name: name,
  migration: runMigration
};
