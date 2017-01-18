const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const fs = require('fs');

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  }
  catch (err){
    return false;
  }
}

describe.only('it parses excel files correctly', () => {

  it('fails if file cannot be found', () => {
    return app.models.Reading.processExcelFile('container1', 'not_file')
      .then(() => {
        console.log('this should not happen');
        return Promise.reject('This should not happen');
      })
      .catch(err => {
        if (err.statusCode === 404) return Promise.resolve(true);
        return Promise.reject(err);
      });
  });

  it.only('Processes an uploaded excel file', () => {
    //Copy excel file to correct place
    if (!fileExists('/tmp/storage/container1/test_data.xlsx')) {
      fs.createReadStream('/usr/src/app/test/ExcelReader/test_data.xlsx')
        .pipe(fs.createWriteStream('/tmp/storage/container1/test_data.xlsx'));
    }

    return app.models.Reading.processExcelFile('container1', 'test_data.xlsx')
    .then((res) => {
      console.log("hey", res);
      return Promise.resolve(true);
      //TODO: verify that the readings have been created, and cleanup
    })
    .catch(err => {
      console.log('err', err);
      return Promise.reject(err);
    });
  }).timeout(100000);

});
