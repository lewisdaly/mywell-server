const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');

const Message = app.models.Message;

describe('Message tests', function() {

  describe('Query', () => {
    it('errors with too few parameters', () => {
      return Message.parseMessage("MYWL Q")
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

    it('errors with too many parameters', () => {
      return Message.parseMessage("MYWL Q 313603/1104/12")
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


  });


  /**
    MYWL Q 313603/1024
    MYWL Q 313603/10
    MYWL Q 313603
  */

  describe('Save', () => {
    it('errors with old query', () => {
      const expected = 'Message Code must be S or Q\nFor example: MYWL S 313603/1105/1130'

      return Message.parseMessage("SMA 000 313603 170125 1111 1500")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          assert.equal(err.message, expected);
        });
    });

    it('handles a save without a date', () => {
      return Message.parseMessage("MYWL S 313603/1105/1100")
        .then(response => {
          console.log("response, ", response);
        })
    });

    it('handles a save with a date', () => {
      return Message.parseMessage("MYWL S 313603/1112/170601/1100")
        .then(response => {
          console.log("response, ", response);
        })
    });

    it('handles a save with bad date', () => {
      return Message.parseMessage("MYWL S 313603/1105/ABCDEF/1100")
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
      return Message.parseMessage("MYWL S 313603/1105/ABCDEF/1100/1234")
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

    it('handles postcode not found', () => {
      return Message.parseMessage("MYWL S 12345/1105/170101/1100")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          if (err.message === "This should've failed") {
            return Promise.reject(err);
          }
        });
    });

    it('handles resourceId not found', () => {
      return Message.parseMessage("MYWL S 313603/9999/1100")
        .then(response => {
          return Promise.reject("This should've failed");
        })
        .catch(err => {
          if (err.message === "This should've failed") {
            return Promise.reject(err);
          }
        });
    });
  });
});
