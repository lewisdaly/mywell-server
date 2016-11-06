"use strict";
const cron = require('node-cron');

module.exports = function(app, next) {
  console.log("[04_setup_scheduler] setting up scheduler");

  cron.schedule('0 0 1 * *', function(){
    console.log("updating statistics");
    app.models.resource_stats.updateLastMonthStats()
    .then(() => {
      console.log("updated last months stats");
    })
    .catch(err => {
      console.log(err);
    });
  });

  next();
}
