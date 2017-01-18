const Excel = require('exceljs');
const moment = require('moment');
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
  return isFalsyDictValid(row, null);
}

//If any value is equal to the falsy value, return false!
const isFalsyDictValid = (dict, falseValue) => {
  isValid = true;
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

const validateHeadingRow = (worksheet, end) => {

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
 * Find all rows based on headings or content
 * Call this to check and see if our worksheet is valid before parsing it.
 * @returns boolean
 */
const validateWorksheet = (worksheet) => {
  headingsValid = false;
  contentValid = true;

  //First, check to see what headings we have
  //we need something like: [Post code, Well ID,Date,Watertable depth cm]
  validatorTuple = validateHeadingRow(worksheet, 5);
  rowValidator = validatorTuple[0];
  headingRow = validatorTuple[1];

  // console.log(validatorTuple);
  return isValidatorValid(rowValidator);

  //TODO: we could also check some rows for validity
}

/**
 * Process the validated worksheet into a json array of coolness.
 * @return an array of reading objects, ready to be saved to the database!
 */
const processWorksheet = (worksheet) => {
  //First check to see if the worksheet is valid. If not, throw an exception!
  validatorTuple = validateHeadingRow(worksheet, 5);
  rowValidator = validatorTuple[0];
  headingRow = validatorTuple[1];

  invalidRows = [];
  validRows = [];

  if (!isValidatorValid(rowValidator)) {
    throw new Error('Worksheet is invalid. Ensure you have validated the worksheet first.');
  }

  // Iterate over all rows that have values in a worksheet
  //Format: {resourceId:1101,villageId:1101,value:9.17000007629394,date:"2012-08-26T00:00:00.000Z",postcode:313603},
  worksheet.eachRow(function(row, rowNumber) {
    if (rowNumber <= headingRow) return; //skip rows before heading

    const reading = {resourceId:null, villageId:null, value:null, postcode:null, date:null};
    reading.resourceId = row.values[rowValidator['resourceId']];
    reading.villageId = !isNullOrUndefined(reading.resourceId) && `${reading.resourceId}`.substring(0, 2);
    valueCm = row.values[rowValidator['wt_depth']];
    reading.value = valueCm/100;
    reading.postcode = row.values[rowValidator['postcode']];
    raw_date = row.values[rowValidator['date']];
    reading.date = !isNullOrUndefined(raw_date) && parseDateForgivingly(raw_date);

    if (!isRowValid(reading)) {
      invalidRows.push(reading);
      return;
    }

    validRows.push(reading);
  });

  console.log(`Parsed excel file with ${validRows.length} valid rows, ${invalidRows.length} invalid rows`);

  return {
    readings: validRows,
    warnings: invalidRows
  };
}

module.exports = {
  filterEmptyWorksheets:filterEmptyWorksheets,
  parseDateForgivingly: parseDateForgivingly,
  processWorksheet: processWorksheet,
  readExcelFile: readExcelFile,
  validateHeadingRow: validateHeadingRow,
  validateWorksheet: validateWorksheet
}
