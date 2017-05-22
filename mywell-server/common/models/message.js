var MessageType = require('../constants');
var MessageUtils = require('../MessageUtils')
var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Message) {

  /*
  * Actual method for processing request
  */
  Message.remoteMethod(
    'sms',
    {
      accepts: [
        {arg: 'no', type: 'number'},
        {arg: 'msg', type: 'string'}
      ],
      'description': 'recieves the SMS from way 2 mint',
      http: {path: '/sms', verb: 'get', status:200},
      returns: {arg: 'response', type: 'string'}
    }
  );

  /*
  Some examples:
  SMA 000 POSTCODE DATE WELL_ID DEPTH
  SMA 999 POSTCODE                        - get the readings for this postcode
  SMA 999 POSTCODE VILLAGE_ID (2 digit)   - get the readings for this village
  SMA 999 POSTCODE RESOURCE_ID (4 digits) - get the readings for this village
  */
  Message.sms = function(no, msg) {
    const number = no; //The name from w2m is no for some reason.
    //eg: http://mywell.marvi.org.in:3000/api/messages/sms?no=61410237238&msg=SMA+999+313603+5
    console.log("Number", number, "message", msg);

    return handleSMS(number, msg)
      .then(() => {
        return "message recieved";
      })
      .catch(err => {
        console.error("err: ", err);
        return "message recieved";
      })

    var reply = function(){}; //pass through dummy reply to hold special parameters
    //TODO: restructure with a proper callback...
    try {
      reply.number = mobile; //this is a little hacky
      const parsedMessage = parseMessage(msg, reply);
    }
  }

  const handleSMS = (number, message) => {



  }

  //Grab the message
  replyToSMS = function(response, cb) {
    console.log(response);
    let message = response; //this is if message is just a string, as we want to be able to pass errors to this function

    if (!isNullOrUndefined(response.message)) {
      message = response.message
    }

    //send SMS reply!
    MessageUtils.sendSMSMessage(message, cb.number);

    if (response.name == "Error") {
      console.log("SMS ERROR", response.message)
      cb(response);
    }

    //Reply to Client - may not be needed, good for testing
    //TODO: set this based on ENV
    cb(null, response);
  }

  //Parse the message, and return an object to be updated, query to be made or an error
  parseMessage = function(message) {
    let messageType;
    const split = message.split(' ');

    if (split[1] === '000') {
      messageType = MessageType.update;
      return parseUpdate(split);

    } else if (split[1] === '999') {
      messageType = MessageType.query;
      return parseQuery(split);

    } else {
      return Promise.reject(new Error("Could not understand message. Message must start with 000 or 999.");
    }
  }

  //From an array of strings, parse the query message
  parseQuery = function(splitMessage) {
    if (splitMessage.length < 3) {
      return Promise.reject(new Error("Incorrect number of args. Query requires at least 3"));
    }

    const postcode = parseInt(splitMessage[2]);
    var resourceId = null;
    if (splitMessage.length == 4) {
      resourceId = parseInt(splitMessage[3]);
    }

    //Check to make sure postcode exists:
    Message.app.models.village.find({"where":{"postcode":postcode}}, (err, villages) => {
      if(err) {
        console.log(err);
        return Promise.reject(err);
      }

      if (villages.length == 0) {
        return Promise.reject(err);
      }

      if (isNullOrUndefined(resourceId)){
        return parseQueryPostcode(postcode, cb);
      }

      //Check to see if the resourceId is a a villageId (2 digits) or entire resource id.
      if (`${resourceId}`.length <= 2) {
        //resouceId is one digit - therefore villageId
        //TODO: update to multiple digit villageId's
        return parseQueryVillage(postcode, resourceId);
      }

      return parseQueryResource(postcode, resourceId);
    });
  }

  parseQueryPostcode = (postcode, cb) => {
    console.log('TODO: parse postcode');


  }

  parseQueryVillage = (postcode, villageId) => {
    const app = Message.app;
    const lastMonth =  moment().subtract(1, 'months').format('Y-M');
    const lastYear = moment().subtract(12, 'months').format('Y-M');

    return Promise.all([
      app.models.village.findById(villageId, {where:{postcode:postcode}}),
      app.models.resource_stats.getCurrentVillageAverage(villageId, postcode),
      app.models.resource_stats._getHistoricalVillageAverages(villageId, postcode, '', lastMonth, lastMonth),
      app.models.resource_stats._getHistoricalVillageAverages(villageId, postcode, '', lastYear, lastYear),
    ])
    .then(results => {

      //TODO: fix inconsistencies here - each method returns something slightly different
      const village = results[0];
      if (isNullOrUndefined(village)) {
        return replyToSMS(new Error("Invalid villageId."), cb);
      }

      let thisMonth = null;
      let lastMonth = null;
      let lastYear = null;

      if (!isNullOrUndefined(results[1])) {
        thisMonth = results[1]; //not sure what this looks like
      }

      if (!isNullOrUndefined(results[2]) && !isNullOrUndefined(results[2].aveReading)) {
        lastMonth = results[2].aveReading;
      }

      if (!isNullOrUndefined(results[3]) && !isNullOrUndefined(results[3].aveReading)) {
        lastYear = results[3].aveReading;
      }

      const reading = {
        village: village,
        thisMonth: thisMonth,
        lastMonth: lastMonth,
        lastYear: lastYear
      };

      console.log('reading is:', reading);

      return MessageUtils.convertVillageToMessage(reading);
    });
  }

  parseQueryResource = (postcode, resourceId, cb) => {
    const app = Message.app;
    const lastMonth =  moment().subtract(1, 'months').format('Y-M');
    const lastYear = moment().subtract(12, 'months').format('Y-M');

    //Resolves [current, last_month, last_year]
    return Promise.all([
      app.models.resource.findById(resourceId, {where:{postcode:postcode}, include: 'village'}),
      app.models.resource_stats.find({where: {and: [{resourceId: resourceId}, {postcode: postcode}, {month:lastMonth}]}}),
      app.models.resource_stats.find({where: {and: [{resourceId: resourceId}, {postcode: postcode}, {month:lastYear}]}})
    ])
    .then((results) => {
      const resource = results[0];
      const village = resource.village;
      let lastMonth = null;
      let lastYear = null;
      if (!isNullOrUndefined(results[1]) && !isNullOrUndefined(results[1][0])) {
        lastMonth = results[1][0].ave_reading;
      }

      if (!isNullOrUndefined(results[2]) && !isNullOrUndefined(results[2][0])) {
        lastYear = results[2][0].ave_reading;
      }

      const reading = {
        resource: resource,
        village: village,
        lastMonth: lastMonth,
        lastYear: lastYear
      };

      return MessageUtils.convertResourceToMessage(reading);
    });
  }

  //from an array of strings, parse the update message
  parseUpdate = function(splitMessage, cb) {
    if (splitMessage.length != 6) {
      return replyToSMS(new Error("Incorrect number of arguments. Update requires 6."), cb);
    }

    //TODO: Handle the case where the user enters in non Alphanumeric characters
    const postcode = splitMessage[2];
    const dateString = splitMessage[3];
    const resourceId = parseInt(splitMessage[4])
    const depthString = splitMessage[5];

    //check to see if postcode exists:
    return Message.app.models.village.find({"where":{"postcode":postcode}})
    .then(villages => {
      if (villages.length == 0) {
        return Promise.reject(new Error("No villages exist for this postcode."));
      }
      let date = moment(dateString, "YYMMDD");

      return Message.app.models.resource.findById(resourceId)
    })
    .then(resource => {
      if (isNullOrUndefined(resource)) {
        return Promise.reject(new Error("Could not find resource with ID: " + resourceId));
      }

      const villageID = `${resourceId}`.substring(0,2);

      //Parse the depth:
      let depthFloat;
      try {
        depthFloat = parseFloat(depthString);
        depthFloat = depthFloat/100;
        depthFloat = depthFloat.toFixed(2);
      }

      if (isNullOrUndefined(depthFloat)) {
        return Promise.reject(new Error("Reading value is null or undefined."));
      }

      //TODO: We could probably also check to make sure the depth doesn't exceed the max of the resource
      //Assume that the water level is valid for now.
      //make a reading object
      const reading = {
        resourceId: resourceId,
        date: date,
        value: depthFloat,
        village_id: villageID,
        postcode: postcode
      };

      return Message.app.models.Reading.create(reading);
    })
    .then(savedReading => {
      return "Reading successfully recorded. ReadingId:" + savedReading.id;
    });
  }
};
