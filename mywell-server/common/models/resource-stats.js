'use strict';

var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;
const Enums = require('../Enums');
const Utils = require('../Utils');
const app = require('../../server/server');

module.exports = function(ResourceStats) {

  ResourceStats.updateLastMonthStats = function() {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
      ResourceStats.calculateStats(null, cb);
    });
  }

  ResourceStats.remoteMethod(
    'getDifferenceFromJune',
    {
      description: 'Gets the difference in the current value from the value last June',
      accepts: [
        {arg: 'resourceType', type:'string', description:'one of [well, raingauge, checkdam], required for village or postcode', required:false},
        {arg: 'readingType', type:'string', description:'one of [individual, village, postcode]', required:true},
        {arg: 'resourceId', type:'number', description:'resourceId or villageId', required:true},
        {arg: 'postcode', type:'number', description:'postcode', required:true}
      ],
      returns: {arg: 'body', type: 'object', root: true},
      http: {path: '/getDifferenceFromJune', verb: 'get', status:200},
    }
  );

  ResourceStats.getDifferenceFromJune = (resourceType, readingType, resourceId, postcode) => {

    //call getClosestReadingFromDate for this object
    //Get the current reading Reading.getCurrentReading if INDIVIDUAL
    //Get the current village average from ResourceStats.getCurrentVillageAverage if village
    //  else, get it from somewhere else...
    //Do maths
    const date = ResourceStats.getLastJune();

    return Promise.resolve(true)
    .then(() => {
      switch (readingType) {
        case Enums.ReadingType.INDIVIDUAL:
          return Promise.all([
            ResourceStats.getIndividualReadingFromDate(date, resourceId, postcode),
            Reading.getCurrentReading(resouceId, postcode)
          ]);
        case Enums.ReadingType.VILLAGE:
          return Promise.all([
            ResourceStats.getVillageReadingFromDate(date, resourceType, resourceId),
            ResourceStats.getCurrentVillageAverage(resourceId)
          ]);
        case Enums.ReadingType.POSTCODE:
          return ResourceStats.getPostcodeReadingFromDate(date, resourceType, postcode);
        default:
          return Utils.getError(`404 ReadingType not found ${readingType}`)
      }
    })
    .then(results => {
      const pastReading = results[0];
      const currentReading = results[1];

    })



  }

  /**
   * Note- this may return a completely off date (eg 3 years ago
     in winter), but return it anyway, and let the user decide
     what that want to do with it

   * @param date (momentjs) - defaults to june 1st (summer)
   * @param resourceType - [well, raingauge, checkdam]  see Enums.resourceType
   * @param readingType - [individual, village, postcode] see Enums.readingType
   * @param resourceId - 2 digits for well, 4 for village, 6 for postcode
   * @returns {
      value - float: the reading for the requested resource
      foundDate - date: the closest date for the reading
    }
  */
  ResourceStats.getClosestReadingFromDate = (date, resourceType, readingType, resourceId) => {
    if (isNullOrUndefined(date)) {
      date = ResourceStats.getLastJune();
    }

    switch (readingType) {
      case Enums.ReadingType.INDIVIDUAL:
        return ResourceStats.getIndividualReadingFromDate(date, resourceId);
      case Enums.ReadingType.VILLAGE:
        return ResourceStats.getVillageReadingFromDate(date, resourceType, resourceId);
      case Enums.ReadingType.POSTCODE:
        return ResourceStats.getPostcodeReadingFromDate(date, resourceType, resourceId);
      default:
        return Utils.getError(`404 ReadingType not found ${readingType}`)
    }
  }

  /* gets the last june as momentjs */
  ResourceStats.getLastJune = () => {
    const now = moment();
    let juneFirstYear = now.year();

    if (now.month() < 5) juneFirstYear--;

    return moment(`${juneFirstYear}-06-01`);
  }

  ResourceStats.getIndividualReadingFromDate = (date, resourceId, postcode) => {
    //select value, date from reading where resourceId = 1352 order by ABS(DATEDIFF(date, STR_TO_DATE("2016-06-01", "%Y-%m-%d"))) limit 1;
    const query = `SELECT CAST(AVG(value) AS CHAR(255)) as valueStr, date FROM reading
                   WHERE resourceId = ${resourceId} AND postcode = ${postcode}
                   ORDER BY ABS(DATEDIFF(date, STR_TO_DATE(${date.format("YYYY-MM-DD")}, "%Y-%m-%d"))) limit 1;`;

    return Utils.sqlQuery(app, query)
      .then(results => {
        if (results.length === 0) {
          return Promise.reject(Utils.getError(404, `No closest reading found for date ${date}, ${resouceId}`));
        }
        //Parse string back to decimal, return only one
        return {
          value: parseFloat(results[0].valueStr),
          date: results[0].date,
        };
      });
  }

  /**
   * gets the average of the village for the months of the given date
   */
  ResourceStats.getVillageReadingFromDate = (date, resourceType, villageId, postcode) => {
    const minResourceId = villageId.toString() + '00';
    const maxResourceId = villageId.toString() + '99';
    const monthStr = moment(date).format("YYYY-MM");

    //select AVG(ave_reading) as value from resource_stats where resourceId > 1499 AND resourceId < 1600 AND month = "2014-06";
    const query = `SELECT CAST(AVG(ave_reading) as CHAR(255)) as valueStr, month
                   FROM resource_stats
                   WHERE resourceId >= ${minResourceId} AND
                        resourceId <= 1${maxResourceId} AND
                        postcode = ${postcode} AND
                        month = "${monthStr}" AND
                        resourceType = "${resourceType}"`

    return Utils.sqlQuery(app, query)
      .then(results => {
        if (results.length === 0) {
          return Promise.reject(Utils.getError(404, `No closest reading found for date ${date}, ${resouceId}`));
        }
        //Parse string back to decimal, return only one
        return {
          value: parseFloat(results[0].valueStr),
          date: moment(results[0].month),
        };
      });
  }

  /**
   * gets the average of the village for the months of the given date
   */
  ResourceStats.getPostcodeReadingFromDate = (date, resourceType, postcode) => {
    const monthStr = moment(date).format("YYYY-MM");

    //select AVG(ave_reading) as value from resource_stats where resourceId > 1499 AND resourceId < 1600 AND month = "2014-06";
    const query = `SELECT CAST(AVG(ave_reading) as CHAR(255)) as valueStr, month
                   FROM resource_stats
                   WHERE postcode  = ${postcode} AND
                        month = "${monthStr}" AND
                        resourceType = "${resourceType}"`

    return Utils.sqlQuery(app, query)
      .then(results => {
        if (results.length === 0) {
          return Promise.reject(Utils.getError(404, `No closest reading found for date ${date}, ${resouceId}`));
        }
        //Parse string back to decimal, return only one
        return {
          value: parseFloat(results[0].valueStr),
          date: moment(results[0].month),
        };
      });

  }

  /**
   * Calculate latest stats
   * month defaults to last month
   */
   ResourceStats.remoteMethod(
     'calculateStats',
     {
        accepts: [
          {arg: 'month', type:'string', description:'month string in the format of YYYY-mm'},
        ],
        'description': 'calculates and saves the stats for a given month. Defaults to last month',
        http: {path: '/calculateStats', verb: 'get', status: 200},
        returns: {arg: 'updated', type:'object'}
     }
   );

   ResourceStats.calculateStats = function(month, cb) {
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
    const query = `SELECT resourceId, postcode, DATE_FORMAT(date, '%Y-%m') as month, CAST(AVG(value) AS CHAR(255)) as ave_reading, villageId
                  FROM reading
                  WHERE DATE_FORMAT(date, '%Y-%m') = "${month}"
                  GROUP BY DATE_FORMAT(date, '%Y-%m'), resourceId;`;
    const datasource = ResourceStats.dataSource;
    ResourceStats.queryDatasource(query, datasource)
    .then(results => {
      return Promise.all(
        results.map(result => {

          if (!isNullOrUndefined(result.ave_reading)) {
            result.ave_reading = parseFloat(result.ave_reading);
          }
          result.villageId = findVillageIdFromResourceId(result.resourceId);
          return ResourceStats.upsert(result)
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

   ResourceStats.queryDatasource = function(query, datasource) {
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
    ResourceStats.remoteMethod(
      'getHistoricalResourceAverages',
      {
         accepts: [
           {arg: 'resourceId', type:'number', description:'resourceId', required:true},
           {arg: 'postcode', type:'number', description:'postcode. defaults to 510934', required:false},
           {arg: 'startMonth', type:'string', description:'month string in the format of YYYY-mm'},
           {arg: 'endMonth', type:'string', description:'month string in the format of YYYY-mm'}
         ],
         description: 'Get an array of average readings for a date range. Defaults to last year',
         http: {path: '/getHistoricalResourceAverages', verb: 'get', status: 200},
         returns: {arg: 'readings', type:'JSON'}
      }
    );

    ResourceStats.getHistoricalResourceAverages = function(resourceId, postcode, startMonth, endMonth, cb) {
      if (isNullOrUndefined(startMonth)) {
        startMonth = moment().subtract(13, 'months').format('Y-M');
      }

      if (isNullOrUndefined(endMonth)) {
        endMonth = moment().subtract(1, 'months').format('Y-M');
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
      const datasource = ResourceStats.dataSource;
      ResourceStats.queryDatasource(query, datasource)
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

    ResourceStats.remoteMethod(
      'getCurrentPostcodeAverage',
      {
       accepts: [
         {arg: 'postcode', type:'number', description:'postcode. defaults to 313603', required:false},
         {arg: 'resourceType', type:'string', description:'Resourcetype [well, checkdam, raingauge]. Defaults to well', required:false},
         {arg: 'month', type:'string', description:'month string in the format of YYYY-mm, debugging use only - use historic as it is more optimized'}
       ],
       description: 'Gets the running average for the postcode for this month',
       http: {path: '/getCurrentPostcodeAverage', verb: 'get', status: 200},
       returns: {arg: 'body', type: 'object', root: true},
      }
    );

    ResourceStats.getCurrentPostcodeAverage = function(postcode, resourceType, month) {
      if (isNullOrUndefined(month)) {
        month = moment().format('Y-MM');
      }

      console.log(month);

      if (isNullOrUndefined(resourceType)) {
        resourceType = Enums.ResourceType.WELL;
      }

      if (isNullOrUndefined(postcode)) {
        postcode = 313603;
      }

      const query = `
      SELECT CAST(AVG(value) AS CHAR(255)) as avgReadingStr
      FROM reading JOIN
           resource ON reading.resourceId = resource.id
      WHERE reading.postcode = ${postcode} AND
            DATE_FORMAT(reading.date, '%Y-%m') = "${month}" AND
            resource.type = "${resourceType}"
      GROUP BY reading.postcode, reading.postcode;
      `;

      console.log(query);

      const datasource = ResourceStats.dataSource;
      return ResourceStats.queryDatasource(query, datasource)
        .then(results => {

          if (isNullOrUndefined(results[0])) {
            return Promise.reject(Utils.getError('404', `No average reading for postcode: ${postcode} ,resourceType: ${resourceType} month: ${month}`));
          }

          const avgReading = parseFloat(results[0].avgReadingStr);
          return avgReading;
        });
    }

    ResourceStats.remoteMethod(
      'getCurrentVillageAverage',
      {
       accepts: [
         {arg: 'villageId', type:'number', description:'resourceId', required:true},
         {arg: 'postcode', type:'number', description:'postcode. defaults to 313603', required:false},
         {arg: 'resourceType', type:'string', description:'Resourcetype [well, checkdam, raingauge]. Defaults to well', required:false},
         {arg: 'month', type:'string', description:'month string in the format of YYYY-mm, debugging use only - use historic as it is more optimized'}
       ],
       description: 'Gets the running average for the village for this month',
       http: {path: '/getCurrentVillageAverage', verb: 'get', status: 200},
       returns: {arg: 'avgReading', type:'JSON'}
      }
    );

    ResourceStats.getCurrentVillageAverage = function(villageId, postcode, resourceType, month) {
      if (isNullOrUndefined(month)) {
        month = moment().format('Y-MM');
      }

      if (isNullOrUndefined(resourceType)) {
        resourceType = Enums.ResourceType.WELL;
      }

      if (isNullOrUndefined(postcode)) {
        postcode = 313603;
      }

      const query = `
      SELECT CAST(AVG(value) AS CHAR(255)) as avgReadingStr
      FROM reading JOIN
           resource ON reading.resourceId = resource.id
      WHERE reading.villageId = ${villageId} AND
            reading.postcode = ${postcode} AND
            DATE_FORMAT(reading.date, '%Y-%m') = "${month}" AND
            resource.type = "${resourceType}"
      GROUP BY reading.villageId, reading.postcode;

      `;

      const datasource = ResourceStats.dataSource;
      return ResourceStats.queryDatasource(query, datasource)
        .then(results => {

          if (isNullOrUndefined(results[0])) {
            return Promise.reject(Utils.getError('404', `No average reading for villageId: ${villageId}, postcode: ${postcode} ,resourceType: ${resourceType} month: ${month}`));
          }

          const avgReading = parseFloat(results[0].avgReadingStr);
          return avgReading;
        });
    }

    //TODO: abstract out below to get:
    // getVillageAverageForMonth
    // getPostcodeAverageForMonth

    ResourceStats._getHistoricalVillageAverages = function(villageId, postcode, resourceType, startMonth, endMonth) {
      return new Promise((resolve, reject) => {
        ResourceStats.getHistoricalVillageAverages(villageId, postcode, resourceType, startMonth, endMonth, (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        });
      });
    }

    /**
     * Get an array of average village readings for a date range
     * defaults to last year
     *
     */
     ResourceStats.remoteMethod(
       'getHistoricalVillageAverages',
       {
          accepts: [
            {arg: 'villageId', type:'number', description:'resourceId', required:true},
            {arg: 'postcode', type:'number', description:'postcode. defaults to 313603', required:false},
            {arg: 'resourceType', type:'string', description:'Resourcetype - not yet used', required:false},
            {arg: 'startMonth', type:'string', description:'month string in the format of YYYY-mm'},
            {arg: 'endMonth', type:'string', description:'month string in the format of YYYY-mm'}
          ],
          description: 'Get an array of average village values for a date range. Defaults to last year',
          http: {path: '/getHistoricalVillageAverages', verb: 'get', status: 200},
          returns: {arg: 'readings', type:'object'}
       }
     );

     ResourceStats.getHistoricalVillageAverages = function(villageId, postcode, resourceType, startMonth, endMonth, cb) {
       if (isNullOrUndefined(startMonth)) {
         startMonth = moment().subtract(13, 'months').format('Y-M');
       }

       if (isNullOrUndefined(endMonth)) {
         endMonth = moment().subtract(1, 'months').format('Y-M');
       }

       if (isNullOrUndefined(postcode)) {
         postcode = 313603;
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

      const datasource = ResourceStats.dataSource;
      ResourceStats.queryDatasource(query, datasource)
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
