"use strict";

const calculateStats = require('./migrations/0001_calculate_stats.js');


module.exports = function(app, next) {
  const myapp = app;
  console.log('Starting migrations');
  calculateStats(app)
  .then(() => next())
  .catch(err => {
    console.log(err);
  });


}
