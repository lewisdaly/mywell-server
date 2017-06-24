

var properties = {
  mobile_number: {
    type: 'number',
    required: true
  }
};
var options = {}
var user = loopback.Model.extend('user', properties, options);
