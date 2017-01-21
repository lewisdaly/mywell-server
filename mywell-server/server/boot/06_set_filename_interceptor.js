module.exports = function (app) {
  console.log("[06_set_filename_interceptor] running");

  app.dataSources.storage.connector.getFilename = function(fileInfo, req, res) {
    var origFilename = fileInfo.name;

    // optimisticly get the extension
    var parts = origFilename.split('.'),
        extension = parts[parts.length-1];

    // Using a local timestamp + user id in the filename (you might want to change this)
    var newFilename = (new Date()).getTime()+'.'+extension;
    return newFilename;
  }
}
