'use strict';

const Utils = require('../Utils');
const MessageUtils = require('../MessageUtils');
const moment = require('moment');

module.exports = function(LoginCode) {
  Utils.disableAllMethods(LoginCode, []);

  LoginCode.remoteMethod('sendSMSCode', {
   accepts: {arg: 'mobile_number', required:true, type: 'number', description: 'The mobile number to send the code to. Including area code.'},
   description: 'Send the login SMS code to the given number',
   returns: {arg: 'response', type: 'object', root:true},
   http: {path: '/sendSMSCode', verb: 'post', status: 200}
  });

  LoginCode.sendSMSCode = (mobile_number) => {
    let app = null;
    let user = null;
    const tempPassword = Utils.createTempPassword();
    const code = Utils.createLoginCode();
    const userId = Utils.getUserForMobile(mobile_number);

    const where = {
      where: {username: userId}
    };

    const model = {
      username: userId,
      password: tempPassword,
      mobile_number: mobile_number
    };

    return Utils.getApp(LoginCode)
      .then(_app => app = _app)
      .then(() => app.models.Client.findOrCreate(where, model))
      .then(_users => {
        user = _users[0];
        const fiveMinutes = moment.utc().add(5, 'minutes');

        return LoginCode.create({
          expiry: fiveMinutes,
          mobile_number: mobile_number,
          code: code,
          userId: userId,
          tempPassword: tempPassword
        });
      })
      .then(_loginCode => {
        console.log("WARNING: storing password in plaintext. TODO: fix");
        user.password = tempPassword;
        return user.save();
      })
      .then(_user => {
        console.log("Login code is: " + code);
        //TODO: Send twilio message
        const message = MessageUtils.getSMSCodeMessage(code);
        return MessageUtils.sendSMSMessage(message, mobile_number);
      });
  };
}
