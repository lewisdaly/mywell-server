const randomize = require('randomatic');

const getError = (statusCode, message) => {
  let error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const sqlQuery = (app, query) => {
  return new Promise((resolve, reject) => {
    const datasource = app.models.Reading.dataSource;

    datasource.connector.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      return resolve(results);
    });
  });
}

const getApp = (model) => {
  return new Promise((resolve, reject) => {
    model.getApp((err, app) => {
      if (err) return reject(err);

      resolve(app);
    });
  });
}

const getUserForMobile = (mobile_number) => {
  return `user:${mobile_number}`;
};

const getUserForEmail = (email) => {
  return `user:${email}`;
}

const createTempPassword = () => {
  return randomize('*', 15);
};

const createLoginCode = () => {
  return randomize('0', 6);
};

const disableAllMethods = function disableAllMethods(model, methodsToExpose) {
    if(model && model.sharedClass) {
        methodsToExpose = methodsToExpose || [];

        var modelName = model.sharedClass.name;
        var methods = model.sharedClass.methods();
        var relationMethods = [];
        var hiddenMethods = [];

        try {
            Object.keys(model.definition.settings.relations).forEach(function(relation)
            {
                relationMethods.push({ name: '__findById__' + relation, isStatic: false });
                relationMethods.push({ name: '__destroyById__' + relation, isStatic: false });
                relationMethods.push({ name: '__updateById__' + relation, isStatic: false });
                relationMethods.push({ name: '__exists__' + relation, isStatic: false });
                relationMethods.push({ name: '__link__' + relation, isStatic: false });
                relationMethods.push({ name: '__get__' + relation, isStatic: false });
                relationMethods.push({ name: '__create__' + relation, isStatic: false });
                relationMethods.push({ name: '__update__' + relation, isStatic: false });
                relationMethods.push({ name: '__destroy__' + relation, isStatic: false });
                relationMethods.push({ name: '__unlink__' + relation, isStatic: false });
                relationMethods.push({ name: '__count__' + relation, isStatic: false });
                relationMethods.push({ name: '__delete__' + relation, isStatic: false });
            });
        } catch(err) {}

        methods.concat(relationMethods).forEach(function(method) {
            var methodName = method.name;
            if(methodsToExpose.indexOf(methodName) < 0)
            {
                hiddenMethods.push(methodName);
                model.disableRemoteMethod(methodName, method.isStatic);
            }
        });

        if(hiddenMethods.length > 0) {
            console.log('\nRemote methods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
        }
    }
};

module.exports = {
  getError: getError,
  sqlQuery: sqlQuery,
  getApp: getApp,
  getUserForMobile: getUserForMobile,
  getUserForEmail: getUserForEmail,
  createTempPassword: createTempPassword,
  createLoginCode: createLoginCode,
  disableAllMethods: disableAllMethods
};
