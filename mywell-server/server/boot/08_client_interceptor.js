var loopback = require("loopback");
var LoopBackContext = require('loopback-context');


module.exports = function(app) {
  app.use(loopback.context());
  app.use(loopback.token());
  app.use(function (req, res, next) {
    if (!req.accessToken) return next();
    app.models.Client.findById(req.accessToken.userId, function(err, user) {
      if (err) return next(err);
      //Ignore the error -its non critical
      if (!user) return next();
      // if (!user) return next(new Error('No client with this access token was found.'));
      res.locals.currentUser = user;
      var loopbackContext = LoopBackContext.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('currentClient', user);
      }

      next();
    });
  });
}
