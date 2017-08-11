/* Loaded in index.html for now */
// import angular from 'angular';
// import ionic from 'ionic';

import React from 'react'
import ReactDOM from 'react-dom'

// import 'ngReact'
import 'ng-file-upload'

import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'

import '../style/app.css'
import '../style/ionic.css'
import '../style/tachyons.min.css'

import './utils.js'
import './constants'

import './controller/AppController'
import './controller/LoginController'
import './controller/MapController'
import './controller/MapDetailController'
import './controller/RegisterController'
import './controller/ReportController'
import './controller/SettingsController'
import './controller/SignupController'
import './controller/VillageDetailController'

import './service/ApiService'
import './service/AuthenticationService'
import './service/LoginService'
import './service/SignupService'
import './service/UserService'


import { react2angular } from 'react2angular'
import TestComponent from './component/TestComponent'

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

let app2 = angular.module(MODULE_NAME, [
  'module.utils',
  'module.constants',

  //Controllers
  'controller.app',
  'controller.settings',
  'controller.signup',
  'controller.login',
  'controller.map',
  'controller.register',
  'controller.report',
  'controller.map-detail',
  'controller.village-detail',

  //Services
  'service.authentication',
  'service.login',
  'service.signup',
  'service.user',
  'service.api',

  //Libs
  'ionic',
  'ngFileUpload',
  'react',
])
// .component('TestComponent', react2angular(TestComponent, ['fooBar', 'baz']))
.directive('app', app)
.run(($ionicPlatform, $rootScope, $ionicLoading, $location, $http, $localstorage) => {
  $ionicPlatform.ready(() => {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
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

.config(($stateProvider, $urlRouterProvider, $provide) => {
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

    };
  }]);

  // catch exceptions out of angular
  window.onerror = function(message, url, line, col, error){
    var stopPropagation = true;
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

    console.log('exception', data);
    return stopPropagation;
  };
})
.controller('helloController', function($scope) {
  $scope.person = { fname: 'Clark', lname: 'Kent' };
});

angular.isNullOrUndefined = (val) => {
  return angular.isUndefined(val) || val === null;
}
// angular.module('testComponent', []).component('TestComponent', react2angular(TestComponent, ['fooBar', 'baz']))

//TODO: this is almost working! (React is finally loading)
//Lewis please look here: https://github.com/ngReact/ngReact/blob/master/examples/hello-controller-as/app.js
// let reactModule = angular.module('app', ['react']);

var HelloComponent = React.createClass({
  propTypes: {
    fname : React.PropTypes.string.isRequired,
    lname : React.PropTypes.string.isRequired
  },
  render: function() {
    return <span>Hello {this.props.fname} {this.props.lname}</span>;
  }
})
app2.value('HelloComponent', HelloComponent);
// app2.directive( 'hello', function( reactDirective ) {
//   return reactDirective( HelloComponent );
// });

// angular
// .module('testComponent', [])
// .component('TestComponent', {
//     bindings: {
//         comment: '<',
//     },
//     controller: function() {
//         ReactDOM.render(<TestComponent />, $element[0]);
//     }
// });

export default MODULE_NAME;
