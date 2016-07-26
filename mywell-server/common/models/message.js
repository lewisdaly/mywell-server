var MessageType = require('../constants');
var MessageUtils = require('../MessageUtils')
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
      http: {path: '/sms', verb: 'post', status:200},
      returns: {arg: 'response', type: 'string'}
    }
  );

  Message.sms = function(number, message, cb) {

    //Receive the message here.
    //Parse the message, and send to "reading" if it is a submission
    try {
      cb.number = number; //this is a little hacky
      const parsedMessage = parseMessage(message, cb);
    } catch(err) {
      console.error("Error.", err);
      cb(err);
    }
  }

  //Grab the message
  replyToSMS = function(response, cb) {
    // console.log("SMS REPLY:", message);
    console.log(cb);

    //send SMS reply!
    MessageUtils.sendSMSMessage(response.message, cb.number);

    if (response.name == "Error") {
      console.log("SMS ERROR", response.message)
      cb(response);
    }

    //Reply to Client - may not be needed, good for testing
    //TODO: set this based on ENV
    cb(null, response);
  }

  //Parse the message, and return an object to be updated, query to be made or an error
  parseMessage = function(message, cb) {
    let messageType;

    const split = message.split(' ');

    if (split[1] === '000') {
      messageType = MessageType.update;
      parseUpdate(split, cb);

    } else if (split[1] === '999') {
      messageType = MessageType.query;
      parseQuery(split, cb);

    } else {
      replyToSMS(new Error("Could not understand message. Message must start with 000 or 999."), cb);
    }
  }

  //From an array of strings, parse the query message
  parseQuery = function(splitMessage, cb) {
    if (splitMessage.length != 4) {
      return replyToSMS(new Error("Incorrect number of args. Query requires 4"), cb);
    }

    const postcode = parseInt(splitMessage[2]);
    const resourceId = parseInt(splitMessage[3]);

    //Check to make sure postcode exists:
    Message.app.models.village.find({"where":{"postcode":postcode}}, (err, villages) => {
      if(err) return replyToSMS(err, cb);

      if (villages.length == 0) {
        return replyToSMS(new Error("No villages exist for this postcode."), cb);
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
    //TODO: add query for entire village etc.
    const reply = MessageUtils.convertVillageToMessage({});
    replyToSMS(reply, cb);
  }

  parseQueryResource = (postcode, resourceId, cb) => {

    //TODO: add query for past values
    // for now, lastmonth, lastyear for MessageUtils to handle
    const app = Message.app;

    //Get the latest, last month, and last year readings
    //TODO: use an include filter!
    app.models.resource.findById(resourceId, {where:{postcode:postcode}}, (err, resource) => {
      if(err) return replyToSMS(err, cb);

      app.models.village.findById(resource.villageId, (err, village) => {
        if(err) return replyToSMS(err, cb);

        const reply = MessageUtils.convertResourceToMessage({
                        resource:resource, 
                        village:village
                      });

        replyToSMS(reply, cb);
      });
    });
  }

  //from an array of strings, parse the update message
  parseUpdate = function(splitMessage, cb) {

    if (splitMessage.length != 6) {
      return replyToSMS(new Error("Incorrect number of arguments. Update requires 6."), cb);
    }
   
    //TODO: Handle the case where the user enters in Alphanumeric characters
    const postcode = splitMessage[2];
    const dateString = splitMessage[3];
    const resourceId = parseInt(splitMessage[4]) 
    const depthString = splitMessage[5];    

    //check to see if postcode exists:
    Message.app.models.village.find({"where":{"postcode":postcode}}, (err, villages) => {
      if(err) return replyToSMS(err, cb);

      if (villages.length == 0) {
        return replyToSMS(new Error("No villages exist for this postcode."),cb);
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
        return replyToSMS(new Error("Error parsing date"), cb);
      }

      //Ensure that the resource exists:
      Message.app.models.resource.findById(resourceId, (err, resource) => {
        if(err) throw err;

        if (isNullOrUndefined(resource)) {
          return replyToSMS(new Error("Could not find resource with ID: " + resourceId), cb);
        }

        const villageID = resourceId.toString().charAt(0);

        //Parse the depth:
        let depthFloat;
        try {
          depthFloat = parseFloat(depthString);
          depthFloat = depthFloat/100;
          depthFloat = depthFloat.toFixed(2);

        } catch (err) {
          return replyToSMS(new Error("Error parsing the reading value"), cb);
        }

        if (isNullOrUndefined(depthFloat)) {
          return replyToSMS(new Error("Reading value is null or undefined."), cb);
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
            return replyToSMS(err, cb);
          }

          // console.log("Created new reading:", savedReading);
          const replyMessage = "Reading successfully recorded. ReadingId:" + savedReading.id;
          replyToSMS({message: replyMessage}, cb);
        });
      });
    });
  }
};
