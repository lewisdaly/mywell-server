module.exports = function(User) {


  User.remoteMethod(
    'login',
    {
      accepts: [
        {arg:'password', type:'string'}
      ],
      'description': 'login using the access code',
      http: {path:'/login', verb:'get'},
      returns: {arg:'login', type:'json'}
    }
  );

  User.login = function(password, cb) {
    //TODO: define these elsewhere... but this will work for now:

    if (password === "12345") {return cb(null, true);}
    if (password === "qwerty") {return cb(null, true);}
    if (password === "LEWIS") {return cb(null, true);}
    if (password === "HEYTHERE") {return cb(null, true);}
    if (password === "marvi") {return cb(null, true);}

    return cb(null, false);
  }

};
