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

const range = (start, end, step) => {
  if (!step) {
    step = 1;
  }

  let array = [];
  for (var i = start; i <= end; i = i + step) {
    array.push(i);
  }
  return array;
}

const getUnusedIds = (usedIds, type) => {
  let allIds = null;

  switch (type) {
    case "well":
      allIds = range(10, 69);
      break;
    case "raingauge":
      allIds = range(70, 80);
      break;
    case "checkdam":
      allIds = range(80, 99);
      break;
  }

  return allIds.filter(ids => !usedIds[ids]);
}

module.exports = function(Resource) {

  // function _findAvailableIds(postcode, villageId, type) {
  //   let usedIdsMap = {};
  //
  //   //Look up all resources in postcode and village, assign a new id based on resource type
  //   return Resource.find({where:{and:[{postcode:postcode}, {villageId:villageId}, {type:type}]}})
  //     .then(_resources => {
  //       return _resources.forEach(resource => {
  //         usedIdsMap[`${resource.id}`.substring(2,4)] = true;
  //       });
  //     })
  //     .then(() => getUnusedIds(usedIdsMap, type));
  // }


  /**
   * Create a new id if not exists in save
   */
  // Resource.observe('before save', function(ctx, next) {
  //   console.log("before save");
  //
  //   if (ctx.options && ctx.options.skipUpdateModels) {
  //     return next();
  //   }
  //
  //   const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;
  //
  //   //Assume they have been given/have a valid id already
  //   if (resource.id) {
  //     console.log("already have id");
  //     return next();
  //   }
  //
  //   if (!resource.villageId) {
  //     return next(new Error("id or villageId is required to create a new resource"));
  //   }
  //
  //   _findAvailableIds(resource.postcode, resource.villageId, resource.type)
  //   .then(availableIds => {
  //     if (availableIds.length == 0) {
  //       return next(new Error(`Error creating a new resouce, all id's are taken for: pincode: ${resource.postcode} villageId:${resource.villageId}, type: ${resource.type}`));
  //     }
  //     //Save with one of the new ids - not thread safe!
  //     resource.id = parseInt(`${resource.villageId}${availableIds[0]}`);
  //   })
  //   .then(() => {
  //     console.log("calling next");
  //     next(null);
  //   })
  //   .catch(next);
  // });

  Resource.observe('before save', function(ctx, next) {
    console.log("HEY");

    const _findAvailableIds = (postcode, villageId, type) => {
      let usedIdsMap = {};

      //Look up all resources in postcode and village, assign a new id based on resource type
      return Resource.find({where:{and:[{postcode:postcode}, {villageId:villageId}, {type:type}]}})
        .then(_resources => {
            _resources.forEach(resource => {
              usedIdsMap[`${resource.id}`.substring(2,4)] = true;
            });
            return getUnusedIds(usedIdsMap, type)
        });
    }

    if (ctx.options && ctx.options.skipUpdateModels) {
        return next();
      }

    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    //Assume they have been given/have a valid id already
    if (resource.id) {
      console.log("already have id");
      return next();
    }

    if (!resource.villageId) {
      return next(new Error("id or villageId is required to create a new resource"));
    }

    Promise.resolve(true)
      .then(() => _findAvailableIds(resource.postcode, resource.villageId, resource.type))
      .then(availableIds => {
        console.log("availableIds:", availableIds);
        resource.id = parseInt(`${resource.villageId}${availableIds[0]}`);

        next();
      })
      .catch(err => {
        next(err);
      });
  });


  /**
   * After saving, if the user supplied a mobile number, send them a message
   */
  Resource.observe('after save', function updateModels(ctx, next) {
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    //check to see if new reading is more recent  - if so, update the resource table
    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    //mobile is optional, skip if we don't have
    if (!resource.mobile) {
      return next();
    }

    //TODO: send message!
  });

  Resource.remoteMethod('findAvailableIds', {
    accepts: [
      {arg: 'postcode', type: 'number', description: 'the postcode of the desired resource'},
      {arg: 'villageId', type: 'number', description: 'the villageId of the desired resource'},
      {arg: 'type', type: 'string', description: 'the resource type'}
    ],
    description: 'Find an available id for a new resource',
    http: {path: '/findAvailableIds', verb: 'get', status:200},
    returns: {arg: 'response', type: 'string', root:true}
  });

  Resource.findAvailableIds = (postcode, villageId, type) => {
    return _findAvailableIds(postcode, villageId, type);
  }


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
    .then(worksheets => {
      return Promise.all(worksheets.map(worksheet => {
        if (!ExcelReader.validateWorksheet(worksheet, 'registration')) {
          return undefined;
        }

        parsedRows = ExcelReader.processWorksheet(worksheet, 'registration');
        return Promise.all(parsedRows.rows.map(resource => {
          return Resource.create(resource, { skipUpdateModels:true})
            .then(_resource => {
              return _resource;
            })
            .catch(err => {
              console.log("excel import - row error:", err.message);
            });
        }));
      }));
    })
    //Find stats from the saved resources
    .then(_createdResourceWorksheets => {
      let created = 0;
      let parsedRows = 0;
      let warnings = 0;

      _createdResourceWorksheets.forEach(_worksheet => {
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
      return Promise.reject(err);
    });
  }
};
