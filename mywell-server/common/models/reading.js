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
      //let's just assume we have 1 worksheet, and it's the first
      const worksheet = worksheets[0];
      if (!ExcelReader.validateWorksheet(worksheet)) {
        throw getError(500, `Invalid worksheet. Please make sure to use the template provided`);
      }

      parsedRows = ExcelReader.processWorksheet(worksheet);

      //Looks like there is no more efficent way to do this other than 1 at a time in loopback:
      return Promise.all(parsedRows.readings.map(reading => {
        return Reading.create(reading, { skipUpdateModels:true});
      }));
    })
    .then(createdReadings => {
      return {
        created: createdReadings.length,
        parsedRows: parsedRows.readings.length,
        warnings: parsedRows.warnings
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

      // console.log("found resource", resources);
      if (isNullOrUndefined(resources) || isNullOrUndefined(resources[0])) {
        //TODO: throw error, return 400
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
