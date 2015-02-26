(function (){

	angular.module('Beers')

	.controller('BeerController', ['$scope', '$location', 'BeerFactory', '$rootScope',
		function ($scope, $location, BeerFactory, $rootScope) {	

			BeerFactory.fetch().success( function (data){
				$scope.beerCol = data.results;
			});

			$scope.addBeer = function (w) {
				w.imageURL = $scope.beerImage;
				BeerFactory.post(w);
			},

			$scope.addImage = function (i){
				BeerFactory.attImg(i);
			},

			$rootScope.$on('beer:added', function (){
				$location.path('/beerlist')
			});

			$rootScope.$on('beer:imageUploaded', function (event, img) {
				$scope.beerImage = img.url;
				$scope.$apply();
			});

		}
	]);

}());