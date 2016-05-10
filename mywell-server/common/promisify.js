module.exports = {};


/**
 * The following function is used to enable functions that normally have a callback that expects two parameters,
 * to become promise based.
 *
 * e.g. a function can be modified by adding the lines below marked as "NEWLINE":
 *
 *        function(a, b, ..., z, cb) {
 *NEWLINE   return new Promise((resolve, reject) => { cb = promisify.cbPromiseOverwriteFunction(resolve, reject,cb);
 *          ...
 *          // For failure
 *          return cb(err, optionalObject);
 *          ...
 *          // For success
 *          return cb(null, responseObject);
 *          ...
 *NEWLINE   });
 *        }
 *
 *
 * @param resolve
 * @param reject
 * @param cb_original
 * @returns {Function}
 */
module.exports.cbPromiseOverwriteFunction = function(resolve, reject, cb_original) {
  return (err, data) => {
    if (err) reject(err); else resolve(data);
    (typeof cb_original !== 'undefined') && cb_original(err, data);
  }
};

/**
 * The following function is used to enable calling a function does not return a promise, but takes a callback to be
 * easily converted to return a promise as follows:
 *
 *       Promise.all([
 *         new Promise((resolve, reject) => {
 *           app.models.Group.getClosestRetailPricingStructure(organisationGroupId, promisify.promiseDoneFunction(resolve, reject));
 *         }),
 *         new Promise((resolve, reject) => {
 *             app.models.Group.findById(organisationGroupId, promisify.promiseDoneFunction(resolve, reject));
 *         })
 *       ])
 *
 *
 * @param resolve
 * @param reject
 * @param cb_original
 * @returns {Function}
 */
module.exports.promiseDoneFunction = (resolve, reject) => {
  return function(err, data) {
    if (err) return reject(err);
    resolve(data);
  }
};
