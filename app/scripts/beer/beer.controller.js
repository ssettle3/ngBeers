(function (){

	angular.module('Beers')

	.controller('BeerController', ['$scope', '$location', 'BeerFactory', '$rootScope',
		function ($scope, $location, BeerFactory, $rootScope) {	

			BeerFactory.fetch().success( function (data){
				$scope.beerCol = data.results;
			});

			$scope.addBeer = function (w) {
				BeerFactory.post(w);
			}

			$rootScope.$on('beer:added', function (){
				$location.path('/beerlist')
			})
		}
	]);

}());