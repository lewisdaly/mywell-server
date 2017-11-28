const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');

const Message = app.models.Message;

describe('Message tests', function() {
  this.timeout(10000);

  describe('Query', () => {
    it('errors with old query', () => {
      const expected = 'Message Code must be S or Q\nFor example: MYWL S 313603/1105/1130'

      return parseMessage("SMA 000 313603 170125 1111 1500")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          assert.equal(err.message, expected);
        });
    });

    it('handles a save without a date', () => {
      return parseMessage("MYWL S 313603/1105/1100")
        .then(response => {
          console.log("response, ", response);
        })
    });

    it.only('handles a save with a date', () => {
      return Message.parseMessage("MYWL S 313603/1112/170601/1100")
        .then(response => {
          console.log("response, ", response);
        })
    });

    it('handles a save with bad date', () => {
      return parseMessage("MYWL S 313603/1105/ABCDEF/1100")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          if (err.message === "This should've failed") {
            return Promise.reject(err);
          }
          console.log(err.message);
        });
    });

    it('handles a save with wrong number of fields', () => {
      return parseMessage("MYWL S 313603/1105/ABCDEF/1100/1234")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          if (err.message === "This should've failed") {
            return Promise.reject(err);
          }
          console.log(err.message);
        });
    });


    //handles save with missing postcode
    //handles save with missing resourceId
  });
});
