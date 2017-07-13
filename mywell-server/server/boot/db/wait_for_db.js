
const _waitForDataBaseConnection = (db, ttl) => {
  console.log("wait for database connection");
  return new Promise ((resolve, reject) => {
    db.ping((err) => {
      const restartCodes = ["ECONNREFUSED", "ETIMEDOUT"]
      if (err && restartCodes.indexOf(err.code) > -1) {
        if (ttl < 1) {
          return reject(new Error("DB didn\'t come up"));
        }

        console.log("Waiting for DB", ttl);
        setTimeout(() => {_waitForDataBaseConnection(db, --ttl);}, 10000);
        return;
      }
      console.log("Err", err);
      if (err) return reject(err);

      resolve(null, true);
    });
  });
};

module.exports = _waitForDataBaseConnection;
