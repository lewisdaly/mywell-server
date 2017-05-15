const Excel = require('exceljs');
const moment = require('moment');
var loopback = require("loopback");
const isNullOrUndefined = require('util').isNullOrUndefined;
const fs = require('fs')

/**
 * Parse the date in a forgiving manner
 * return a string for date, eg: 2015-06-11
 */
const parseDateForgivingly = (date) => {

  //First, just try parsing it
  let dateMoment = moment(new Date(date));
  if (dateMoment.isValid()) {
    return dateMoment.format('YYYY-MM-DD')
  }

  //Try with a few formats:
  dateMoment = moment(date, ["MM/DD/YYYY", "MM/DD/YY", "DD/MM/YYYY", "DD/MM/YY"]); // uses the last format
  if (dateMoment.isValid()) {
    return dateMoment.format('YYYY-MM-DD')
  }

  return null;
}

const WorksheetType = {
  reading: 'reading',
  registration: 'registration'
};

/**
 *  Open a given file, return a list of workbooks
 */
const readExcelFile = (filePath) => {
  // read from a file
  var workbook = new Excel.Workbook();
  return workbook.xlsx.readFile(filePath)
    .then(workbook => filterEmptyWorksheets(workbook));
}

/**
 * filter out all invalid worksheets in a workbook
 * @returns a list of worksheets
 */
const filterEmptyWorksheets = (workbook) => {
  let valid = [];

  workbook.eachSheet((worksheet, sheetId) => {
    if (isNullOrUndefined(worksheet._rows) || (worksheet._rows.length < 2)) {
      // console.log(`skipping worksheet: ${worksheet.name}`);
      return;
    }

    valid.push(worksheet);
  });

  return valid;
}


const isValidatorValid = (validator) => {
  return isFalsyDictValid(validator, false);
}

const isRowValid = (row) => {
  //Check to make sure that the reading isn't 0. If it is 0, then it is invalid
  if (row.value === 0) {
    return false;
  }

  return isFalsyDictValid(row, null);
}

//If any value is equal to the falsy value, return false!
const isFalsyDictValid = (dict, falseValue) => {
  isValid = true;

  //Check for optional values:
  const optionalType = dict.type;
  if (optionalType === falseValue || optionalType === undefined) {
    //Make sure we even have the optional type
    return false;
  }

  let options = dict.optional && dict.optional[optionalType];
  if (options) {
    Object.keys(options).forEach(key => {
      if (options[key] === falseValue) {
        isValid = false;
        return;
      }
    });
  }

  Object.keys(dict).forEach(key => {
    if (dict[key] == falseValue) {
      isValid = false;
      return;
    }
  });
  return isValid;
}


/**
 * iterate through rows till we find a valid one
 *typically this will be the top 5 rows or so
 * @returns a tuple with row validator dict, and start row index
 { postcode: false,
    resourceId: false,
    date: false,
    wt_depth: false }
 * false if not found, column index if found
 */

const validateReadingHeadingRow = (worksheet, end) => {
  let rowValidator = {postcode:false, resourceId:false, date:false, wt_depth:false};

  const validRows = {
    postcode:   ['post', 'code', 'zip', 'postcode', 'post code'],
    resourceId: ['wellid', 'well id', 'resourceid', 'id', 'well', 'resource'],
    date:       ['date', 'day'],
    wt_depth:   ['watertable depth cm', 'cm', 'depth', 'wt_depth', 'wt depth', 'water level', 'waterlevel', 'water_level']
  };

  const range = Array.from(Array(end).keys());
  let validatorTuple = [rowValidator, -1];

  range.forEach(rowNumber => {
    rowValidator = {postcode:false, resourceId:false, date:false, wt_depth:false};
    firstRow = worksheet.getRow(rowNumber).values;
    Object.keys(validRows).forEach(key => {
      possibleValues = validRows[key];
      possibleValues.forEach(value => {
        firstRow.forEach((cell, idx) => {
          if (!isNullOrUndefined(cell) && typeof cell === 'string' && cell.toLowerCase().indexOf(value) > -1) {
            rowValidator[key] = idx;
            return;
          }
        });
      });
    });

    if (isValidatorValid(rowValidator)) {
      validatorTuple = [rowValidator, rowNumber];
    }
  });

  return validatorTuple;
}


