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


module.exports = function(Resource) {
  Resource.remoteMethod('processExcelFile', {
    accepts: [
     {arg: 'container', type: 'string', description: 'name of the container the file was uploaded to'},
     {arg: 'name', type: 'string', description: 'name of the file uploaded'}
    ],
    description: 'Processes a file that has been uploaded to the given container',
    returns: {arg: 'response', type: 'json', root:true},
    http: {path: '/processExcelFile', verb: 'get', status:200}
  });

  Resource.processExcelFile = (container, name) => {
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
    // .then(() => sleep(60 * 5))
    .then(worksheets => {
      return Promise.all(worksheets.map(worksheet => {
        if (!ExcelReader.validateWorksheet(worksheet, 'registration')) {
          throw getError(500, `Invalid worksheet. Please make sure to use the template provided`);
        }

        parsedRows = ExcelReader.processWorksheet(worksheet, 'registration');
        return Promise.all(parsedRows.rows.map(resource => {
          console.log("valid resource:", resource);

          return Resource.create(resource, { skipUpdateModels:true})
            .catch(err => {
              // console.log("excel import - row error");
            });
        }));
      }));
    })
    .then(createdResources => {
      // console.log("createdResources", createdResources);

      return {
        created: createdResources.length,
        parsedRows: createdResources.readings.length,
        warnings: createdResources.warnings
      };
    })
    .catch(err => {
      console.log(err)
      throw err;
    });
  }
};
