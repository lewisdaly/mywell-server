var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Reading) {

  //TODO: before saving, we can add the village id, implied from the resource id.


  /*
   * Before saving, validate, and update the correct resource table
   */
   Reading.observe('before save', function updateModels(ctx, next) {
    //get app
    if (ctx.options && ctx.options.skipUpdateModels) {
      return next();
    }

    //check to see if new reading is more recent  - if so, update the resource table
    const reading = (typeof ctx.instance === "undefined") ? ctx.currentInstance : ctx.instance;

    // Use a double filter, instead of find by id {"where":{"and": [{"postcode":"123123"}, {"id":123}]}}
    Reading.app.models.resource.find({where:{and: [{id:reading.resourceId},{postcode:reading.postcode}]}}, (err, resources) => {
      if (err) next(err);

      // console.log("found resource", resources);
      if (isNullOrUndefined(resources) || isNullOrUndefined(resources[0])) {
        //TODO: throw error, return 400
        return next(new Error("resource doesnt exist!"));
      }

      let resource = resources[0];

      //check to see if this a new reading, or a reading on the same day
      const newEntry = moment(reading.date).isSameOrAfter(resource.last_date);
      if (newEntry) {
        resource.updateAttributes(
          {last_date:reading.date, last_value:reading.value}, (err, updatedResource) => {
            if (err)  next(err);

             next();
        });
      } else {
        let err = new Error("Reading recorded, but resource not updated. A newer reading exists.")
        err.statusCode = 206;
        return next(err);

      }
    });
   });
};
