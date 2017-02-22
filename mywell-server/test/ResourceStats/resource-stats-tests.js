const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');
const Enums = require('../../common/Enums')

//TODO: we should probably make our own test data... but I can't be bothered atm

describe('GET /resource_stats', () => {

  afterEach(() => {
    return Promise.resolve(true)
      .then(() => cleanup());
  });

  describe('average calculations', () => {
    //These averages have the chance of being different every time. As long as they are to the closest integer, we don't mind
    it('gets the current monthly average for a postcode', () => {
      mockDate.set(moment('2012-08-01'));

      return app.models.ResourceStats.getCurrentPostcodeAverage('well', 313603)
        .then(reading => {
          assert.equal(Math.floor(reading.value), 19);
        })
    });

    it('gets the current monthly average for a village', () => {
      mockDate.set(moment('2012-08-01'));

      return app.models.ResourceStats.getCurrentVillageAverage(12, 'well', 313603)
        .then(reading => {
          assert.deepEqual(Math.floor(reading.value), 20);
        })
    });
  });

  describe('gets the difference from june 1st', () => {
    afterEach(() => {
      return Promise.resolve(true)
        .then(() => cleanup());
    });

    it('returns a 404 when no current reading for a resource', () => {
      mockDate.set(moment('2016-08-17'));

      return app.models.ResourceStats.getDifferenceFromJune(null, Enums.ReadingType.INDIVIDUAL, 1352, 313603)
        .then(result => {
          return Promise.reject("This should've failed!");
        })
        .catch(err => {
          if (err.statusCode !== 404) {
            return Promise.reject(err);
          }
        });
    });

    it('gets the difference from June for a resource', () => {
      mockDate.set(moment('2013-08-17'));

      return app.models.ResourceStats.getDifferenceFromJune(null, Enums.ReadingType.INDIVIDUAL, 1352, 313603)
        .then(result => {
          assert.equal(moment(result.pastReadingDate).format(), moment("2012-07-29T00:00:00.000Z").format());
          assert.equal(result.difference, -0.7446340000000014);
        });
    });

    it('gets the difference from June for a village', () => {
      mockDate.set(moment('2013-08-17'));

      return app.models.ResourceStats.getDifferenceFromJune(Enums.ResourceType.WELL, Enums.ReadingType.VILLAGE, 13, 313603)
        .then(result => {
          assert.equal(moment(result.pastReadingDate).format(), moment("2013-06-01T00:00:00+00:00").format());
          assert.equal(result.difference, -7.088951000000002);
        });
    });

    it('gets the difference from June for a postcode', () => {
      mockDate.set(moment('2013-08-17'));

      return app.models.ResourceStats.getDifferenceFromJune(Enums.ResourceType.WELL, Enums.ReadingType.POSTCODE, 13, 313603)
        .then(result => {
          assert.equal(moment(result.pastReadingDate).format(), moment("2013-06-01T00:00:00+00:00").format());
          assert.equal(result.difference, -6.671807999999999);
        });

    });

    it('gets the closest reading to june 1st for a resource', () => {
      mockDate.set(moment('2017-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, null, Enums.ReadingType.INDIVIDUAL, 1352, 313603)
        .then(reading => {
          assert.equal(moment(reading.date).format(), moment("2012-07-29T00:00:00.000Z").format());
          assert.equal(reading.value, 18.074634);
        })
    });

    it('gets the closest reading to june 1st for a village', () => {
      mockDate.set(moment('2014-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, Enums.ResourceType.WELL, Enums.ReadingType.VILLAGE, 13, 313603)
        .then(reading => {
          assert.equal(moment(reading.date).format(), moment("2014-06-01T00:00:00.000Z").format());
          assert.equal(reading.value, 21.700600);
        })
    });

    it('gets the closest reading to june 1st for a postcode', () => {
      mockDate.set(moment('2014-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, Enums.ResourceType.WELL, Enums.ReadingType.POSTCODE, null, 313603)
        .then(reading => {
          console.log(reading);
          assert.equal(moment(reading.date).format(), moment("2014-06-01T00:00:00.000Z").format());
          assert.equal(reading.value, 21.38892);
        })
    });

    it('gets the closest last june', () => {
      let lastJune = null;

      mockDate.set(moment('2017-06-17'));
      lastJune = app.models.ResourceStats.getLastJune();
      assert.equal(lastJune.format(), '2017-06-01T00:00:00+00:00');

      mockDate.set(moment('2017-01-17'));
      lastJune = app.models.ResourceStats.getLastJune();
      assert.equal(lastJune.format(), '2016-06-01T00:00:00+00:00');
    });
  });

});


const cleanup = () => {
  mockDate.reset();
}
