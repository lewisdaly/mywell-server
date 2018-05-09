//Inspired by: http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx


import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

(function () {
    'use strict';
    angular.module('service.authentication',[])
    .factory('AuthenticationService', function($http, $rootScope, $timeout, $location, $localstorage, UserService){

        var service = {};

        service.Login = Login;
        service.getCredentials = getCredentials;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.getAccessToken = getAccessToken;
        service.Logout = Logout;
        service.tryLastTokenLogin = tryLastTokenLogin;
        service.clearLastUser = clearLastUser;
        service.firebaseLogin = firebaseLogin;


        //TODO: this should probably be in its own service, but I'm being lazy. 
        const config = {
            apiKey: REACT_APP_FB_API_KEY,
            authDomain: REACT_APP_FB_AUTH_DOMAIN,
            databaseURL: REACT_APP_FB_DATABASE_URL,
            projectId: REACT_APP_FB_PROJECT_ID,
            storageBucket: REACT_APP_FB_STORAGE_BUCKET,
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }

        const auth = firebase.auth();
        const fs = firebase.firestore();

        return service;

        /**
         * Log the user un anonymously and get the access token from remote config
         */
        function firebaseLogin() {
            return auth.signInAnonymously()
            .then(userCredential => {
              console.log("signed into firebase:", userCredential);
              return fs.doc('legacy/mywell').get();
            })
            .then(doc => {
                const accessToken = doc.data().accessToken;  
                setAccessToken(accessToken);
                return true;
            });
        }

        function Login(user) {
            //This isn't ideal, just the way that this was structured.
            return LoginService.login(user);
        }

        function Logout() {
            // loginService.logout(); //TODO: fix, right now this doesn't work. But clearing credentials works for now.
            ClearCredentials()
        }

        function getCredentials() {
            return UserService.getUserDetails()
        }

        function getAccessToken() {
          //TODO: change to firebase token
          return $rootScope.globals.accessToken;
        }

        function setAccessToken(accessToken) {
            $rootScope.globals = {
                accessToken
            };
            $localstorage.setObject('globals', $rootScope.globals);
        }

        function tryLastTokenLogin() {
          //get the token and try the endpoint
          const lastUser = $localstorage.getObject('last_user', null);
          if (!lastUser || !lastUser.currentUser) {
            console.log("No last user found");
            return Promise.reject('No last user');
          }

          return $http({
            method: 'get',
            headers: {'Content-Type':'application/json'},
            url: `${SERVER_URL}/api/Clients/isLoggedIn?access_token=${lastUser.currentUser.authToken}`
          })
          .then(() => {
            SetCredentials(lastUser, lastUser.currentUser.authToken);
          })
          .catch(err => {
            console.log("Error: ", err);
            if (err.statusCode === 401) {
              $localstorage.delete('last_user');
            }

            return Promise.reject(err);
          });
        }


        function SetCredentials(user, authToken) {
            $rootScope.globals = {
                currentUser: {
                    userID:user.id,
                    authToken: authToken,
                    username: user.user_name,
                    verified: user.verified,
                    service: user.service
                }
            };

            $localstorage.setObject('globals', $rootScope.globals);
        }

        function ClearCredentials() {
            //Save the user to try and login again if possible
            const globals = $localstorage.getObject('globals', null);
            if (globals && globals.currentUser && globals.currentUser.authToken) {
              $localstorage.setObject('last_user', globals);
            }

            $rootScope.globals = {};
            $localstorage.delete('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }

        function clearLastUser() {
          $localstorage.delete('globals');
          $localstorage.delete('last_user');
        }

    })

// Base64 encoding service used by AuthenticationService
var Base64 = {

    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this.keyStr.charAt(enc1) +
            this.keyStr.charAt(enc2) +
            this.keyStr.charAt(enc3) +
            this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };


})();
