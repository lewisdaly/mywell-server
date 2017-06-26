module.exports = function (app) {
  console.log("[07_env_checker] running");

  console.log("\tENABLE_NOTIFICATIONS:", process.env.ENABLE_NOTIFICATIONS);
  console.log(`\tDB_HOST: ${process.env.DB_HOST}`);
  console.log(`\tDB_NAME: ${process.env.DB_NAME}`);
  console.log(`\tDB_PASSWORD: ${process.env.DB_PASSWORD}`);
  console.log(`\tDB_USER: ${process.env.DB_USER}`);
}
