;(function (){

	'use strict';

	angular.module('Beers')

	.controller('NavController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location){

			var user = UserFactory.user();
			
			if(user){
				$scope.loggedin = true;
				$scope.user = user;
			} else {
				$scope.loggedin = false;
			}

			$scope.logout = function (){
				UserFactory.logout();				
			}

			$scope.$on('user:loggedout', function (){
				$scope.loggedin = false;
			});

			$scope.$on('user:loggedin', function (){
				$scope.loggedin = true;
			});

		}

	]);

}());