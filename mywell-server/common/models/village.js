var moment = require('moment');
var isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = function(Village) {

  Village.remoteMethod('updateVillageByVillageIdAndPostcode', {
    accepts: [
      {
        arg: 'data',
        type: 'object',
        required: true,
        description: '{ village body }',
        http: { source: 'body' },
      }
    ],
    description: 'Update a village given an id & postcode',
    returns: {arg: 'village', type: 'village', root:true},
    http: {path: '/updateVillageByVillageIdAndPostcode', verb: 'post', status:200}
  });

  Village.updateVillageByVillageIdAndPostcode = (data) => {
    let app = null;
    let resource = null;

    if (!data) {
      return Promise.reject(Utils.getError(400, `Data is undefined for request`));
    }

    if (!data.id || !data.postcode) {
      return Promise.reject(Utils.getError(400, `Id and postcode is required`));
    }

    const filter = {
      where: { and: [
        {id:data.id},
        {postcode:data.postcode}
      ]}
    };

    return Utils.getApp(Village)
      .then(_app => app = _app)
      .then(() => Village.findOne(filter))
      .then(_village => {
        village = _village;

        if (!village) {
          return Promise.reject(Utils.getError(404, `Could not find village for id: ${data.id} and postcode: ${data.postcode}`));
        }

        if (data.coordinates && data.coordinates.lat && data.coordinates.lng) {
           village.coordinates = {
             lat: data.geo.lat,
             lng: data.geo.lng
           };
         }
        if (data.name) { village.name = data.name; }
        return village.save();
      })
  };


  Village.remoteMethod(
    'closestVillage',
    {
      accepts: [{arg: 'villageId', type:'number'} ],
      'description':'gets the historical information for the Closest Village with the given idPrefix',
      http: {path:'/closestVillage', verb:'get'},
      returns: {arg:'response', type:'string'}
    }
  );


  Village.closestVillage = (villageId, cb) => {

    var date = moment(); //right now
    Village.getHistoricalFromDate(villageId, date)
    .then((response) => {
      cb(null, response);
    })
    .catch((err) => {
      cb(err);
    });
  }

  /**
   * Get the historical averages for this village by date
   */

  Village.getHistoricalFromDate = function(villageId, date) {

    return new Promise((resolve, reject) => {
      //assume we already have a moment
      const thisMonthString = date.clone().format('YYYYMM');
      const lastMonthString = date.clone().subtract(1, 'months').format('YYYYMM');
      const lastYearString = date.clone().subtract(12, 'months').format('YYYYMM');

      console.log("month strings", lastMonthString, lastYearString);

      const sql = `SELECT village.name, village_id, DATE_FORMAT(date,\'%Y%m\') as month, AVG(value) as average `
                           + `FROM reading JOIN village on village.id = reading.village_id where village_id =? GROUP BY DATE_FORMAT(date, \'%Y%m\');`

      //TODO: this isn't optimal, but it works for now.
      Village.dataSource.connector.execute(sql, [villageId], (err, response) => {
        if (err) reject(err);

        if (isNullOrUndefined(response) || response.length == 0) {
          return reject(new Error('no historical data found'));
        }

        let responseObject = {
          name:response[0].name,
          thisMonth:{},
          lastMonth:{},
          lastYear:{},
        };
        response.forEach((row) => {
          if (row.month === thisMonthString) {
            responseObject.thisMonth = row;
          }
          if (row.month === lastMonthString) {
            responseObject.lastMonth = row;
          }
          if (row.month === lastYearString) {
            responseObject.lastYear = row;
          }
        });

        resolve(responseObject);
      });
    });
  }
};
