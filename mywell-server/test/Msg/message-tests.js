const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');

const Message = app.models.Message;

describe('Message tests', function() {
  describe('SMA 000', () => {
    it('handles a submission for a well', () => {
      const expected = 'Reading successfully recorded. ReadingId'

      return parseMessage("SMA 000 313603 170125 1111 1500")
        .then(response => {
          const modifiedResponse = response.split(':')[0];
          assert.equal(modifiedResponse, expected);
        });
    });

    it('handles a submission for a raingauge');
    it('handles a submission for a checkdam');
  });

  describe('SMA 999', () => {
    it('handles a query for a well', () => {
      const expected = `Village: Badgaon\nWell Owner: Bagdi Ram s/o Kajod Ji\nResource: well - 1111\nLast Updated: 22/05/17\n\nCurrent WT Depth: 15 m\nNo reading for 1 month ago\nNo reading for 1 year ago`;

      return parseMessage("SMA 999 313603 1111")
        .then(response => {
          assert.equal(response, expected);
        });
    });

    it('handles a query for a raingauge');
    it('handles a query for a checkdam');
    it('handles a query for a village');
    it('handles a query for a postcode');
  });
});
