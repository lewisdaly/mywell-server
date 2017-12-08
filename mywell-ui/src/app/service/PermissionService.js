'use strict';

angular.module('service.permission', [])
.service('PermissionService', function() {

  return({
    checkLocationAndRequest,
  });

  function checkLocationAndRequest() {

    return new Promise(function(resolve, reject) {
      if (angular.isNullOrUndefined(window.cordova)) {
        //We must be on web
        return resolve(true);
      }

      const permissions = window.cordova.plugins.permissions;
      const locationPermissionCode = permissions.ACCESS_COARSE_LOCATION;
      permissions.checkPermission(locationPermissionCode, (status) => {
        if (status.hasPermission) {
          return resolve(true);
        }

        //Ask for permission
        console.log("no location permission, asking now")
        permissions.requestPermission(locationPermissionCode, (status) => {
          if (status.hasPermission) {
            return resolve(true);
          }

          return reject();
        },
        (err) => {
          reject(err);
        });
      },
      (err) => {
        reject(err);
      });
    });
  }

});



/**
var permissions = cordova.plugins.permissions;
permissions.checkPermission(permission, successCallback, errorCallback);
permissions.requestPermission(permission, successCallback, errorCallback);
permissions.requestPermissions(permissions, successCallback, errorCallback);
*/
