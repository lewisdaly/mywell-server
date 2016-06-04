"use strict";

var waitForDatabase = require("./db/wait_for_db");

module.exports = function (app, next) {
  console.log("Running db_migration");
  var db = app.dataSources['mysql-corp'];
  var maxConnectionAttempts = 100;
  waitForDatabase(db, maxConnectionAttempts)
    .then(() => {
      var environment = process.env.NODE_ENV;
      process.env.database_migration_status = "running";
      migrateOrUpdateDatabase(environment, db, function (err) {
        if (err) {
          console.log("Database migration had a failure:");
          console.log(err);
          process.exit(1);
        }
        process.env.database_migration_status = "finished";
        app.emit("database-ready");
        if (process.env.CLOSE_DB_AFTER_UPDATE === "true") {
          console.log("Closing the services after having performed the update:");

          console.log(" - Closing database connection");
          db.adapter.disconnect();
        }
        next();
      });
    })
    .catch(err => {
      console.log("Connection / Database migration had a failure:");
      console.log(err);
      process.exit(1);
      next(err);
    });

  function migrateOrUpdateDatabase(environment, db, cb) {
    db.autoupdate(function(err) {
      if (err) return cb(err);

      console.log("DB Migration complete")
      cb();
    });
  }
}

