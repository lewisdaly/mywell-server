'use strict';

var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Resourcestats) {

  Resourcestats.updateLastMonthStats = function() {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
      Resourcestats.calculateStats(null, cb);
    });
  }


  /**
   * Calculate latest stats
   * month defaults to last month
   */
   Resourcestats.remoteMethod(
     'calculateStats',
     {
        accepts: [
          {arg: 'month', type:'string', description:'month string in the format of YYYY-mm'},
        ],
        'description': 'calculates and saves the stats for a given month. Defaults to last month',
        http: {path: '/calculateStats', verb: 'get', status: 200},
        returns: {arg: 'updated', type:'JSON'}
     }
   );

   Resourcestats.calculateStats = function(month, cb) {
    if (isNullOrUndefined(month)) {
      month = moment().subtract(1, 'months').format('Y-M');
    }

    if (month.length !== 7) {
      let err = new Error('Month should be in format YYYY-mm');
      err.statusCode = 400;
      cb(err, 'Error parsing month');
    }

    const findVillageIdFromResourceId = (id) => {
      return parseInt(id.toString()[0]);
    }

    //We could probably be a bit stricter about the dates here, but lets just pass it onto MySQL
    const query = `SELECT resourceId, postcode, DATE_FORMAT(date, '%Y-%m') as month, AVG(value) as ave_reading, villageId
                  FROM reading
                  WHERE DATE_FORMAT(date, '%Y-%m') = "${month}"
                  GROUP BY DATE_FORMAT(date, '%Y-%m'), resourceId;`;
    const datasource = Resourcestats.dataSource;
    Resourcestats.queryDatasource(query, datasource)
    .then(results => {
      return Promise.all(
        results.map(result => {
          result.villageId = findVillageIdFromResourceId(result.resourceId);
          return Resourcestats.upsert(result)
        })
      )
    })
    .then(savedValues => {
      return cb(null, savedValues.length);
    })
    .catch(err => {
      cb(err);
    });

   }

   Resourcestats.queryDatasource = function(query, datasource) {
    return new Promise((resolve, reject) => {
      datasource.connector.query(query, (err, results) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(results);
      });
    });
   }

   /**
    * Get an array of average readings for a date range
    * defaults to last year
    *
    */
    Resourcestats.remoteMethod(
      'getResourceAverages',
      {
         accepts: [
           {arg: 'resourceId', type:'number', description:'resourceId', required:true},
           {arg: 'postcode', type:'number', description:'postcode. defaults to 510934', required:false},
           {arg: 'startMonth', type:'string', description:'month string in the format of YYYY-mm'},
           {arg: 'endMonth', type:'string', description:'month string in the format of YYYY-mm'}
         ],
         description: 'Get an array of average readings for a date range. Defaults to last year',
         http: {path: '/getResourceAverages', verb: 'get', status: 200},
         returns: {arg: 'readings', type:'JSON'}
      }
    );

    Resourcestats.getResourceAverages = function(resourceId, postcode, startMonth, endMonth, cb) {
      if (isNullOrUndefined(startMonth)) {
        startMonth = moment().subtract(12, 'months').format('Y-M');
      }

      if (isNullOrUndefined(endMonth)) {
        endMonth = moment().format('Y-M');
      }

      if (isNullOrUndefined(postcode)) {
        postcode = 510934;
      }

      //TODO: fix, this cast is ridiculous - its a workaround for the loopback-mysql converting decimals to integers
      const query = `
      SELECT MonthRange.month as month, CAST(CAST(ave_reading AS DECIMAL(12,4)) AS CHAR(255)) as aveReading
      FROM
        (SELECT * FROM resource_stats WHERE resourceid = ${resourceId} AND postcode = ${postcode}) AS SelectedStats
      RIGHT OUTER JOIN
        (SELECT * FROM Month where month >= "${startMonth}" AND Month <= "${endMonth}") as MonthRange
        ON SelectedStats.month = MonthRange.month;
      `
      const datasource = Resourcestats.dataSource;
      Resourcestats.queryDatasource(query, datasource)
      .then(results => {

        //Convert string back to number
        results = results.map(result => {
          if(isNullOrUndefined(result.aveReading)) {
            return result;
          }

          result.aveReading = parseFloat(result.aveReading);
          return result;
        })

        cb(null, results);
      })
      .catch(err => {
        cb(err);
      });
    }

    /**
     * Get an array of average village readings for a date range
     * defaults to last year
     *
     */
     Resourcestats.remoteMethod(
       'getVillageAverages',
       {
          accepts: [
            {arg: 'villageId', type:'number', description:'resourceId', required:true},
            {arg: 'postcode', type:'number', description:'postcode. defaults to 510934', required:false},
            {arg: 'resourceType', type:'string', description:'Resourcetype - not yet used', required:false},
            {arg: 'startMonth', type:'string', description:'month string in the format of YYYY-mm'},
            {arg: 'endMonth', type:'string', description:'month string in the format of YYYY-mm'}
          ],
          description: 'Get an array of average village values for a date range. Defaults to last year',
          http: {path: '/getVillageAverages', verb: 'get', status: 200},
          returns: {arg: 'readings', type:'JSON'}
       }
     );

     Resourcestats.getVillageAverages = function(villageId, postcode, resourceType, startMonth, endMonth, cb) {
       if (isNullOrUndefined(startMonth)) {
         startMonth = moment().subtract(12, 'months').format('Y-M');
       }

       if (isNullOrUndefined(endMonth)) {
         endMonth = moment().format('Y-M');
       }

       if (isNullOrUndefined(postcode)) {
         postcode = 510934;
       }

      //easier to do this in SQL:
      //TODO: fix, this cast is ridiculous - its a workaround for the loopback-mysql converting decimals to integers
      const query = `
      SELECT MonthRange.month, CAST(avgReadingVillage AS CHAR(255)) as aveReading
      FROM
        (SELECT AVG(ave_reading) as avgReadingVillage, villageId, month FROM resource_stats WHERE villageId=${villageId} AND postcode = "${postcode}" GROUP BY villageId, postcode, month) AS SelectedStats
      RIGHT OUTER JOIN
        (SELECT * FROM Month where month >= "${startMonth}" AND Month <= "${endMonth}") as MonthRange
      ON SelectedStats.month = MonthRange.month;
      `;

      const datasource = Resourcestats.dataSource;
      Resourcestats.queryDatasource(query, datasource)
      .then(results => {
        //Convert string back to number
        results = results.map(result => {
          if(isNullOrUndefined(result.aveReading)) {
            return result;
          }

          result.aveReading = parseFloat(result.aveReading);
          return result;
        })


        cb(null, results);
      })
      .catch(err => {
        cb(err);
      });
     }

};
