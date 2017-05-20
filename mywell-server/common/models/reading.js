var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;
const Enums = require('../Enums');
const Utils = require('../Utils');
const ExcelReader = require('../ExcelReader');
const fs = require('fs');

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err){
    return false;
  }
}

const getError = function(code, errorMessage) {
  const getError = new Error(errorMessage);
  getError.statusCode = code;
  return getError;
};

module.exports = function(Reading) {
  /**
   * Get past readings for display on map
   * returns a list of last 3 * 52 weeks with readings attached
   */
  Reading.remoteMethod('getReadingsByWeek', {
   accepts: [
     {arg: 'postcode', type: 'number', description: 'The postcode that this resource is in'},
     {arg: 'resourceId', type: 'number', description: 'The resourceId of this resource'},
   ],
   description: 'Gets past readings in 3 * 52 week intervals. Missing readings have a value of null.',
   returns: {arg: 'response', type: 'object', root:true},
   http: {path: '/readingsByWeek', verb: 'get', status: 200}
  });

  Reading.getReadingsByWeek = (postcode, resourceId) => {
    const weeks = weekStartForWeeksAgo(52 * 3);

    //TODO: deal with invalid dates - or is that elsewhere?
    const getMondayForDate = (date) => {
      const readingMoment = moment(date).startOf('week').add(1, 'days');    // set to the first day of this week, 12:00 am
      return readingMoment.format("YYYYMMDD");
    }

    const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

    return Reading.find({where:{and:[{postcode:postcode},{resourceId}]}, order: "DATE ASC"})
      .then(readings => {
        const readingDates = {} //Map with key: monday (string), value: average value

        let currentMonday = getMondayForDate(readings[0].date);
        let currentReadingWeek = []; //array of readings for this week
        readings.forEach(reading => {
          let nextMonday = getMondayForDate(reading.date);

          if (nextMonday === 'Invalid date') {
            return
          }

          if (nextMonday === currentMonday) {
            //keep accumulating!
            currentReadingWeek.push(reading.value);
          } else {
            readingDates[currentMonday] = average(currentReadingWeek);

            currentMonday = nextMonday;
            currentReadingWeek = [reading.value];
          }
        });
        //Do the final average and add
        if (currentMonday !== 'Invalid date') {
          readingDates[currentMonday] = average(currentReadingWeek);
        }

        //Now iterate through the weeks, and assign the reading:
        const readingWeeks = weeks.map(week => {
          const key = week.format("YYYYMMDD");
          const reading = readingDates[key];
          if (isNullOrUndefined(reading)) {
            return null; //make sure we actually return null
          }
          return reading.toFixed(2);
        });

        return {
          readings: readingWeeks,
          weeks: weeks,
        };
      });
  }

  /**
   * Iteratively go back a bunch of weeks
   */
  const weekStartForWeeksAgo = (weeksAgo, startDate, weeks) => {
    if (isNullOrUndefined(weeks)) {
      weeks = [];
    }

    if (weeksAgo == 0) {
      return weeks;
    }

    //First time - set everything up
    if (isNullOrUndefined(startDate)) {
      //Get monday UTC
      startDate = moment.utc().startOf('week').add(1, 'days');
      weeks = [startDate];

      return weekStartForWeeksAgo(weeksAgo - 1, startDate, weeks);
    }

    let previousWeekStart = startDate.clone().subtract(1, 'week');
    weeks.unshift(previousWeekStart);
    return weekStartForWeeksAgo(weeksAgo -1 , previousWeekStart, weeks);
  }


  /**
   * Endpoint for excel uploading
   * I'm pretty sure we can refactor this to use promises, but this works for now
   */
  Reading.remoteMethod('processExcelFile', {
    accepts: [
     {arg: 'container', type: 'string', description: 'name of the container the file was uploaded to'},
     {arg: 'name', type: 'string', description: 'name of the file uploaded'}
    ],
    description: 'Processes a file that has been uploaded to the given container',
    returns: {arg: 'response', type: 'json', root:true},
    http: {path: '/processExcelFile', verb: 'get', status:200}
  });

  Reading.processExcelFile = (container, name) => {
    const filePath = `/usr/src/app/storage/${container}/${name}`;
    let parsedRows = null;

    const sleep = (seconds) => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, seconds * 1000)
      });
    }

    return Promise.resolve(true)
    .then(() => {
      console.log(container, name);
      if (!fileExists(filePath)) {
        console.log('file does not exist', filePath);
        throw getError(404, `File does not exist:${filePath}`);
      }
    })
    .then(() => ExcelReader.readExcelFile(filePath))
    .then(worksheets => {
      return Promise.all(worksheets.map(worksheet => {
        if (!ExcelReader.validateWorksheet(worksheet, 'reading')) {
          console.log("worksheet is invalid")
          return undefined;
        }
        parsedRows = ExcelReader.processWorksheet(worksheet, 'reading');

        return Promise.all(parsedRows.rows.map(reading => {
          return Reading.create(reading, { skipUpdateModels:true})
            .catch(err => {
              console.log("excel import - row error", err.message);
            });
        }));
      }));
    })
    //Find stats from the saved resources
    .then(_createdReadings => {
      let created = 0;
      let parsedRows = 0;
      let warnings = 0;

      _createdReadings.forEach(_worksheet => {
        _worksheet && _worksheet.forEach(_row => {
          parsedRows++;
          if (!_row) {
            warnings++;
          } else {
            created++;
          }
        });
      });

      return {
        created: created,
        parsedRows: parsedRows,
        warnings: warnings
      };
    })
    .catch(err => {
      console.log(err)
      throw err;
    });
  }

  /**
   * Get's the most current reading for a resource within a week
   * returns null if it can't be found
   */
  Reading.getCurrentReading = (resourceId, postcode) => {

    console.log("getCurrentReading", resourceId, postcode);

    const now = moment();
    const upperDate = now.clone();
    const lowerDate = now.clone().subtract(7, 'days');
    const filter = {
      where: {
        and: [
          {postcode: postcode},
          {date: {gte: lowerDate.format()}},
          // {date: {lte: upperDate.format()}}, -- doesn't work. screw you loopback
          {resourceId: resourceId}
        ]
      },
      order: 'date DESC'
    };

    return Reading.find(filter)
      .then(readings => {
        const filteredReadings = readings.filter(reading => moment(reading.date).isSameOrBefore(upperDate) &&
                                                            moment(reading.date).isSameOrAfter(lowerDate));

        if (filteredReadings.length === 0) {
          return Promise.reject(Utils.getError(404, `currentReading not found for ${resourceId}`));
        }
        return filteredReadings[0];
      });
  }



  //TODO: before saving, we can add the village id, implied from the resource id.


  /**
   * Before saving, validate, and update the correct resource table
   */
   Reading.observe('before save', function updateModels(ctx, next) {
    //get app
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }


    //check to see if new reading is more recent  - if so, update the resource table
    const reading = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    // Use a double filter, instead of find by id {"where":{"and": [{"postcode":"123123"}, {"id":123}]}}
    Reading.app.models.resource.find({where:{and: [{id:reading.resourceId},{postcode:reading.postcode}]}}, (err, resources) => {
      if (err) next(err);

      if (isNullOrUndefined(resources) || isNullOrUndefined(resources[0])) {
        return next(new Error("resource doesnt exist!"));
      }

      let resource = resources[0];

      //check to see if this a new reading, or a reading on the same day
      const newEntry = moment(reading.date).isSameOrAfter(resource.last_date);
      if (newEntry) {
        resource.updateAttributes(
          {last_date:reading.date, last_value:reading.value}, (err, updatedResource) => {
            if (err)  next(err);

             next();
        });
      } else {
        let err = new Error("Reading recorded, but resource not updated. A newer reading exists.")
        err.statusCode = 206;
        return next(err);
      }
    });
   });
};
