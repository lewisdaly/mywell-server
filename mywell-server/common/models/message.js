var MessageType = require('../constants');
var messageUtils = require('../MessageUtils')
var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Message) {

  /*
  * Method for receiving the SMS Request
  */

  Message.remoteMethod(
    'sms',
    {
      accepts: [
        {arg: 'number', type: 'number'},
        {arg: 'message', type: 'string'}
      ],
      'description': 'recieves the SMS from way 2 mint',
      http: {path: '/sms', verb: 'post'},
      returns: {arg: 'response', type: 'string'}
    }
  );

  Message.sms = function(number, message, cb) {

    //Receive the message here.
    //Parse the message, and send to "reading" if it is a submission
    try {
      const parsedMessage = parseMessage(message, cb);
    } catch(err) {
      console.error("Error.", err);
      cb(err);
    }
  }

  //Parse the message, and return an object to be updated, query to be made or an error
  parseMessage = function(message, cb) {
    let messageType;

    const split = message.split(' ');
    console.log("messageType", MessageType);

    if (split[1] === '000') {
      messageType = MessageType.update;
      parseUpdate(split, cb);

    } else if (split[1] === '999') {
      messageType = MessageType.query;
      parseQuery(split, cb);

    } else {
      cb (new Error("Could not understand message. Message must start with 000 or 999."));
    }
  }

  //From an array of strings, parse the query message
  parseQuery = function(splitMessage, cb) {
    if (splitMessage.length != 4) {
      return cb(new Error("Incorrect number of args. Query requires 4"));
    }

    const postcode = parseInt(splitMessage[2]);
    const resourceId = parseInt(splitMessage[3]);

    //Check to make sure postcode exists:
    Message.app.models.village.find({"where":{"postcode":postcode}}, (err, villages) => {
      if(err) cb(err);

      if (villages.length == 0) {
        return cb(new Error("No villages exist for this postcode."));
      }

      //Check to see if the resourceId is a single digit, or entire resource id.
      if (resourceId < 100) {
        parseQueryVillage(postcode, resourceId, cb);
      } else {
        parseQueryResource(postcode, resourceId, cb);
      }
      
    });
  }

  parseQueryVillage = (postcode, villageID, cb) => {

  }

  parseQueryResource = (postcode, resourceId, cb) => {

    //TODO: do a promise.all here or something. Create a temp data structure
    // for now, lastmonth, lastyear for messageUtils to handle

    //Get the latest, last month, and last year readings
    Message.app.models.resource.findById(resourceId, (err, resource) => {
      if(err) cb(err);




    });


    messageUtils.convertJSONToSMSMessage("HEY");

  }


  //from an array of strings, parse the update message
  parseUpdate = function(splitMessage, cb) {

    if (splitMessage.length != 6) {
      return cb(new Error("Incorrect number of arguments. Update requires 6."));
    }
   
    //TODO: Handle the case where the user enters in Alphanumeric characters
    const postcode = splitMessage[2];
    const dateString = splitMessage[3];
    const resourceId = parseInt(splitMessage[4]) 
    const depthString = splitMessage[5];    

    //check to see if postcode exists:
    Message.app.models.village.find({"where":{"postcode":postcode}}, (err, villages) => {
      if(err) cb(err);

      if (villages.length == 0) {
        return cb(new Error("No villages exist for this postcode."));
      }

      //Attempt to parse the date
      let date;
      try {
        date = moment(dateString, "YYMMDD");
      } 
      catch (err) {
       console.error("Error parsing date.");
      }

      //Can't seem to throw from catch block
      if (isNullOrUndefined(date) || !date.isValid()) {
        return cb(new Error("Error parsing date"));
      }

      //Ensure that the resource exists:
      Message.app.models.resource.findById(resourceId, (err, resource) => {
        if(err) throw err;

        if (isNullOrUndefined(resource)) {
          return cb(new Error("Could not find resource with ID: " + resourceId));
        }

        const villageID = resourceId.toString().charAt(0);

        //Parse the depth:
        let depthFloat;
        try {
          depthFloat = parseFloat(depthString);
          depthFloat = depthFloat/100;
          depthFloat = depthFloat.toFixed(2);

        } catch (err) {
          console.log("err", err);
          return cb(new Error("Error parsing the reading value"));
        }

        if (isNullOrUndefined(depthFloat)) {
          return cb(new Error("Reading value is null or undefined."));
        }


        //TODO: We could probably also check to make sure the depth doesn't exceed the max of the resource
        //Assume that the water level is valid for now.

        //make a reading object
        const reading = {
          resourceId: resourceId,
          date: date,
          value: depthFloat,
          village_id: villageID
        };

        Message.app.models.Reading.create(reading, (err, savedReading) => {
          if (err) {
            console.error(err);
            return cb(err);
          }

          console.log("Created new reading:", savedReading);
          cb();
        });
      });
    });
  }
};
