'use strict';

const isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Migration) {


  Migration.hasCompleted = (migrationName) => {
    return Migration.findOne({where:{name: migrationName}})
      .then(migration => !isNullOrUndefined(migration));
  }

};
