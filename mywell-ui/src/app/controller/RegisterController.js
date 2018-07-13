import { assert } from "../../../node_modules/@firebase/util";

angular.module('controller.register', [])
.controller('RegisterController', ($scope, $location, $rootScope, $ionicModal, $ionicPopup, $ionicHistory, ApiService, CachingService)  => {

  let leafletMap = null;
  $scope.resources = [
    "well",
    "checkdam",
    "raingauge"
  ];

  $scope.refreshCoords = () => {
    if (angular.isNullOrUndefined(leafletMap)) {
      return;
    }

    const center = leafletMap.getCenter();
    $scope.form.lat = '';
    $scope.form.lng = '';

    $scope.form.lat = center.lat;
    $scope.form.lng = center.lng;
  }


  $scope.locate = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        leafletMap.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
        $scope.form.lat = position.coords.latitude;
        $scope.form.lng = position.coords.longitude;
        $scope.$apply();

        //TODO: drop pin
      }, function (err) {
        console.log(err);
        var alertPopup = $ionicPopup.alert({
          title: 'GeoLocation Error',
          template: err.message
        });
      });
    }
    else {
      console.log("Geolocation is not supported by this browser.");
      var alertPopup = $ionicPopup.alert({
        title: 'GeoLocation Error',
        template: "Geolocation is not supported"
      });
    }
  }

  const init = function() {
    $scope.form = {
      telephone: '',
      lat: '',
      lng: '',
      email: '',
      type: '',
      owner: '',
      village_name: '',
      postcode: '',
      max_wt_depth: '',
    }

    $scope.locate();

    //load an unsaved resource from localstorage if exists
    // $scope.form = {
    //   ...CachingService.getResourceFromCache(),
    // }

    //fix up because data format isn't nice:
    if (!angular.isNullOrUndefined($scope.form.elevation)) {
      $scope.form.max_wt_depth = $scope.form.elevation;
    }
   

    //Set up the Leaflet Map
    if (angular.isNullOrUndefined(leafletMap)){
      leafletMap = L.map('leafletMapRegister', { zoomControl:false, dragging: true, doubleClickZoom:false }).setView([24.593, 74.198], 17);
      L.tileLayer('https://api.mapbox.com/styles/v1/lewisdaly/ciuqhjyzo00242iphq3wo7bm4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGV3aXNkYWx5IiwiYSI6ImNpdXE3ajltaDAwMGYyb2tkdjk2emx3NGsifQ.wnqFweA7kdijEtsgjTJIPw')
       .addTo(leafletMap);
     }
  }
  init();

  /**
   * Check the map to see if we have a valid lat and lng, if we do, move the map the correct place
   */
  const checkAndUpdateMap = () => {
    if (angular.isNullOrUndefined($scope.form.lat) || angular.isNullOrUndefined($scope.form.lng)) {
      return
    }
    if ($scope.form.lat.toString().length < 5 || $scope.form.lng.toString().length < 4) {
      return;
    }
    //We have a valid(ish) lat and lng
    leafletMap.panTo(new L.LatLng($scope.form.lat, $scope.form.lng));
  }

  $scope.$watch('form.lat', checkAndUpdateMap);
  $scope.$watch('form.lng', checkAndUpdateMap);


  /**
   * Validate the form, return a list of errors if false
   * If the list of errors is empty, the form is valid
   */
  const validateForm = (form) => {
    console.log("form is:", form);
    const errors = [];

    if ((form.village_name === '') || form.village_name.trim() === "") {
      errors.push("Village Name is required");
    }

    if (form.owner === '') {
      errors.push("Owner Name is required");
    }

    if (form.type === '') {
      errors.push("Type of resource is required");
    }

    if ((form.lat === '') || (form.lng === '')) {
      errors.push("Latitude and Longitude are required");
    }

    //The phone number library sets form.telephone to undefined if it't not valid
    if (!form.telephone === ''  && form.email === '') {
      errors.push("Phone Number or email is required");
    }

    if (typeof form.telephone === 'undefined') {
      errors.push("Phone number is invalid");
    }

    if ((form.email !== '') && (!isEmailValid(form.email))) {
      errors.push("Email is invalid.");
    }

    //Specific types:
    if (form.type === 'well') {
      if (form.max_wt_depth === '') {
        errors.push("For new Wells, Max watertable depth is required.");
      } else { 
        try {
          const maxDepthInt = parseInt(form.max_wt_depth);
          assert(maxDepthInt > 0);
        } catch (err) {
          errors.push("Max Watertable Depth is invalid.");
        }
      }
    }

    return errors;
  }

  const formatErrorsForAlert = (errors) => {
    const content = errors.reduce((acc, curr) => {
      return acc + `<li>${curr}<li>`
    }, '');

    return `<ul>${content}</ul>`;
  }

  const isEmailValid = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  $scope.submit = function(form) {
    if (form === false) {
      $scope.modal.hide();
      return;
    }

    let isFormValid = true;
    const errors = validateForm(form);
    if (errors.length > 0) {
      isFormValid = false;
    }

    if (!isFormValid) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: `Please correct the following errors: ${formatErrorsForAlert(errors)}`
      });

      return;
    }


    //For now, assume all villages are just 11
    const villageId = 11;

    const data = {
      geo: {
        lat: form.lat,
        lng: form.lng
      },
      owner: form.owner,
      village_name: form.village_name.trim(),
      email: form.email,
      well_depth: form.max_wt_depth,
      type:form.type,
      postcode: form.postcode,
      villageId: villageId,
      elevation: 0
    };

    ApiService.registerWell(data)
    .then(function(response) {
      var alertPopup = $ionicPopup.alert({
        title: 'Thanks!',
        template: `Created a new ${form.type} in ${form.village_name.trim()}. Please check your email or phone for the ID of the ${form.type}`
      });

      //navigate back if possible
      $ionicHistory && $ionicHistory.goBack();
    })
    .catch(function(err) {
      if (err.status === 0) {
        displayMessage("Connection Error", "Saving. Please try again later.");
        CachingService.addResourceToCache(data);
        return;
      }

      console.log("err", err);
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: err.statusText
      });
    });
  }



})
