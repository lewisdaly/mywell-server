"use strict";
const cron = require('node-cron');
const exec = require('child_process').exec;

module.exports = function(app, next) {
  console.log("[04_setup_scheduler] setting up scheduler");
  const prefix = '[scheduler]'


  /* Monthly statistics update */
  cron.schedule('0 0 1 * *', function(){
    console.log(`${prefix} updating statistics`);
    app.models.resource_stats.updateLastMonthStats()
    .then(() => {
      console.log("updated last months stats");
    })
    .catch(err => {
      console.log(err);
    });
  });

  /* Daily database backups at 1am */
  cron.schedule('0 1 * * *', () => {
    console.log(`${prefix} Performing DB backup`);
    exec('/root/src/scripts/mysql_backup.sh', (error, stdout, stderr) => {
      console.log(`${prefix} stdout: ` + stdout);
      console.log(`${prefix} stderr: ` + stderr);
      if (error !== null) {
        console.log(`${prefix} exec error: ` + error);
      }
    });
  });

  next();
}
