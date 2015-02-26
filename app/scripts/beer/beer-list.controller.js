(function (){
	'use strict';

	angular.module('Beers')

	.controller('BeerController', ['$scope', 'rootURL', '$http',
		function ($scope, rootURL, $http) {	

			$http.get(rootURL + 'beers').success( function (data){
				$scope.beerCol = data;
			});

			$scope.Drank = function (x) {
				x.status = 'drank';
				$http.put(rootURL).success( function () {
					console.log('You have had this beer!');
				})
			}
		}
	]);

}());