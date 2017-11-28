/*
 * just some handy utils
 *
 */
const isNullOrUndefined = require('util').isNullOrUndefined;
const request = require('request-promise-native');
const moment = require('moment');
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const Utils = require('./Utils');
const AWS = require('aws-sdk');
//SES is not available in ap-southeast-2
const ses = new AWS.SES({region:'eu-west-1'});

let ENABLE_NOTIFICATIONS = false;
if (process.env.ENABLE_NOTIFICATIONS === true || process.env.ENABLE_NOTIFICATIONS === 'true') {
  ENABLE_NOTIFICATIONS = true;
}

module.exports.convertVillageToMessage = (reading) => {
  let thisMonthLine = `No reading for this month\n`;
  let lastMonthLine = `No reading for last month\n`;
  let lastYearLine = `No reading for last year\n`;

  //Assume we have at least village
  if (!isNullOrUndefined(reading.thisMonth)) {
    thisMonthLine = `This month average: ${reading.thisMonth}m\n`;
  }

  if (!isNullOrUndefined(reading.lastMonth)) {
    lastMonthLine = `Last month average: ${reading.lastMonth}m\n`;
  }

  if (!isNullOrUndefined(reading.lastYear)) {
    lastYearLine = `This month average: ${reading.lastYear}m\n`;
  }

  return `Village: ${reading.village.name}\n`
                  + thisMonthLine
                  + lastMonthLine
                  + lastYearLine;
}


const getReadingHeadingForType = (resourceType) => {
  switch (resourceType) {
    case 'well':
      return 'Current WT Depth:'
    case 'checkdam':
      return 'Water column height:'
    case 'raingauge':
      return 'Last rainfall amount:'
    default:
      throw new Error(`Unknown resource type ${resourceType}`);
  }
}

module.exports.getReadingHeadingForType = getReadingHeadingForType;

module.exports.formatResourceForType = (resourceType) => {
  switch (resourceType) {
    case 'well':
      return "Well";
    case 'checkdam':
      return 'Checkdam'
    case 'raingauge':
      return 'Rainfall Station'
    default:
      throw new Error(`Unknown resource type ${resourceType}`);
  }
}

const getReadingEndingForType = (resourceType) => {
  switch (resourceType) {
    case 'well':
    case 'checkdam':
      return 'm'
    case 'raingauge':
      return 'mm'
    default:
      throw new Error(`Unknown resource type ${resourceType}`);
  }
}

module.exports.getReadingUnits = getReadingEndingForType;


/**
 * Take a Resource object, convert to a nice message format
 */
module.exports.convertResourceToMessage = (reading) => {
  const resource = reading.resource;
  const village = reading.village;
  const lastMonth = reading.lastMonth;
  const lastYear = reading.lastYear;

  const date = moment(resource.date).format("DD/MM/YY");

  let lastMonthLine = `No reading for 1 month ago\n`;
  let lastYearLine =  `No reading for 1 year ago`;

  if (!isNullOrUndefined(lastMonth)) {
    lastMonthLine = `1 Month ago: ${lastMonth}m\n`;
  }

  if (!isNullOrUndefined(lastYear)) {
    lastYearLine = `1 Year ago: ${lastYear}m`;
  }

  return `Village: ${village.name}\n`
                  + `Well Owner: ${resource.owner}\n`
                  + `Resource: ${resource.type} - ${resource.id}\n`
                  + `Last Updated: ${date}\n\n`
                  + `${getReadingHeadingForType(resource.type)} ${resource.last_value} ${getReadingEndingForType(resource.type)}\n`
                  + lastMonthLine
                  + lastYearLine;
}


module.exports.getSMSCodeMessage = (code) => {
  //TODO: account for languages somehow!
  return `Welcome to MyWell. Your temporary login code is: ${code}`;
}

/**
 * Send a message
 * numbers starting with 91 will be sent using SMSHorizon, others with Twilio
 */
 module.exports.sendSMSMessage = (message, number) => {
   if (`${number}`.substring(0,2) === '91') {
     return india_sendSMSMessage(message, number);
   }

   return twilio_sendSMSMessage(message, number);
 }


/**
 * Send message using Twilio
 */
const twilio_sendSMSMessage = (message, number) => {
  console.log("Twilio Sending message: \"" + message + "\" to number:" +number);

  if (ENABLE_NOTIFICATIONS === false ) {
    console.log("Skipping message, as ENABLE_NOTIFICATIONS is false");
    return Promise.resolve(true);
  }

  return twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+${number}`,
    body: message
  })
  .then(message => console.log(message.sid))
  .catch(err => {
    console.log(err);
    return Promise.reject(Utils.getError(500, "Error sending SMS message"));
  });
}

/**
 * Send message using SMSHorizon
 * This should replace Twilio and way2mint for all Indian numbers
 */
const india_sendSMSMessage = (message, number) => {
  console.log("SMSHorizon Sending message: \"" + message + "\" to number:" +number);

  const user = process.env.SMS_HORIZON_USER;
  const key = process.env.SMS_HORIZON_KEY;

  const url = `http://smshorizon.co.in/api/sendsms.php?user=${user}&apikey=${key}&mobile=${number}&message=${message}&senderid=MARVII&type=txt`
  if (ENABLE_NOTIFICATIONS === false ) {
    console.log("Skipping message, as ENABLE_NOTIFICATIONS is false");
    return Promise.resolve(true);
  }

  return request({uri: url})
  .then(response => {
    console.log('w2m reply', response);
  })
  .catch(err => {
    console.log(err);
  });
}


/**
 * Send an email with SES.
 */
module.exports.sendEmailMessage = (message, email) => {
  console.log("Sending Email message: \"" + message + "\" to email:" +email);

  if (ENABLE_NOTIFICATIONS === false ) {
    console.log("Skipping message, as ENABLE_NOTIFICATIONS is false");
    return Promise.resolve(true);
  }

  const params = {
    Destination: {
     ToAddresses: [email]
    },
    Message: {
     Body: {
      Html: {
       Charset: "UTF-8",
       Data: message
      }
     },
     Subject: {
      Charset: "UTF-8",
      Data: "Notification from MyWell"
     }
    },
    Source: "info@marvi.org.in",
  };

 return ses.sendEmail(params).promise()
  .then(data => {
    console.log("data", data);
  })
  .catch(err => {
    console.log(err);
    return Promise.reject(err);
  });
}
