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

const separator = ',';
const formatReadingTsv = (reading) => {
  return reading.postcode + separator +
         reading.resourceId + separator +
         moment(reading.date).format() + separator +
         reading.value;
}

const getHeadingTsv = () => {
  return 'pincode' + separator +
         'resourceId' + separator +
         'date' + separator +
         'value';
}

module.exports = function(Reading) {

  /**
   * Get past readings for display on map
   * returns a list of last 3 * 52 weeks with readings attached
   */
  Reading.remoteMethod('getReadingsByWeek', {
   accepts: [
     {arg: 'postcode', type: 'number', description: 'The postcode that this resource is in'},
     {arg: 'resourceId', type: 'number', description: 'The resourceId of this resource'},
     {arg: 'method', type:'string', description: 'The method for accumulating readings per week. Possible values: ["average" | "total"]. Defaults to "average"'}
   ],
   description: 'Gets past readings in 3 * 52 week intervals. Missing readings have a value of null.',
   returns: {arg: 'response', type: 'object', root:true},
   http: {path: '/readingsByWeek', verb: 'get', status: 200}
  });

  Reading.getReadingsByWeek = (postcode, resourceId, method) => {
    const weeks = weekStartForWeeksAgo(52 * 3);
    if (!method) {
      method = "average";
    }

    //TODO: deal with invalid dates - or is that elsewhere?
    const getMondayForDate = (date) => {
      const readingMoment = moment(date).startOf('week').add(1, 'days');    // set to the first day of this week, 12:00 am
      return readingMoment.format("YYYYMMDD");
    }

    let accumulateFunction = null;
    switch (method) {
      case 'average':
          accumulateFunction = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        break;
      case 'total':
        accumulateFunction = arr => arr.reduce( ( p, c ) => p + c, 0 );
        break;
      default:
        return Promise.reject(Utils.getError(400, `Unknown method value: ${method}. Allowable values: 'average' or 'total'`));
    }

    return Reading.find({where:{and:[{postcode:postcode},{resourceId: resourceId}]}, order: "DATE ASC"})
      .then(readings => {
        const readingDates = {} //Map with key: monday (string), value: accumulated value

        if (readings.length === 0) {
          return {
            readings: [],
            weeks: weeks
          };
        }

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
            readingDates[currentMonday] = accumulateFunction(currentReadingWeek);

            currentMonday = nextMonday;
            currentReadingWeek = [reading.value];
          }
        });
        //Do the final average and add
        if (currentMonday !== 'Invalid date') {
          readingDates[currentMonday] = accumulateFunction(currentReadingWeek);
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
   * TODO: a better implementation for this would be to have a separate data export pipeline.
   * this will do for now however.
   */
  Reading.remoteMethod('exportReadings', {
    accepts: [
      {arg: 'pincodes', type:'string', required: true, description: 'A comma seperated list of 1 or more pincodes to download readings for. '},
    ],
    description: 'Exports all readings for the given pincodes. Limited to 10,000 readings.',
    returns: {arg: 'body', type: 'file', root: true},
    http: {path: '/exportReadings', verb: 'get', status:200}
  });

  Reading.exportReadings = (pincodes) => {
    const pincodeList = pincodes.split(',')
      .filter(pincodeString => pincodeString.length > 0);

    if (pincodeList.length === 0) {
      return Promise.reject(new Error("Pincodes must be a comma separated list of 1 or more pincodes to download."));
    }

    if (pincodeList.length > 5) {
      return Promise.reject(new Error("Cannot search for more than 5 pincodes at a time."));
    }

    //eg. {"where": {"or": [{"postcode": 313603}]}}
    const or = pincodeList.map(postcode => {
      return { postcode };
    });
    const filter = {
      where: {
        or
      },
      limit: 10000,
      order: "date DESC"
    };

    /* potential solutions:
      - daily cron job that exports all readings for that day out (don't like, as bad for demo purposes)
      - try streaming to a file, and then redirect to that file
      - allow for direct sql connection (ew)
      - limit to just n years of data at a time? maybe 3
    */
    return Reading.app.models.reading.find(filter)
    .then(readings => {
      console.log('got readings', readings.length);

      //More efficent than using array.reduce
      const tsvArray = [];
      for (var i = 0; i < readings.length; i++) {
        tsvArray[i] = formatReadingTsv(readings[i]);
      }

      return getHeadingTsv() + '\n' + tsvArray.join('\n');
    });
  }

  //Make sure the exportReadings response is plain text
  Reading.afterRemote('exportReadings', function(context, remoteMethodOutput, next) {
    context.res.setHeader('Content-Type', 'text/plain');
    context.res.end(context.result);
  });

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



  Reading.remoteMethod('saveOrCreate', {
    accepts: [
      {
        arg: 'data',
        type: 'Reading',
        required: true,
        description: '{ Reading body }',
        http: { source: 'body' },
      }
    ],
    description: '',
    returns: {arg: 'response', type: 'object', root:true},
    http: {path: '/saveOrCreate', verb: 'post', status: 200}
  });


  Reading.saveOrCreate = (data) => {
    let reading = null;
    if (!data) {
      return Promise.reject(Utils.getError(400, 'Missing data'));
    }

    if (!data.date || !data.value || !data.villageId || !data.postcode || !data.resourceId) {
      return Promise.reject(Utils.getError(400, 'Fields required: date, value, villageId, postcode, resourceId'));
    }

    const filter = {
      "where": {
        "and":[
          {"date":data.date},
          {"postcode":data.postcode},
          {"resourceId":data.resourceId}
        ]
      }
    };

    return Reading.findOne(filter)
      .then(_reading => {
        reading = _reading;

        if (!reading) {
          return Reading.create(data);
        }

        reading.value = data.value;
        return reading.save();
      });
  };


  /**
   * Disallow future reading dates
   */
  Reading.observe('before save', function(ctx, next) {
    if (ctx.options && ctx.options.skipValidation) {
      return next();
    }

    if (!ctx.isNewInstance) {
      return next();
    }

    const reading = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    //To avoid timezone issues - make sure that the reading is over 1 day ahead
    if (moment(reading.date).isAfter(moment().add(1, 'days'))) {
      return next(Utils.getError(400, 'Reading cannot be in the future!'));
    }

    return next();
  });

  /**
   * After saving, validate, and update the correct resource table
   */
   Reading.observe('after save', function updateModels(ctx, next) {
    //get app
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    //check to see if new reading is more recent  - if so, update the resource table
    const reading = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;
    Reading.app.models.resource.find({where:{and: [{id:reading.resourceId},{postcode:reading.postcode}]}}, (err, resources) => {
      if (err) next(err);

      if (isNullOrUndefined(resources) || isNullOrUndefined(resources[0])) {
        return next(new Error("resource doesnt exist!"));
      }

      let resource = resources[0];
      let shouldUpdate = false;
      //check to see if this a new reading, or a reading on the same day
      console.log("resource.last_date", resource.last_date);
      console.log("reading.date", reading.date);

      const newEntry = moment(reading.date).isSameOrAfter(moment(resource.last_date));
      console.log("is newEntry", newEntry);
      if (resource.type === 'raingauge') {
        //Rain gauge's last reading also must be above 0.
        if (reading.value > 0 && newEntry) {
          shouldUpdate = true;
        }
      } else {
        if (newEntry) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        resource.last_date = reading.date;
        resource.last_value = reading.value;

        return resource.save({skipUpdateModels:true})
          .then(() => next())
          .catch(err => next(err));

      } else {
        let err = new Error("Reading recorded, but resource not updated. A newer reading exists.")
        console.log("warning: ", err);
        err.statusCode = 206;
        //If we return an error, loopback disregards the statusCode;
        // return next(err);
        return next();
      }
    });
   });
};
