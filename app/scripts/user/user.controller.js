;(function (){

	'use strict';
	
	angular.module('Beers')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location) {

			var user = UserFactory.user();
			if(user){
				return $location.path('/');
			}

			$scope.registerUser = function (userObj) {
				if ($scope.user.password !== $scope.pass){
					alert('Passwords have to match')
				}
				UserFactory.register(userObj);
			},

			$scope.loginUser = function (userObj) {
				UserFactory.login(userObj);
			},

			$rootScope.$on('user:loggedin', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:registered', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:loggedout', function (){
				$location.path('/')
			});

		}

	]);

}());