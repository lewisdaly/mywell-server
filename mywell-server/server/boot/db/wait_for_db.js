
const _waitForDataBaseConnection = (db, ttl) => {
  console.log("wait for database connection");
  return new Promise ((resolve, reject) => {
    db.ping((err) => {
      if (err && err.code === "ECONNREFUSED") {
        if (ttl < 1) {
          return reject(new Error("DB didn\'t come up"));
        }

        console.log("Waiting for DB", ttl);
        setTimeout(() => {_waitForDataBaseConnection(db, --ttl);}, 10000);
        return;
      }

      if (err) return reject(err);

      resolve(null, true);
    });
  });
};

module.exports = _waitForDataBaseConnection;