/**
 * This could all do with a nice refactor, but I don't have time atm...
 */
const validateRegistrationHeadingRow = (worksheet, end) => {
  let rowValidator = {
    id:false,
    lat: false,
    lng: false,
    owner: false,
    type: false, //we can infer type from the fields
    postcode: false,
    optional: {
      well: {
        elevation: false,
        well_depth: false
      }
    }
  };
  //Note: we leave off image here, as it is not required, and also cannot be parsed by the excel reader

  //Potential rows that may be in the excel file
  const validRows = {
    postcode:   ['post', 'code', 'zip', 'postcode', 'post code'],
    owner:      ['observer', 'owner'],
    id:         ['wellid', 'well id', 'resourceid', 'id', 'well', 'resource'],
    lat:        ['longitude'],
    lng:        ['latitude'],
    wt_depth:   ['watertable depth cm', 'cm', 'depth', 'wt_depth', 'wt depth', 'water level', 'waterlevel', 'water_level']
  };

  //TODO: infer the type from the text!
  const inferredTypes = {
    well: ['well Id', 'well'],
    rain_gauge: ['Rainfall Station', 'rainfall'],
    dam: ['Checkdam'],
  };

  //Keep a tally of how many times each type was mentioned
  const inferredTypesTally = {
    well: 0,
    rain_gauge: 0,
    dam: 0,
  };

  const range = Array.from(Array(end).keys());
  let validatorTuple = [rowValidator, -1];

  range.forEach(rowNumber => {
    let row = worksheet.getRow(rowNumber).values;
    Object.keys(inferredTypes).forEach(key => {
      possibleValues = inferredTypes[key];
      possibleValues.forEach(value => {
        row.forEach((cell, idx) => {
          if (!isNullOrUndefined(cell) && typeof cell === 'string' && cell.toLowerCase().indexOf(value) > -1) {
            inferredTypesTally[key]++
          }
        });
      });
    });
  });

  let max = -1;
  let inferredType = null;
  Object.keys(inferredTypesTally).forEach(key => {
    if (inferredTypesTally[key] > max) {
      max = inferredTypesTally[key];
      inferredType = key;
    }
  });
  rowValidator.type = inferredType;

  range.forEach(rowNumber => {
    // rowValidator = {postcode:false, resourceId:false, date:false, wt_depth:false};
    let firstRow = worksheet.getRow(rowNumber).values;
    Object.keys(validRows).forEach(key => {
      possibleValues = validRows[key];
      possibleValues.forEach(value => {
        firstRow.forEach((cell, idx) => {
          if (!isNullOrUndefined(cell) && typeof cell === 'string' && cell.toLowerCase().indexOf(value) > -1) {
            rowValidator[key] = idx;
            return;
          }
        });
      });
    });

    if (isValidatorValid(rowValidator)) {
      //a little hacky, but the rows are 1 indexed I think, and the registration data is often only in 1 row!
      validatorTuple = [rowValidator, rowNumber - 1];
    }
  });

  return validatorTuple;
}


/**
 * Find all rows based on headings or content
 * Call this to check and see if our worksheet is valid before parsing it.
 * @returns boolean
 */
const validateWorksheet = (worksheet, worksheetType) => {
  if (!worksheetType) {
    worksheetType = WorksheetType.reading;
  }

  headingsValid = false;
  contentValid = true;

  let rowValidator = null;
  let headingRow = null;

  switch (worksheetType) {
    case WorksheetType.reading:
      [rowValidator, headingRow]  = validateReadingHeadingRow(worksheet, 5);
      break;
    case WorksheetType.registration:
      [rowValidator, headingRow]  = validateRegistrationHeadingRow(worksheet, 5);
      break;
    default:
      throw new Error(`worksheetType is not found for ${worksheetType}`);
  }

  return isValidatorValid(rowValidator);
}


