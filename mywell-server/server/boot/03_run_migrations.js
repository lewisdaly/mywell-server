"use strict";

const calculateStats = require('./migrations/0001_calculate_stats.js');


module.exports = function(app, next) {
  const myapp = app;
  console.log('[03_run_migrations] Starting migrations');
  calculateStats(app)
  .then(() => next())
  .catch(err => {
    console.log(err);
  });


}
