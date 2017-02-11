

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


module.exports = {
  getError: getError,
  sqlQuery: sqlQuery,
}
