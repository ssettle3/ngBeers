;(function (){

	angular.module('Beers')

	.controller('UserController', ['$scope', 'UserFactory', '$rootScope', '$location',
		function ($scope, UserFactory, $rootScope, $location) {

			$scope.register = function () {
				if ($scope.user.password !== $scope.pass){
					alert('Passwords have to match')
				}
				UserFactory.register($scope.user);
			},

			$scope.login = function () {
				UserFactory.login($scope.user);
			},

			$rootScope.$on('user:loggedin', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('user:registered', function (){
				$location.path('/beerlist')
			});

		}

	]);

}());