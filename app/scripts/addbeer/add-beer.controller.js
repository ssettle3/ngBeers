;(function (){
	'use strict';

	angular.module('Beers')

	.controller('AddController', ['$scope', 'rootURL', '$http', '$location',

		function ($scope, rootURL, $http, $location) {

			$scope.addBeer = function () {

				$http.post(rootURL + 'beers', $scope.aBeer)
					.success( function (data) {
						$location.path('/beerlist');
					}
				);
			}

		}

	]);

}());