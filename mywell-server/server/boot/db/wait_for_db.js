
const _waitForDataBaseConnection = (db, ttl) => {
  return new Promise ((resolve, reject) => {
    console.log("pinging db");
    db.ping((err) => {
      console.log("pinged db");
      if (err && err.code === "ECONNREFUSED") {
        if (ttl < 1) {
          return reject(new Error("DB didn\'t come up"));
        }

        console.log("Waiting for DB", ttl);
        setTimeout(() => {_waitForDataBaseConnection(db, --ttl);}, 10000);
        return;
      }

      if (err) return reject(err);

      console.log('done?');

      resolve(null, true);
    });
  });
};

module.exports = _waitForDataBaseConnection;
