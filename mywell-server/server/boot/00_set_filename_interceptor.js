module.exports = function (app) {
  console.log("[06_set_filename_interceptor] running");

  app.dataSources.storage.connector.getFilename = function(fileInfo, req, res) {
    var origFilename = fileInfo.name;

    var parts = origFilename.split('.'),
        extension = parts[parts.length-1];

    var newFilename = (new Date()).getTime()+'.'+extension;
    return newFilename;
  }
  // next();
}
