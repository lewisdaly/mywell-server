"use strict";

/* add your migrations here */
const migrations = [
  require('./migrations/0001_calculate_stats.js'),
];

module.exports = function(app, next) {
  console.log('[03_run_migrations] Starting migrations');

  let idx = 0;
  migrations.reduce(function(prevPromise, migration) {
    return prevPromise
      .then(() => {
        return;
      })
      .then(() => app.models.Migration.hasCompleted(migration.name))
      .then(completed => {
        if (completed === true) {
          console.log(`[${migration.name}] already run`);
          return true;
        }

        return migration.migration(app)
          .then(() => {
            console.log(`[${migration.name}] finished running`);
            return app.models.Migration.create({name:migration.name});
          })
          .catch(err => {
            console.log(`[03_run_migrations] error running: ${migration.name}, ${err}`);
          });
      })
      .then(() => {
        if (idx === migrations.length - 1) {
          console.log('[03_run_migrations] finished running migrations');
          next();
        }
        idx = idx + 1;
        return
      })
      .catch(err => {
        console.log(`[03_run_migrations] error running: ${migration.name}, ${err}`);
      });
  }, Promise.resolve([]));



}


// module.exports = function(app, next) {
//   const myapp = app;
//   console.log('[03_run_migrations] Starting migrations');
//
//   app.models.Migration.hasCompleted('0001_calculate_stats')
//   .then(completed => {
//     if (completed === true) {
//       console.log("[0001_calculate_stats] already run");
//     }
//     return calculateStats(app)
//       .then(() => {
//         return app.models.Migration.create({name:'0001_calculate_stats'});
//       })
//   })
//     .then(() => next())
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// }
