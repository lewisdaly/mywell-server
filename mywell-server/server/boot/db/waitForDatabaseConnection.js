
var promisify = require("../../../common/promisify");

var _waitForDatabaseConnection = (db, ttl, cb) => {
  db.ping(
    (err) => {
      if (err && err.code === "ECONNREFUSED") {
        if (ttl < 1) {
          return cb(new Error("Database never came up!"));
        }

        console.log("Database not up yet", ttl);
        setTimeout(() =>  { _waitForDatabaseConnection(db, --ttl, cb); }, 200);
        return;
      }

      // Handle more generic error.
      if (err) {
        return cb(err);
      }

      cb(null, true);
    }
  );
};

module.exports = function(db, ttl, cb_original) {
  return new Promise((resolve, reject) => {
    var cb = promisify.cbPromiseOverwriteFunction(resolve, reject, cb_original);
    _waitForDatabaseConnection(db, ttl, cb);
  });
};
