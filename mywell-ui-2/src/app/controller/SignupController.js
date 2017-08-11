angular.module('controller.signup',[])
.controller('SignupController', function($scope, $location, SignupService, AuthenticationService, $window) {
	$scope.user = {};

	$scope.signup = function() {
    //TODO: Verify the email, passwords etc.
    //TODO: fix: for some reason email is coming back null..
    $window.location.reload(true);

    SignupService.signUp($scope.user)
    .then(function(data) {
    	console.log("Controller success: " + data);

        //Now log in the new user
        AuthenticationService.Login($scope.user)
        .then(function(response) {
            //Get the logged in user info
            AuthenticationService.getCredentials()
            .then(function(credentialsData) {
                AuthenticationService.SetCredentials($scope.user.username, credentialsData.data.userID, $scope.user.password);
                $location.path('/tab/map');
            },
            function(data) {
                console.log("Error getting user info");
            });
        },
        function(data) {
            console.log("Login Error");
        });
    },
    function(data) {
    	console.log("contorller Error");
    })
  }
});
