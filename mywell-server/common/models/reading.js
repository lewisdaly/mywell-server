var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Reading) {


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

    Reading.app.models.resource.findById(reading.resourceId, (err, resource) => {
      if (err) next(err);

      console.log("found resource", resource);
      if (isNullOrUndefined(resource)) {
        //TODO: throw error, return 400
        return next(new Error("resource doesnt exist!"));
      }

      //check to see if this a new reading, or a reading on the same day
      const newEntry = moment(reading.date).isSameOrAfter(resource.last_date);
      if (newEntry) {
        console.log("New entry!");
        resource.updateAttributes(
          {last_date:reading.date, last_value:reading.value}, (err, updatedResource) => {
            if (err)  next(err);

             next();
        });
      } else {
        next();
      
      }
    });
   });
};
