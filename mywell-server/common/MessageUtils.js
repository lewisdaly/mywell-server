/*
 * just some handy utils
 *
 */


/*

{
  id: 100,
  geo: { lat: 10.32424, lng: 5.84978 },
  last_value: 15,
  last_date: 2016-11-25T00:00:00.000Z,
  owner: 'Lewis',
  elevation: 10,
  type: 'well',
  villageId: 1
}
{
 name: 'Varni', postcode: 510934, village_id: 5, id: 1 }
}

example text:

Village: Varni
Well Ownder:
ResourceId:
Resource Type:
Last Updated:

Current WT Depth:
WT Depth 1 Month ago:
WT Depth 1 Year ago:


*/
module.exports.convertVillageToMessage = (json) => {


  return "Sorry, haven't done this one yet";
}



/*
 * Take a Resource object, convert to a nice message format
 */
module.exports.convertResourceToMessage = (json) => {
  const resource = json.resource;
  const village = json.village;
  const lastMonthReading = json.lastMonthReading;
  const lastYearReading = json.lastYearReading;

  let lastMonthLine = "";
  let lastYearLine = "";

  if (lastMonthReading) {
    lastMonthLine = `1 Month ago: ${lastMonthReading.value}\n`;
  }
  if (lastYearReading) {
    lastYearLine = `1 Year ago: ${lastYearReading.value}\n`;
  }

  const message = `Village: ${village.name}\n`
                  + `Well Owner: ${resource.owner}\n`
                  + `ResourceId: ${resource.id}\n`
                  + `ResourceType: ${resource.type}\n`
                  + `Last Updated: ${resource.last_date}\n\n`
                  + `Current WT Reading ${resource.last_value}\n`
                  + lastMonthLine
                  + lastYearLine;
  return message;
}


/*
 * Process the POST request to W2M
 */

module.exports.sendSMSMessage = (message, number) => {
  console.log("Sending message: \"" + message + "\" to number:" +number);
}
