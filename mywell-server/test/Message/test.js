const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');

const Message = app.models.Message;

describe.only('Message tests', function() {
  describe('Query', () => {
    it('handles a query', () => {
      console.log(true);

      // const expected = 'Reading successfully recorded. ReadingId'
      //
      // return parseMessage("SMA 000 313603 170125 1111 1500")
      //   .then(response => {
      //     const modifiedResponse = response.split(':')[0];
      //     assert.equal(modifiedResponse, expected);
      //   });
    });
  });
});
