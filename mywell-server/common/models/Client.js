'use strict'

const Utils = require('../Utils');
const MessageUtils = require('../MessageUtils');
const moment = require('moment');

module.exports = (Client) => {
  Utils.disableAllMethods(Client, ['login', 'logout']);

  Client.remoteMethod('loginWithCode', {
    accepts: [
      {arg: 'mobile_number', required:true, type: 'string', description: 'The mobile number the code was sent to. Including area code.'},
      {arg: 'code', required:true, type: 'number', description: 'The code from the message'},
    ],
    description: 'Login using a 1 time code.',
    returns: {arg: 'response', type: 'object', root:true},
    http: {path: '/loginWithCode', verb: 'post', status: 200}
  });

  Client.loginWithCode = (mobile_number, code) => {
    let app = null;
    let loginCode = null;

    const filter = {
      where: {and: [
        {mobile_number: mobile_number},
        {code: code},
        {expiry: {gt: moment.utc()}}
      ]},
      order: 'expiry DESC',
      limit: 1
    };

    return Utils.getApp(Client)
      .then(_app => app = _app)
      .then(() => app.models.LoginCode.find(filter))
      .then(loginCodes => {
        if (!loginCodes || loginCodes.length === 0) {
          return Promise.reject(Utils.getError(401, `LoginCode not found or expired for mobile_number: ${mobile_number} and code: ${code}`));
        }

        loginCode = loginCodes[0];
        //TODO: we should probably write a flag to the LoginCode to make sure it can't be used again.
        return Client.login({username:loginCode.userId, password:loginCode.tempPassword});
      });
  };
}
