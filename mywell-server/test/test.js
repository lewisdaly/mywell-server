/* global global */
/* global describe */
/* global require */
/* global before */
/* global after */
// const app = require('../.');

describe('tests the application', () => {
  require('./ResourceStats/resource-stats-tests.js');
  //removed atm, nt
  // require('./Reading/reading-tests.js'); //For some reason this turns up as pending if it is second.. weird.
  // require('./ExcelReader/ExcelReader-tests.js');
  require('./Message/test.js');
});
