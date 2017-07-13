var LoopBackContext = require('loopback-context');
var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;
const fs = require('fs');

const Enums = require('../Enums');
const Utils = require('../Utils');
const ExcelReader = require('../ExcelReader');
var MessageUtils = require('../MessageUtils')


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

  const _findAvailableIds = (postcode, villageId, type) => {
    let usedIdsMap = {};

    //Look up all resources in postcode and village, assign a new id based on resource type
    return Resource.find({where:{and:[{postcode:postcode}]}})
      .then(_resources => {
        return _resources.forEach(resource => {
          usedIdsMap[`${resource.id}`.substring(2,4)] = true;
        });
      })
      .then(() => getUnusedIds(usedIdsMap, type));
  }

  Resource.remoteMethod('updateResourceByIdAndPostcode', {
    accepts: [
      {
        arg: 'data',
        type: 'object',
        required: true,
        description: '{ resource body }',
        http: { source: 'body' },
      }
    ],
    description: 'Update a resource given an id & postcode',
    returns: {arg: 'resource', type: 'resource', root:true},
    http: {path: '/updateResourceByIdAndPostcode', verb: 'post', status:200}
  });

  Resource.updateResourceByIdAndPostcode = (data) => {
    let app = null;
    let resource = null;

    if (!data) {
      return Promise.reject(Utils.getError(400, `Data is undefined for request`));
    }

    if (!data.id || !data.postcode) {
      return Promise.reject(Utils.getError(400, `Id and postcode is required`));
    }

    const filter = {
      where: { and: [
        {id:data.id},
        {postcode:data.postcode}
      ]}
    };

    return Utils.getApp(Resource)
      .then(_app => app = _app)
      .then(() => Resource.findOne(filter))
      .then(_resource => {
        resource = _resource;

        if (!resource) {
          return Promise.reject(Utils.getError(404, `Could not find resource for id: ${data.id} and postcode: ${data.postcode}`));
        }

        if (data.geo && data.geo.lat && data.geo.lng) {
           resource.geo = {
             lat: data.geo.lat,
             lng: data.geo.lng
           };
         }
        if (data.last_value) { resource.last_value = data.last_value; }
        if (data.well_depth) { resource.well_depth = data.well_depth; }
        if (data.last_date) { resource.last_date = data.last_date; }
        if (data.owner) {resource.owner = data.owner; }
        if (data.elevation) {resource.elevation = data.elevation; }
        if (data.type) {resource.type = data.type; }
        if (data.image) {resource.image = data.image; }
        if (data.mobile) {resource.mobile = data.mobile; }
        if (data.email) {resource.email = data.email; }
        if (data.villageId) {resource.villageId = data.villageId; }

        return resource.save();
      })
  };

  /**
   * Set the clientId if not exists and already set
   */
  Resource.observe('before save', function(ctx, next) {
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    if (!ctx.isNewInstance) {
      return next();
    }

    const other_ctx = LoopBackContext.getCurrentContext();
    const client = other_ctx && other_ctx.get('currentClient');

    if (!client) {
      console.log("WARN: could not find currentClient");
      return next();
    }

    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;
    if (!resource || resource.clientId) {
      return next();
    }

    resource.clientId = client.id;
    return next();
  });


  /**
   * Create a new id if not exists in save
   */
  Resource.observe('before save', function(ctx, next) {
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    //Assume they have been given/have a valid id already
    if (resource.id) {
      return next();
    }

    if (!resource.villageId) {
      return next(new Error("id or villageId is required to create a new resource"));
    }

    _findAvailableIds(resource.postcode, resource.villageId, resource.type)
    .then(availableIds => {
      if (availableIds.length == 0) {
        return next(new Error(`Error creating a new resouce, all id's are taken for: pincode: ${resource.postcode} villageId:${resource.villageId}, type: ${resource.type}`));
      }
      //Save with one of the new ids - not thread safe!
      resource.id = parseInt(`${resource.villageId}${availableIds[0]}`);
    })
    .then(() => {
      next();
    })
    .catch(next);
  });

  /**
   * After saving, if the user supplied a village name, update it
   */
  Resource.observe('after save', (ctx, next) => {
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    if (!resource.village_name) {
      return next();
    }

    const newVillage = {
      id: resource.villageId,
      name: resource.village_name,
      postcode: resource.postcode,
      coordinates: resource.geo
    };

    const filter = {where:{and:[{id:newVillage.id},{postcode:newVillage.postcode}]}};
    Resource.app.models.Village.findOrCreate(filter, newVillage, (err, resource) => {
      if(err) {
        return next(err);
      }

      next();
    });
  });

  /**
   * After saving, if the user supplied a mobile number, send them a message
   */
  Resource.observe('after save', function updateModels(ctx, next) {
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    const resource = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    //Only send when we first create
    if (!ctx.isNewInstance) {
      return next();
    }

    //Get the clientId of the resource. Skip if we don't have
    if (!resource.clientId) {
      return next();
    }

    let mobileNumber = null;
    return Resource.app.models.Client.findById(resource.clientId)
      .then(_client => mobileNumber = _client && _client.mobile_number)
      .then(() => {
        if (!mobileNumber) {
          console.log("WARN: no client or mobile number found. clientId: " + resource.clientId);
          return;
        }

        const message = `Thanks. The details of your ${resource.type} are.\nPostcode:${resource.postcode}\nId:${resource.id}`;
        return MessageUtils.india_sendSMSMessage(message, mobileNumber)
      })
      .then(() => next())
      .catch(err => next(err));
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
