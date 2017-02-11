const app = require('../../.');
const assert = require('assert');
const isNullOrUndefined = require('util').isNullOrUndefined;
const moment = require('moment');
const mockDate = require('mockdate');
const Enums = require('../../common/Enums')

//TODO: we should probably make our own test data... but I can't be bothered atm



describe('GET /resource_stats', () => {

  describe('gets the difference from june 1st', () => {
    it('gets the closest reading to june 1st for a resource', () => {
      mockDate.set(moment('2017-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, null, Enums.ReadingType.INDIVIDUAL, 1352)
        .then(reading => {
          assert.equal(moment(reading.date).format(), moment("2012-07-29T00:00:00.000Z").format());
          assert.equal(reading.value, 18.074634);
        })
        .then(() => cleanup());
    });

    it('gets the closest reading to june 1st for a village', () => {
      mockDate.set(moment('2014-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, Enums.ResourceType.WELL, Enums.ReadingType.VILLAGE, 13)
        .then(reading => {
          assert.equal(moment(reading.date).format(), moment("2014-06-01T00:00:00.000Z").format());
          assert.equal(reading.value, 21.700600);
        })
        .then(() => cleanup());
    });

    it('gets the closest reading to june 1st for a postcode', () => {
      mockDate.set(moment('2014-06-17'));

      return app.models.ResourceStats.getClosestReadingFromDate(null, Enums.ResourceType.WELL, Enums.ReadingType.POSTCODE, 313603)
        .then(reading => {
          console.log(reading);
          assert.equal(moment(reading.date).format(), moment("2014-06-01T00:00:00.000Z").format());
          assert.equal(reading.value, 21.38892);
        })
        .then(() => cleanup());
    });

    it('gets the closest last june', () => {
      let lastJune = null;

      mockDate.set(moment('2017-06-17'));
      lastJune = app.models.ResourceStats.getLastJune();
      assert.equal(lastJune.format(), '2017-06-01T00:00:00+00:00');

      mockDate.set(moment('2017-01-17'));
      lastJune = app.models.ResourceStats.getLastJune();
      assert.equal(lastJune.format(), '2016-06-01T00:00:00+00:00');


      mockDate.reset();
    });
  });

});


const cleanup = () => {
  mockDate.reset();
}
