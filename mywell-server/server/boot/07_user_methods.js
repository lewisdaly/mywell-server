module.exports = function(app) {
  const Client = app.models.Client;

  console.log("Patching client model");
  delete Client.validations.email;
};
