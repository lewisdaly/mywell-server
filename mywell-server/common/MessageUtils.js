/*
 * just some handy utils
 *
 */
const isNullOrUndefined = require('util').isNullOrUndefined;
const request = require('request-promise-native');
const moment = require('moment');

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


/*
 * Process the POST request to W2M
 */
module.exports.sendSMSMessage = (message, number) => {
  console.log("Sending message: \"" + message + "\" to number:" +number);

  const url = `http://fastsms.way2mint.com/SendSMS/sendmsg.php?uname=basantm&pass=12345678&send=Way2mint&dest=${number}&msg=${message}&prty=1&vp=30&dlr-url=1`;

  request({uri: url})
  .then(response => {
    console.log('w2m reply', response);
  })
  .catch(err => {
    console.log(err);
  })
}
