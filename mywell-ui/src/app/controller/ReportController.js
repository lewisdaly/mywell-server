'use strict';

const MODULE_NAME = 'controller.report';

angular.module(MODULE_NAME, [])
.controller('ReportController', function($scope, $ionicPopup, $http, $rootScope, LoginService, ApiService, CachingService, Upload) {

  /**
   * Init
   */

  //Set up the form
  resetForm();

  $scope.$on('$ionicView.enter', function(e) {
    checkUserStatus();
    $scope.cachedReports = CachingService.getReportCache();
  });

  $scope.$on('login-state-changed', function(e) {
    checkUserStatus();
  })

  $scope.refreshUser = function() {
    //Perform login again - in case user's verification status has changed:
    LoginService.reAuthenticateUser()
    .then(function(response){
      var currentUser = $rootScope.globals.currentUser;
      console.log("currentUser: " + JSON.stringify(currentUser));
      checkUserStatus();

    },function(error) {
    });
  }

  const readingTypes = {
    well: {
      id: 'well',
      name: 'Well',
      valuePlaceholder: 'Depth to Water Level (m)'
    },
    raingauge: {
      id: 'raingauge',
      name: 'Rainfall',
      valuePlaceholder: 'Rainfall amount (mm)'
    },
    checkdam: {
      id: 'checkdam',
      name: 'Checkdam',
      valuePlaceholder: 'Water Column Height (m)'
    }
  }

  $scope.readingType = readingTypes.well;
  $scope.setReadingType = (readingType) => {
    $scope.readingType = readingTypes[readingType];
  }


  function checkUserStatus() {
    $scope.isUserNotLoggedIn = false;
    $scope.isUserNotVerified = false;
    $scope.isUserLoggedInAndVerified = false;

    var currentUser = $rootScope.globals.currentUser;

    if (!currentUser) {
      $scope.isUserNotLoggedIn = true;
    }
    else if (currentUser.verified == false) {
      $scope.isUserNotVerified = true;
    }
    else
    {
      $scope.isUserLoggedInAndVerified = true;
    }
  }

  const displayErrorMessageOrUnknown = function(error) {
    if (error.status && error.status === 0 || error.status === -1) {
      return displayMessage("Connection Error", "Having trouble connecting. Please try again later.");
    }

    if (error.data && error.data.error && error.data.error.message) {
      return displayMessage("Error", error.data.error.message);
    }

    displayMessage("Error", "An unknwown error has occoured. Please try again later.");
  }

  /**
   * Validate the form.
   * @returns boolean
   */
  const validateForm = function(form) {
    if (($scope.form.postcode == null) || ($scope.form.postcode == null) || ($scope.form.postcode== null) || ($scope.form.postcode == null))
    {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: "Please fill out all the fields"
      });
      return false;
    }

    return true;
  }

  /**
   * Format the form's data in a consistent format
   */
  const getFormData = function(form) {
    return {
      postcode: $scope.form.postcode,
      value: $scope.form.value,
      resourceId: $scope.form.resourceId,
      villageId: `${$scope.form.resourceId}`.substring(0,2),
      date: $scope.form.date.toDateString()
    }
  }

  $scope.saveReport = function(form) {
    if (!validateForm(form)) {
      return;
    }

    const data = getFormData(form);

    CachingService.addReportToCache(data);
    $scope.cachedReports = CachingService.getReportCache();
    resetForm();
  }

  // Validate and submit form
  $scope.sendReport = function(form) {
    if (!validateForm(form)) {
      return;
    }

    ApiService.updateReading(getFormData(form))
    .then(function(response) {
      displayMessage("Thanks!", "Submitted successfully.")
      resetForm();
    })
    .catch(function(err) {
      //apparently this error code has changed?
      if (err.status === 0 || err.status === -1) {
        displayMessage("Connection Error", "Saving for later submission.");
        CachingService.addReportToCache(data);
        $scope.cachedReports = CachingService.getReportCache();
        resetForm();
      } else {
        displayErrorMessageOrUnknown(err);
      }
    });
  }

  $scope.submit = function(index) {
    let report = CachingService.getReportAtIndex(index);
    ApiService.updateReading(report)
    .then(function(response) {
      console.log("Submitted successfully", response);
      displayMessage("Thanks!", "Submitted successfully.")
      CachingService.deleteReportAtIndex(index);
      $scope.cachedReports = CachingService.getReportCache();
    })
    .catch(function(err) {
      displayErrorMessageOrUnknown(err);
    });
  }


  $scope.delete = function(index) {
    CachingService.deleteReportAtIndex(index);
    $scope.cachedReports = CachingService.getReportCache();
  }

  /**
   *  Helper functions
   */
  function displayMessage(title, message) {
    var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });
  }

  function resetForm () {
    $scope.form = {};
    $scope.form.date =  new Date();
  }


  /**
   * File uploading
   */
  $scope.upload = function (file) {
    //show loading indicator manually
    $rootScope.$broadcast('loading:show');
      Upload.upload({
          url: `${SERVER_URL}/api/containers/container1/upload`,
          data: {file: file }
      }).then(function (resp) {
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          return Promise.resolve(resp.data.result.files.file[0]);
      }, function (resp) {
          console.log('Error status: ' + resp.status);
          throw new Error(resp);
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      })
      .then((fileResponse) => {
        return ApiService.processExcelFile(fileResponse);
      })
      .then((res) => {
        console.log(res);
        displayMessage('Done', `Saved ${res.data.created} readings, with ${res.data.warnings.length} warnings`);
      })
      .catch(err => {
        console.error('error', err);
        if (err.status === 500) {
          return displayMessage('Error', 'Could not process file. Please ensure the format is correct.');
        }

        displayMessage('Error', err.statusText);
      });
  };

  $scope.clearFile = function() {
    $scope.file = null;
  }

  $scope.submitFile = function() {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.upload($scope.file);
    }
  };

});
