/* constants (for some reason can't be const)*/
var readingStartX = 2;
var readingStartY = 1;
var readingWidth = 4;
var maxReadings = 2;


var resourceId = null;
var postcode = null;
var baseUrl = null;
var accessToken = null;
var villageId = null;

/**
 * set up the variables from settings and the active sheet
 */
function init() {
  //TODO: read from settings
  resourceId = "1170";
  villageId = "11";
  postcode = "313603";
  baseUrl = "https://dev2-mywell-server.vessels.tech";
  accessToken = "IEdi8RsECkAY5ZTok6776m5MgXjYnSIC3JSCqH6uxwaJ9ziwITrNACsNmx2wzNc5";
}

/**
 * Load the readings from the API
 */
function loadMyWellReadings() {
  init();
  //https://dev2-mywell-server.vessels.tech/api/readings?filter=%7B%22where%22%3A%7B%22and%22%3A%5B%7B%22id%22%3A1170%7D%2C%20%7B%22postcode%22%3A2756%7D%5D%7D%7D&access_token=<token>
  const filter = {"where":{"and":[{"resourceId":resourceId}, {"postcode":postcode}]}};
  const url = baseUrl + "/api/readings"
                      + "?filter=" + urlEncode(filter)
                      + "&access_token=" + accessToken;

  var response = UrlFetchApp.fetch(url);
  Logger.log(JSON.parse(response.getContentText()));
  var readings = [];
  var readingsJson = JSON.parse(response.getContentText());
  if (readingsJson) {
    for (var idx in readingsJson) {
      var readingJson = readingsJson[idx];
      readings.push(formatReadingForSheet(readingJson));
    }
  }

  updateSheetReadings(readings);
}

/**
 * Get the values from the sheet, and save to API using a PUT request
 */
function saveMyWellReadings() {
  init();

  const readingsList = loadReadingsFromSheet();
  const readingsJson = [];
  for (var idx in readingsList) {
    var reading = formatReadingForJson(readingsList[idx])
    if (reading !== null) {
      readingsJson.push(reading);
    }
    reading = null;
  }

  //https://dev2-mywell-server.vessels.tech/api/readings?access_token=<token>
  const url = baseUrl + "/api/readings"
                      + "?access_token=" + accessToken;

  var options = {
    'method' : 'PUT',
    'contentType': 'application/json',
    'payload' : JSON.stringify(readingsJson),
     muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseCode = response.getResponseCode();

  if (responseCode !== 200) {
    Logger.log(response)
    throw new Error(Utilities.formatString("Request failed with error code: %d", responseCode));
  }

  Logger.log(Utilities.formatString("Updated/Saved %d readings", readingsJson.length));
}

function updateSheetReadings(readings) {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(readingStartX, 1, readings.length, 4).setValues(readings);

}

function loadReadingsFromSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();

  return sheet.getRange(readingStartX, readingStartY, maxReadings, readingWidth).getValues();
}

function formatReadingForJson(reading) {
  const [id, resourceId, date, value] = reading;

  if (value === "" || value === null || typeof value === undefined) {
    return null;
  }

  //If id exists, we are updating an existing reading
  if (id !== null && typeof id !== undefined) {
    return {
      id: id,
      resourceId: resourceId,
      date: date,
      value: value,
      postcode: postcode,
      villageId: villageId,
    };
  }

  return {
    resourceId: resourceId,
    villageId: villageId,
    postcode: postcode,
    value: value,
    date: date
  };
}

function formatReadingForSheet(reading) {
  return [
    reading.id,
    reading.resourceId,
    reading.date,
    reading.value
  ];
}

function urlEncode(json) {
  return encodeURIComponent(JSON.stringify(json));
}



/*TODO:
- enforce id can't be changed
- google auth stuff
- mini tutorial
*/
