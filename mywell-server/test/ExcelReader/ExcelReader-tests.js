// const app = require('../../.');
const assert = require('assert');
const Excel = require('exceljs');
const ExcelReader = require('../../common/ExcelReader');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');


describe('it parses excel files correctly', () => {

  it('deals with dates correctly', () => {
    assert.equal('2012-10-28',ExcelReader.parseDateForgivingly("28/10/12"));
    assert.equal('2014-04-27',ExcelReader.parseDateForgivingly("27/04/2014"));
    assert.equal('2014-07-23',ExcelReader.parseDateForgivingly("7/23/14"));
    assert.equal('2014-07-27',ExcelReader.parseDateForgivingly("07/27/2014"));
    assert.equal('2014-05-04',ExcelReader.parseDateForgivingly("2014-05-04T00:00:00.000Z"));
    assert.equal('2013-12-01',ExcelReader.parseDateForgivingly("2013-12-01T00:00:00.000"));
  });

  it('finds the correct row number for headings', () => {
    const workbook = createValidWorkbook();
    const validWorksheet = ExcelReader.filterEmptyWorksheets(workbook)[0];
    const invalidWorksheet = createWorksheetInvalidHeadings();
    //The heading is on the first row
    assert.equal(ExcelReader.validateHeadingRow(validWorksheet, 5)[1], 1);
    //No valid heading row
    assert.equal(ExcelReader.validateHeadingRow(invalidWorksheet, 5)[1], -1);
  });


  it('assigns the correct column for the cell value', () => {
    const firstWorksheet = createWorkSheetValidHeadings(0);
    const secondWorksheet = createWorkSheetValidHeadings(1);

    assert.deepEqual(ExcelReader.validateHeadingRow(firstWorksheet, 5)[0], {postcode: 1,
      resourceId: 2,
      date: 3,
      wt_depth: 4 });
    assert.deepEqual(ExcelReader.validateHeadingRow(secondWorksheet, 5)[0], {postcode: 4,
      resourceId: 1,
      date: 2,
      wt_depth: 3 });
  });

  it('skips empty worksheets', () => {
    const workbook = createEmptyWorksheets();
    const validSheets = ExcelReader.filterEmptyWorksheets(workbook);

    assert.equal(validSheets.length, 1);
    return Promise.resolve(true);
  });

  it('processes the worksheet correctly', () => {

    const worksheet = createWorkSheetValidHeadings(0);
    let processed = ExcelReader.processWorksheet(worksheet);
    assert.equal(processed.readings.length, 3);
    assert.equal(processed.warnings.length, 1);

    return loadActualTestFile()
      .then(worksheets => {
        processed = ExcelReader.processWorksheet(worksheets[0]);
        assert.deepEqual(processed.readings[10], { resourceId: 1211,villageId: '12',value: 1902,postcode: 313603,date: '2012-10-14' });
        assert.deepEqual(processed.readings[30], { resourceId: 1211,villageId: '12',value: 3170,postcode: 313603,date: '2012-02-26' });
        assert.deepEqual(processed.warnings, []);
      });
  }).timeout(10000);
});


/* stubs */
const createEmptyWorksheets = () => {
  var workbook = new Excel.Workbook();
  var emptySheet = workbook.addWorksheet('Empty Sheet');
  var validSheet = workbook.addWorksheet('Valid Sheet');

  validSheet.columns = [
    { header: 'postcode', key: 'postcode', width: 10 },
    { header: 'villageId', key: 'villageId', width: 10 },
    { header: 'date', key: 'date', width: 10 },
    { header: 'reading', key: 'reading', width: 10}
  ];

  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,1), reading: 2460});
  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,2), reading: 2460});
  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,3), reading: 2460});
  return workbook;
}

const createValidWorkbook = () => {
  var workbook = new Excel.Workbook();
  var validSheet = workbook.addWorksheet('Valid Sheet');

  validSheet.columns = [
    { header: 'postcode', key: 'postcode', width: 10 },
    { header: 'wellId', key: 'wellId', width: 10 },
    { header: 'date', key: 'date', width: 10 },
    { header: 'watertable depth', key: 'reading', width: 10}
  ];

  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,1), reading: 2460});
  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,2), reading: 2460});
  validSheet.addRow({postcode: 313804, villageId: 1260, date: new Date(1970,1,3), reading: 2460});
  return workbook;
}


const createWorksheetInvalidHeadings = () => {
  var workbook = new Excel.Workbook();
  var validSheet = workbook.addWorksheet('Valid Sheet');

  validSheet.columns = [
    { header: 'pste', key: 'pste', width: 10 },
    { header: 'thingo', key: 'thingo', width: 10 },
    { header: 'date', key: 'date', width: 10 },
    { header: 'watertable depth', key: 'reading', width: 10}
  ];

  validSheet.addRow({pste: 313804, thingo: 1260, date: new Date(1970,1,3), reading: 2460});
  return validSheet;
}

const createWorkSheetValidHeadings = (order) => {
  var workbook = new Excel.Workbook();
  var validSheet = workbook.addWorksheet('Valid Sheet');
  validSheet.columns = [];

  // order.forEach(columnName => {
  //   validSheet.columns.push({
  //     header: columnName, key: columnName, width:10
  //   });
  // });
  if (order == 0) {
    validSheet.columns = [ { header: 'postcode', key: 'postcode', width: 10 }, { header: 'wellId', key: 'wellId', width: 10 }, { header: 'date', key: 'date', width: 10 }, { header: 'wt_depth', key: 'wt_depth', width: 10}];
  } else {
    validSheet.columns = [{ header: 'wellId', key: 'wellId', width: 10 }, { header: 'date', key: 'date', width: 10 }, { header: 'wt_depth', key: 'wt_depth', width: 10}, { header: 'postcode', key: 'postcode', width: 10 }];
  }

  validSheet.addRow({postcode: 313804, wellId: 1260, date: new Date(1970,1,1), wt_depth: 2460});
  validSheet.addRow({postcode: 313804, wellId: 1260, date: new Date(1970,1,1), wt_depth: 2460});
  validSheet.addRow({postcode: 313804, wellId: 1260, date: new Date(1970,1,1), wt_depth: 2460});
  validSheet.addRow({postcode: 313804, date: new Date(1970,1,1), wt_depth: 2460});


  return validSheet;
}

const loadActualTestFile = () => {
  return ExcelReader.readExcelFile('/usr/src/app/test/ExcelReader/dharta_data.xlsx');
}

describe.skip('it handles csv files correctly')
