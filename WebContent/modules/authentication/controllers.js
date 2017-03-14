'use strict';
 
angular.module('Authentication')
 
.controller('LoginController',
    ['$http','$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($http,$scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
        
        $http.get('modules/authentication/json/users.json').success(function(data){
    			$scope.credentials=data;
    	});
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password,$scope.credentials, function(response) {
                if(response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);