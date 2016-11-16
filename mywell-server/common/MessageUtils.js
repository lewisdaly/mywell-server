/*
 * just some handy utils
 *
 */
const isNullOrUndefined = require('util').isNullOrUndefined;
const request = require('request-promise-native');


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


/**
 * Take a Resource object, convert to a nice message format
 */
module.exports.convertResourceToMessage = (reading) => {
  const resource = reading.resource;
  const village = reading.village;
  const lastMonth = reading.lastMonth;
  const lastYear = reading.lastYear;

  let lastMonthLine = `No reading for 1 month ago\n`;
  let lastYearLine =  `No reading for 1 year ago\n`;

  if (!isNullOrUndefined(lastMonth)) {
    lastMonthLine = `1 Month ago: ${lastMonth}m\n`;
  }

  if (!isNullOrUndefined(lastYear)) {
    lastYearLine = `1 Year ago: ${lastYear}m\n`;
  }

  return `Village: ${village.name}\n`
                  + `Well Owner: ${resource.owner}\n`
                  + `ResourceId: ${resource.id}\n`
                  + `ResourceType: ${resource.type}\n`
                  + `Last Updated: ${resource.last_date}\n\n`
                  + `Current WT Depth ${resource.last_value}m\n`
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
