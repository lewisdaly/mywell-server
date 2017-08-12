import React from 'react';
// import angular from 'angular';

// require('ionic');


// import './ionic/js/ionic';
// var angular = require('angular');

// Add Angular/Ionic dependencies
// require('angular-animate');
// require('angular-sanitize');
// require('angular-ui-router');
// require('ionic/js/ionic');
// require('ionic/js/ionic-angular');

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppController',
    controllerAs: 'app'
  }
};

class AppController {
  constructor() {
    this.url = 'https://github.com/preboot/angular-webpack';
  }
}

const MODULE_NAME = 'app';

// angular.module(MODULE_NAME, [])
//   .directive('app', app)
//   .controller('AppController', AppController);


angular.module('app', [
  'ionic',
  // 'ngMap',
  // 'ngFileUpload',
  // 'starter.controllers',
  // 'report.controllers',
  // 'controller.settings',
  // 'rainapp-constants',
  // 'ngIOS9UIWebViewPatch',
  // 'controller.signup',
  // 'controller.login',
  // 'controller.map',
  // 'controller.register',
  // 'controller.map-detail',
  // 'controller.village-detail',
  //
  // 'service.authentication',
  // 'service.login',
  // 'service.signup',
  // 'service.user',
  // 'service.api',
  // 'rainapp.utils',
  // 'AdalAngular',
  // 'intlpnIonic',
  // 'react'
  ])

.directive('app', app)
.controller('AppController', AppController)
.run(($ionicPlatform, $rootScope, $ionicLoading, $location, $http, $localstorage) => {
  $ionicPlatform.ready(() => {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
  });
})
});

  //keep user logged in after page refresh
  //http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx
  $rootScope.globals = $localstorage.getObject('globals');
  if ($rootScope.globals){
    // if ($rootScope.globals.currentUser) {
    //   $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    // }
  } else {
    $rootScope.globals = {};
  }

  //Refer to: http://learn.ionicframework.com/formulas/loading-screen-with-interceptors/
  //Loading indicators and callbacks
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  })

  $rootScope.$on('loading:show-slow', function() {
    $ionicLoading.show({
      template: 'Please wait, this may take up to 10 minutes</br><ion-spinner></ion-spinner>'
    });
  })

  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  })
})

//The ADAL Provider - Auth and Stuff
.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'adalAuthenticationServiceProvider',
  function ($compileProvider, $stateProvider, $urlRouterProvider, $httpProvider, adalProvider) {
    adalProvider.init(
    {
      instance: 'https://login.microsoftonline.com/',
      tenant: '35a32751-a7a4-47e9-830e-d320e5e2ce25',//'contoso.onmicrosoft.com', //not sure if this is right...
      clientId: '18841449-2afd-4fdb-9246-0f7e461c61f8',
      extraQueryParameter: 'nux=1',
      //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    },
    $httpProvider
    );
  }])

// .config(function (ngIntlTelInputProvider) {
//    ngIntlTelInputProvider.set({initialCountry: 'in', onlyCountries: ["in", "au"]});
//  })

.config(function($stateProvider, $urlRouterProvider, $provide, debug, adalAuthenticationServiceProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignupController'
  })


  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',

  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    // requireADLogin: true,
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        //TODO: change this name
        controller: 'MapCtrl'
      }
    }
  })
  // Map detail page
  .state('tab.map-detail', {
    url: '/map/:postcode/:resourceId',
    views: {
      'tab-map': {
        templateUrl: 'templates/map-detail.html',
        controller: 'MapDetailController'
      }
    }
  })
  //Village Detail Page
  .state('tab.village-detail', {
    url: '/map/:postcode/village/:villageId',
    views: {
      'tab-map': {
        templateUrl: 'templates/village-detail.html',
        controller: 'VillageDetailController'
      }
    }
  })
  .state('tab.report', {
    url: '/report',
    // requireADLogin: true,
    views: {
      'tab-report': {
        templateUrl: 'templates/tab-report.html',
        controller: 'ReportController'
      }
    }
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    // requireADLogin: true,
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    // requireADLogin: true,
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsController'
      }
    }
  })

  //Register  page
  .state('tab.settings-register', {
    url: '/settings/register',
    views: {
      'tab-settings': {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

  // catch exceptions in angular - http://forum.ionicframework.com/t/error-tracking-in-angular/8641
  $provide.decorator('$exceptionHandler', ['$delegate', function($delegate){
    return function(exception, cause){
      $delegate(exception, cause);

      var data = {
        type: 'angular',
        url: window.location.hash,
        localtime: Date.now()
      };
      if(cause)               { data.cause    = cause;              }
      if(exception){
        if(exception.message) { data.message  = exception.message;  }
        if(exception.name)    { data.name     = exception.name;     }
        if(exception.stack)   { data.stack    = exception.stack;    }
      }

      if(debug == 1){
        console.log('exception', data);
        window.alert('Error: '+data.message);
      } else {
        track('exception', data);
      }
    };
  }]);

  // catch exceptions out of angular
  window.onerror = function(message, url, line, col, error){
    var stopPropagation = debug ? false : true;
    var data = {
      type: 'javascript',
      url: window.location.hash,
      localtime: Date.now()
    };
    if(message)       { data.message      = message;      }
    if(url)           { data.fileName     = url;          }
    if(line)          { data.lineNumber   = line;         }
    if(col)           { data.columnNumber = col;          }
    if(error){
      if(error.name)  { data.name         = error.name;   }
      if(error.stack) { data.stack        = error.stack;  }
    }

    if(debug == 1){
      console.log('exception', data);
      window.alert('Error: '+data.message);
    } else {
      track('exception', data);
    }
    return stopPropagation;
  };
});

angular.isNullOrUndefined = function(val) {
  return angular.isUndefined(val) || val === null;
}


export default MODULE_NAME;