function processRow(worksheetType, row, rowValidator) {
  switch (worksheetType) {
    case WorksheetType.reading:
      return processReadingRow(row, rowValidator);
    case WorksheetType.registration:
      return processRegistrationRow(row, rowValidator);
    default:
      return new Error(`Unknown worksheetType: ${worksheetType}`);
  }
}

/**
 * Process the validated worksheet into a json array of coolness.
 * @return an array of reading objects, ready to be saved to the database!
 */
const processWorksheet = (worksheet, worksheetType) => {

  //First check to see if the worksheet is valid. If not, throw an exception!
  let rowValidator = null;
  let headingRow = null;

  switch (worksheetType) {
    case WorksheetType.reading:
      [rowValidator, headingRow]  = validateReadingHeadingRow(worksheet, 5);
      break;
    case WorksheetType.registration:
      [rowValidator, headingRow]  = validateRegistrationHeadingRow(worksheet, 5);
      break;
  }


  if (!isValidatorValid(rowValidator)) {
    throw new Error('Worksheet is invalid. Ensure you have validated the worksheet first.');
  }

  const invalidRows = [];
  const validRows = [];

  // Iterate over all rows that have values in a worksheet
  //Format: {resourceId:1101,villageId:1101,value:9.17000007629394,date:"2012-08-26T00:00:00.000Z",postcode:313603},
  worksheet.eachRow(function(row, rowNumber) {
    if (rowNumber <= headingRow) return; //skip rows before heading

    //Temp skip other rows
    if (rowNumber > 10) return;

    const result =  processRow(worksheetType, row, rowValidator);
    let processedRow = result[0];
    let valid = result[1];

    if (!valid) {
      invalidRows.push(processedRow);
      return;
    }

    validRows.push(processedRow);
  });

  console.log(`Parsed excel file with ${validRows.length} valid rows, ${invalidRows.length} invalid rows`);

  return {
    rows: validRows,
    warnings: invalidRows
  };
}

const processReadingRow = (row, rowValidator) => {
  const reading = {resourceId:null, villageId:null, value:null, postcode:null, date:null};
  reading.resourceId = row.values[rowValidator['resourceId']];
  reading.villageId = !isNullOrUndefined(reading.resourceId) && `${reading.resourceId}`.substring(0, 2);
  valueCm = row.values[rowValidator['wt_depth']];
  reading.value = valueCm/100;
  reading.postcode = row.values[rowValidator['postcode']];
  raw_date = row.values[rowValidator['date']];
  reading.date = !isNullOrUndefined(raw_date) && parseDateForgivingly(raw_date);

  const valid =  isRowValid(reading);
  return [reading, valid];
}

const processRegistrationRow = (row, rowValidator) => {

  const lat = row.values[rowValidator.lat];
  const lng = row.values[rowValidator.lng];
  let geo = null;
  //loopback complains if any of these are null
  if (lat && lng) {
    geo = new loopback.GeoPoint({
      lat:row.values[rowValidator.lat],
      lng:row.values[rowValidator.lng]
    });
  }

  let resource = {
    id: row.values[rowValidator.id],
    geo: geo,
    last_value: 0,
    last_date: 0,
    owner: row.values[rowValidator.owner],
    type:rowValidator.type,
    postcode:row.values[rowValidator.postcode],
  };

  //TODO: tidy, this logic is getting too messy
  if (rowValidator.type === 'well'){
    resource.elevation = row.values[rowValidator.optional.well.elevation];
    resource.well_depth = row.values[rowValidator.optional.well.well_depth];
  }


  //TODO: fix this, so it works better with the optionals etc.
  const valid = isRowValid(resource)
  if (valid === true) {
    console.log("found valid row:", resource);
  }
  return [resource, valid];
}

module.exports = {
  filterEmptyWorksheets:filterEmptyWorksheets,
  parseDateForgivingly: parseDateForgivingly,
  processWorksheet: processWorksheet,
  readExcelFile: readExcelFile,
  validateReadingHeadingRow: validateReadingHeadingRow,
  validateWorksheet: validateWorksheet,
  processRow: processRow,
};
